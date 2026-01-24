export interface SearchFilters {
  query: string;
  type?: "all" | "story" | "user" | "section" | "category" | "poll";
  limit?: number;
  offset?: number;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  section?: string;
}

export interface SearchResult {
  type: "story" | "user" | "section" | "category" | "poll";
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  relevance: number;
  metadata?: Record<string, any>;
  url?: string;
}

export interface AutosuggestResult {
  label: string;
  type: string;
  id: string;
  icon?: string;
}