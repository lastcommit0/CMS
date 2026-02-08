📋 Full Flow of the Article-Writing Agent
Your Article-writing-agent is a sophisticated LangGraph-based system that generates complete, research-backed blog posts and news articles with automatic image generation. Here's how it all works:

Architecture Overview
Code
INPUT (Topic + Date)
         ↓
    [ROUTER NODE]
         ↓
    [RESEARCH NODE?] ← Conditional: Only if research needed
         ↓
 [ORCHESTRATOR NODE] ← Plan generation
         ↓
  [FANOUT WORKERS] ← Parallel section writing
         ↓
[REDUCER + IMAGES] ← Merge & generate images
         ↓
   OUTPUT (Final Article)
Detailed Component Breakdown
1. ROUTER NODE (router_node)
Purpose: Decide whether web research is needed

Logic:

Analyzes the topic and current date
Outputs routing decision with three modes:
closed_book (no research): Evergreen content (concepts, how-tos)
recency_days = 3650 (10 years)
hybrid (light research): Mix of evergreen + recent examples
recency_days = 45 (1.5 months)
open_book (deep research): News, trending topics, latest events
recency_days = 7 (1 week)
Output:

Mode decision
Whether research is needed
Search queries if needed (3-10 high-signal queries)
2. RESEARCH NODE (Optional, research_node)
Purpose: Fetch web research using Tavily API

Process:

Takes search queries from router
Calls TavilySearchResults tool for each query (max 6 results per query)
Extracts: title, URL, snippet, publish date, source
Deduplicates by URL
Filters by recency (removes stale articles if open_book mode)
Output:

EvidenceItem list (deduplicated, filtered sources)
3. ORCHESTRATOR NODE (orchestrator_node)
Purpose: Create a detailed blog outline/plan

Input:

Topic
Mode (closed_book/hybrid/open_book)
Evidence from research (if any)
Generates a Plan containing:

blog_title: AI-generated title
audience: Target reader profile
tone: Writing style
blog_kind: Type of blog
explainer (default)
tutorial
news_roundup (forced if open_book)
comparison
system_design
tasks (5-9 sections): Each task has:
id: section number
title: section heading
goal: one-sentence objective for reader
bullets: 3-6 key points to cover
target_words: word count (120-550)
requires_research: citation needed?
requires_citations: must cite sources?
requires_code: include code snippets?
4. FANOUT & WORKER NODES (Parallel execution)
Purpose: Write individual blog sections in parallel

Each Worker receives:

One task from the plan
Full plan context
All evidence
Blog parameters (title, audience, tone, constraints)
Worker writes:

One section in Markdown (heading + content)
Covers ALL bullets in order
Targets word count ±15%
For open_book mode: Only cites provided evidence URLs
For hybrid mode: Adds citations for external claims
If requires_code: Includes minimal code snippet
Output:

Tuple of (task_id, section_markdown)
Accumulated in sections list (one entry per task)
5. REDUCER SUBGRAPH (3-step pipeline)
Step 5a: merge_content
Sorts sections by task ID
Combines all sections in order
Wraps with blog title
Output: Single merged_md document
Step 5b: decide_images
Analyzes markdown
Decides if images improve understanding
Rules:
Max 3 images per blog
Must be technical diagrams/flows (not decorative)
Inserts placeholders: [[IMAGE_1]], [[IMAGE_2]], [[IMAGE_3]]
Generates image prompts for each placeholder
Output:

md_with_placeholders: Markdown with placeholders
image_specs: List of image specs with prompts
Step 5c: generate_and_place_images
For each image spec:
Calls Google Gemini 2.5 Flash image generation
Saves to images/ directory
Replaces placeholder with markdown image link
Graceful fallback: If generation fails, inserts error block instead
Writes final markdown to file: {safe_slug(title)}.md
Frontend Layer (bwa_frontend.py)
Streamlit UI with:

Sidebar inputs:

Topic text area
As-of date picker
Generate button
Past blogs list (saved .md files)
Tabs for viewing output:

Plan tab: Blog title, audience, tone, task table with details
Evidence tab: Source links, publish dates (table view)
Preview tab: Rendered markdown with local images
Images tab: Generated images + download
Logs tab: Real-time execution logs
Download options:

Download markdown only
Download bundle (MD + images as ZIP)
Download images only
Streaming support:

Real-time progress tracking (node-by-node)
State summary: mode, queries, evidence count, tasks, sections done
API Layer (news_agent_api.py)
FastAPI wrapper for news story generation:

Endpoints:
POST /generate-story (Blocking)

Takes: topic, category, mandal, district, as_of date
Returns: Structured GeneratedStory (EditorJS format)
Forces: needs_research=True, recency_days=3 (very recent)
POST /generate-story/stream (Streaming)

Same input
Streams progress events (start → progress → complete/error)
Real-time updates: node name, query count, evidence count, sections
POST /trending-topics (GET news topics)

Category-based trending searches
Uses Tavily API
Returns: Top trending topics with descriptions
GET /health (Health check)

Response Format:
Converts markdown to EditorJS blocks (standard CMS format)
Includes meta tags (keywords, description)
Generates fallback placeholder image if needed
Auto-extracts highlights (first 3 paragraphs)
Provides sources list with URLs
Key Data Structures
Python
State (TypedDict):
├── topic: str                          # Input topic
├── mode: str                           # closed_book/hybrid/open_book
├── needs_research: bool
├── queries: List[str]                  # Search queries
├── evidence: List[EvidenceItem]        # Sources
├── plan: Optional[Plan]                # Blog outline
├── as_of: str                          # Date (YYYY-MM-DD)
├── recency_days: int                   # Freshness threshold
├── sections: List[Tuple[int, str]]     # (task_id, markdown)
├── merged_md: str                      # Combined markdown
├── md_with_placeholders: str           # With [[IMAGE_*]] markers
├── image_specs: List[dict]             # Image generation specs
└── final: str                          # Final output
Complete Execution Flow Example
Input: "Latest AI developments in 2025"

Code
1. ROUTER: 
   - Detects "Latest" → open_book mode
   - Generates queries like "AI breakthroughs 2025", "Latest GPT models"
   
2. RESEARCH:
   - Searches Tavily for recent AI news
   - Filters results from last 7 days
   
3. ORCHESTRATOR:
   - Creates 7-task plan for "News Roundup: AI in 2025"
   - Tasks: Industry overview, New models, Research, Applications, etc.
   
4. WORKERS (Parallel):
   - Task 1 writer: "Industry Overview" (250 words, with citations)
   - Task 2 writer: "Latest Models Released" (280 words, code snippet)
   - Task 3 writer: "Research Breakthroughs" (300 words, citations)
   - ... and so on
   
5. MERGE:
   - Combines all sections into one document
   
6. DECIDE IMAGES:
   - Identifies 2 good places for diagrams
   - Creates prompts for "AI Adoption Timeline" and "Model Comparison Chart"
   
7. GENERATE IMAGES:
   - Calls Gemini to generate both images
   - Replaces [[IMAGE_1]], [[IMAGE_2]] with actual images
   
8. OUTPUT:
   - Final: complete markdown file
   - + 2 generated PNG images in images/ folder
   - + EditorJS JSON for CMS