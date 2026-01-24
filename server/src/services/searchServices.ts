import prisma from "../db";
import { redis, CacheKeys, cacheAside, CACHE_TTL } from "../lib/redis";
import { Prisma } from '.././generated/prisma/client' 
import { SearchFilters, SearchResult, AutosuggestResult } from "../types/searchTypes";

export class SearchService {

  static async globalSearch(filters: SearchFilters) {
    const { query, type = "all", limit = 20, offset = 0 } = filters;

    if (!query || query.trim().length < 2) {
      return { results: [], total: 0 };
    }

    const searchTerm = query.trim().toLowerCase();
    
    const key = CacheKeys.search.base(type, searchTerm, limit, offset);

    return cacheAside(key, CACHE_TTL.SHORT, async () => {
      const results = await this.executeUnifiedSearch(filters);
      return {
        results,
        total: results.length,
        timestamp: new Date().toISOString()
      };
    });
  }

  private static async executeUnifiedSearch(f: SearchFilters): Promise<SearchResult[]> {
    const { query, type, limit, offset, status, dateFrom, dateTo } = f;

    const statusFilter = status ? Prisma.sql`AND s.status = ${status}` : Prisma.empty;
    const dateFromFilter = dateFrom ? Prisma.sql`AND s."publishedAt" >= ${new Date(dateFrom)}` : Prisma.empty;
    const dateToFilter = dateTo ? Prisma.sql`AND s."publishedAt" <= ${new Date(dateTo)}` : Prisma.empty;

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const results = await prisma.$queryRaw<SearchResult[]>`
      WITH search_input AS (
        SELECT
          websearch_to_tsquery('english_unaccent', ${query}) AS tsq,
          ${query}::text AS raw
      )
      SELECT * FROM (
        -- STORIES
        SELECT
          'story' AS type, s.id, s.title, s.excerpt AS description,
          (
            ts_rank_cd(to_tsvector('english_unaccent', s.title || ' ' || COALESCE(s.excerpt, '')), si.tsq) * 0.6
            + CASE WHEN s."publishedAt" > ${oneDayAgo} THEN 0.3 
                   WHEN s."publishedAt" > ${oneWeekAgo} THEN 0.15 ELSE 0.05 END
            + (s.priority * 0.01)
          )::float AS relevance,
          jsonb_build_object('slug', s.slug, 'status', s.status) AS metadata,
          '/stories/' || s.slug AS url
        FROM "Story" s, search_input si
        WHERE (${type} = 'all' OR ${type} = 'story')
          ${statusFilter} ${dateFromFilter} ${dateToFilter}
          AND (to_tsvector('english_unaccent', s.title || ' ' || COALESCE(s.excerpt, '')) @@ si.tsq OR s.title % si.raw)

        UNION ALL

        SELECT
          'user' AS type, u.id, u.name AS title, u.email AS description,
          (similarity(u.name, si.raw) * 0.7 + similarity(u.email, si.raw) * 0.3)::float AS relevance,
          jsonb_build_object('role', u.role, 'email', u.email) AS metadata,
          '/profile/' || u.id AS url
        FROM "User" u, search_input si
        WHERE (${type} = 'all' OR ${type} = 'user')
          AND u.status = 'ACTIVE'
          AND (to_tsvector('english_unaccent', u.name) @@ si.tsq OR u.name % si.raw)

      ) AS combined_results
      WHERE relevance > 0.05
      ORDER BY relevance DESC
      LIMIT ${limit} OFFSET ${offset};
    `;

    return results;
  }
  static async autoSuggest(query: string): Promise<AutosuggestResult[]> {
    if (!query || query.trim().length < 2) return [];

    const searchTerm = query.trim().toLowerCase();
    const cacheKey = CacheKeys.search.autosuggest(searchTerm);

    return cacheAside(cacheKey, 30, async () => {
      const suggestions = await prisma.$queryRaw<
        Array<{ label: string; type: string; id: string }>
      >`
        (SELECT title AS label, 'story' AS type, id FROM "Story" 
         WHERE title ILIKE ${searchTerm + "%"} AND status = 'PUBLISHED' 
         ORDER BY "publishedAt" DESC LIMIT 5)
        UNION ALL
        (SELECT name AS label, 'section' AS type, id FROM "Section" 
         WHERE name ILIKE ${searchTerm + "%"} AND "isActive" = true LIMIT 3)
        UNION ALL
        (SELECT name AS label, 'user' AS type, id FROM "User" 
         WHERE name ILIKE ${searchTerm + "%"} AND status = 'ACTIVE' LIMIT 3)
        UNION ALL
        (SELECT name AS label, 'category' AS type, id FROM "Category" 
         WHERE name ILIKE ${searchTerm + "%"} AND "isActive" = true LIMIT 2)
      `;

      return suggestions.map((s) => ({
        ...s,
      }));
    });
  }
}

//   /**
//    * 2. RECENT SEARCHES (Redis Lists)
//    * Optimization: Added deduplication logic.
//    */
//   static async saveRecentSearch(query: string, userId?: string) {
//     if (!query || query.length < 2) return;
    
//     const cacheKey = CacheKeys.search.recent(userId);
//     const normalizedQuery = query.trim().toLowerCase();

//     // 2026 Logic: Remove existing instance of this query first (Deduplication)
//     // Then push to front. This keeps unique recents.
//     await redis.lrem(cacheKey, 0, normalizedQuery);
//     await redis.lpush(cacheKey, normalizedQuery);
//     await redis.ltrim(cacheKey, 0, 4); // Keep only top 5 for better UX
//     await redis.expire(cacheKey, 86400 * 7); // Extend to 7 days
//   }

//   /**
//    * 3. SEARCH ANALYTICS (Non-blocking)
//    * Optimization: Use fire-and-forget or background processing.
//    */
//   static async trackSearch(data: {
//     query: string;
//     resultsCount: number;
//     userId?: string;
//     selectedId?: string;
//     selectedType?: string;
//   }) {
//     // 2026 Production Standard: Don't 'await' analytics in the request cycle.
//     // Let it run in the background so the user gets their result instantly.
//     prisma.searchLog.create({
//       data: {
//         query: data.query.toLowerCase(),
//         resultsCount: data.resultsCount,
//         userId: data.userId,
//         selectedResultId: data.selectedId,
//         selectedResultType: data.selectedType,
//       },
//     }).catch(err => console.error("Search Analytics Silent Failure:", err));
//   }

//   /**
//    * 4. POPULAR SEARCHES (Weighted by Recency)
//    */
//   static async getPopularSearches(limit = 10): Promise<string[]> {
//     const cacheKey = `${CacheKeys.search.trending()}:popular`;
    
//     return cacheAside(cacheKey, 3600, async () => {
//       const popular = await prisma.searchLog.groupBy({
//         by: ["query"],
//         _count: { query: true },
//         where: {
//           createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
//           resultsCount: { gt: 0 } // Only suggest things that actually yield results
//         },
//         orderBy: { _count: { query: "desc" } },
//         take: limit,
//       });

//       return popular.map((p) => p.query);
//     });
//   }

