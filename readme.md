USER (person)
 ├─ Profile (identity)
 ├─ Manager / Subordinates (hierarchy)
 ├─ CreatedBy (accountability)
 ├─ Roles
 │    └─ Permissions
 ├─ Content (stories, polls, epapers)
 ├─ Actions (edits, votes, priority changes)
 └─ Audit trail




Article-writing-agent is structured as an evolution path from prototype notebooks to deployable app code.

news_agent_api.py: Production API layer (FastAPI) for news generation.
Objective: expose endpoints like /generate-story, /generate-story/stream, and /trending-topics, convert markdown to EditorJS JSON, add metadata/slug/image/source formatting, and return frontend-ready payloads.

bwa_backend.py: Core LangGraph workflow engine.
Objective: do the actual intelligence pipeline: route (closed_book/hybrid/open_book) -> web research (Tavily) -> plan sections -> parallel section writing -> merge -> image planning/generation -> final markdown output.

bwa_frontend.py: Local Streamlit UI for running and inspecting the graph.
Objective: developer/operator interface to generate blogs, view plan/evidence/logs/images, preview markdown, and download markdown/zip bundles.

1_bwa_basic.ipynb: First baseline notebook.
Objective: validate a minimal blog-writer graph (planning + section generation) without advanced routing/research/image layers.

2_bwa_improved_prompting.ipynb: Prompt-engineering iteration.
Objective: improve output quality by tightening system prompts, schema guidance, and section/task instructions.

3_bwa_research.ipynb: Research-enabled version.
Objective: add Tavily-based retrieval + evidence grounding so generated content can cite current sources.

4_bwa_research_fine_tuned.ipynb: Refined research pipeline.
Objective: tune routing/recency/planning behavior for better relevance and fewer weak or unsupported claims.

5_bwa_image.ipynb: Image-capable version.
Objective: add image planning and generation flow with placeholders and insertion into final markdown.

tavily_test.ipynb: Isolated Tavily integration test.
Objective: quickly validate search results quality/shape before wiring Tavily into the full graph.