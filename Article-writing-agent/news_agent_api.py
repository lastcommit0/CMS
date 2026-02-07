"""
News Story Agent API
A FastAPI wrapper around the LangGraph blog writer, adapted for news story generation.
"""

from __future__ import annotations

import os
import re
from datetime import date
from typing import Any, Dict, List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
import json
import asyncio

from dotenv import load_dotenv

load_dotenv()

# Import the compiled graph from bwa_backend
from bwa_backend import app as graph_app, Plan, EvidenceItem

# ============================================================
# FastAPI App
# ============================================================
app = FastAPI(
    title="News Story Agent API",
    description="AI-powered news story generator with real-time web research",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# Request/Response Models
# ============================================================
class GenerateStoryRequest(BaseModel):
    topic: str = Field(..., description="News topic or headline to research and write about")
    category: str = Field(default="General", description="News category (Politics, Sports, Business, etc.)")
    mandal: str = Field(default="", description="Location/Mandal for the story")
    district: str = Field(default="", description="District for the story")
    as_of: Optional[str] = Field(default=None, description="Date for research (YYYY-MM-DD)")


class EditorJSBlock(BaseModel):
    id: str
    type: str
    data: Dict[str, Any]


class EditorJSContent(BaseModel):
    version: str = "1.0"
    blocks: List[EditorJSBlock]


class MetaTags(BaseModel):
    metaKeywords: str
    metaDescription: str
    googleBot: str = "ALLOW"
    excludeIA: bool = False


class SourceItem(BaseModel):
    title: str
    url: str
    published_at: Optional[str] = None
    snippet: Optional[str] = None


class GeneratedStory(BaseModel):
    title: str
    shortTitle: str
    slug: str
    excerpt: str
    content: EditorJSContent
    highlights: Optional[EditorJSContent] = None
    metaTags: MetaTags
    sources: List[SourceItem]
    category: str
    mandal: str
    district: str
    imageUrl: Optional[str] = None


class StreamEvent(BaseModel):
    event: str
    data: Dict[str, Any]


class TrendingTopicsRequest(BaseModel):
    category: str = Field(default="General", description="Category to fetch trending topics for")
    count: int = Field(default=5, ge=1, le=10, description="Number of topics to return")


class TrendingTopic(BaseModel):
    topic: str
    description: str
    category: str


# ============================================================
# Helpers
# ============================================================
def get_placeholder_image(topic: str, category: str) -> str:
    """Generate a placeholder image URL using placehold.co."""
    clean_topic = re.sub(r'[^a-zA-Z0-9\s]', '', topic)[:30].replace(' ', '+')
    colors = {
        "General": "243874/white",
        "Politics": "b91c1c/white",
        "Sports": "15803d/white",
        "Business": "0369a1/white",
        "Technology": "334155/white",
        "Entertainment": "a21caf/white",
        "Local": "ea580c/white",
    }
    color = colors.get(category, "243874/white")
    return f"https://placehold.co/1200x630/{color}?text={clean_topic}"


def safe_slug(title: str) -> str:
    s = title.strip().lower()
    s = re.sub(r"[^a-z0-9 _-]+", "", s)
    s = re.sub(r"\s+", "-", s).strip("-")
    return s[:80] or "news-story"


def markdown_to_editorjs(md: str) -> EditorJSContent:
    """Convert markdown to EditorJS format."""
    blocks: List[EditorJSBlock] = []
    lines = md.strip().split("\n")
    block_id = 0
    
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        
        # Skip empty lines
        if not line:
            i += 1
            continue
        
        # Heading
        if line.startswith("# "):
            blocks.append(EditorJSBlock(
                id=f"block_{block_id}",
                type="heading",
                data={"text": line[2:].strip(), "level": 1}
            ))
            block_id += 1
        elif line.startswith("## "):
            blocks.append(EditorJSBlock(
                id=f"block_{block_id}",
                type="heading",
                data={"text": line[3:].strip(), "level": 2}
            ))
            block_id += 1
        elif line.startswith("### "):
            blocks.append(EditorJSBlock(
                id=f"block_{block_id}",
                type="heading",
                data={"text": line[4:].strip(), "level": 3}
            ))
            block_id += 1
        # List item
        elif line.startswith("- ") or line.startswith("* "):
            items = [line[2:].strip()]
            while i + 1 < len(lines) and (lines[i + 1].strip().startswith("- ") or lines[i + 1].strip().startswith("* ")):
                i += 1
                items.append(lines[i].strip()[2:])
            blocks.append(EditorJSBlock(
                id=f"block_{block_id}",
                type="list",
                data={"style": "unordered", "items": items}
            ))
            block_id += 1
        # Paragraph
        else:
            # Collect consecutive non-empty, non-special lines as one paragraph
            para_lines = [line]
            while i + 1 < len(lines):
                next_line = lines[i + 1].strip()
                if next_line and not next_line.startswith("#") and not next_line.startswith("-") and not next_line.startswith("*"):
                    i += 1
                    para_lines.append(next_line)
                else:
                    break
            blocks.append(EditorJSBlock(
                id=f"block_{block_id}",
                type="paragraph",
                data={"text": " ".join(para_lines)}
            ))
            block_id += 1
        
        i += 1
    
    return EditorJSContent(version="1.0", blocks=blocks)


def extract_keywords(plan: Plan, topic: str) -> str:
    """Extract meta keywords from plan and topic."""
    keywords = set()
    keywords.add(topic.split()[0] if topic else "news")
    if plan:
        for task in plan.tasks[:3]:
            keywords.update(task.tags[:2])
    return ", ".join(list(keywords)[:8])


def extract_description(final_md: str, max_len: int = 160) -> str:
    """Extract meta description from content."""
    # Get first paragraph after title
    lines = final_md.strip().split("\n")
    for line in lines:
        line = line.strip()
        if line and not line.startswith("#"):
            # Clean markdown links
            clean = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', line)
            if len(clean) >= 50:
                return clean[:max_len - 3] + "..." if len(clean) > max_len else clean
    return topic[:max_len]


# ============================================================
# Endpoints
# ============================================================
@app.get("/health")
async def health():
    return {"status": "ok", "service": "news-story-agent"}


@app.post("/generate-story", response_model=GeneratedStory)
async def generate_story(request: GenerateStoryRequest):
    """Generate a news story from a topic."""
    try:
        as_of = request.as_of or date.today().isoformat()
        
        inputs = {
            "topic": request.topic,
            "mode": "",
            "needs_research": True,  # Always research for news
            "queries": [],
            "evidence": [],
            "plan": None,
            "as_of": as_of,
            "recency_days": 3,  # Very recent news
            "sections": [],
            "merged_md": "",
            "md_with_placeholders": "",
            "image_specs": [],
            "final": "",
        }
        
        # Run the graph
        result = graph_app.invoke(inputs)
        
        # Extract data
        final_md = result.get("final", "")
        plan = result.get("plan")
        evidence = result.get("evidence", [])
        
        if not final_md:
            raise HTTPException(status_code=500, detail="Failed to generate story content")
        
        # Build response
        title = plan.blog_title if plan else request.topic
        short_title = title[:50] if len(title) > 50 else title
        slug = safe_slug(title)
        
        content = markdown_to_editorjs(final_md)
        
        # Create highlights from first 3 key points
        highlight_blocks = []
        for i, block in enumerate(content.blocks[:3]):
            if block.type in ["paragraph", "heading"]:
                highlight_blocks.append(EditorJSBlock(
                    id=f"highlight_{i}",
                    type="paragraph",
                    data={"text": block.data.get("text", "")[:200]}
                ))
        
        highlights = EditorJSContent(version="1.0", blocks=highlight_blocks) if highlight_blocks else None
        
        # Meta tags
        meta_keywords = extract_keywords(plan, request.topic)
        meta_description = extract_description(final_md)
        
        # Sources
        sources = [
            SourceItem(
                title=e.title if hasattr(e, 'title') else e.get('title', ''),
                url=e.url if hasattr(e, 'url') else e.get('url', ''),
                published_at=e.published_at if hasattr(e, 'published_at') else e.get('published_at'),
                snippet=e.snippet if hasattr(e, 'snippet') else e.get('snippet')
            )
            for e in evidence
        ]
        
        # Image handling
        image_url = None
        for e in evidence:
            img = e.get('image') if isinstance(e, dict) else getattr(e, 'image', None)
            if img:
                image_url = img
                break
        
        if not image_url:
            image_url = get_placeholder_image(title, request.category)

        return GeneratedStory(
            title=title,
            shortTitle=short_title,
            slug=slug,
            excerpt=meta_description,
            content=content,
            highlights=highlights,
            metaTags=MetaTags(
                metaKeywords=meta_keywords,
                metaDescription=meta_description,
                googleBot="ALLOW",
                excludeIA=False
            ),
            sources=sources,
            category=request.category,
            mandal=request.mandal,
            district=request.district,
            imageUrl=image_url
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/generate-story/stream")
async def generate_story_stream(request: GenerateStoryRequest):
    """Generate a news story with streaming progress updates."""
    
    async def event_generator():
        try:
            as_of = request.as_of or date.today().isoformat()
            
            inputs = {
                "topic": request.topic,
                "mode": "",
                "needs_research": True,
                "queries": [],
                "evidence": [],
                "plan": None,
                "as_of": as_of,
                "recency_days": 3,
                "sections": [],
                "merged_md": "",
                "md_with_placeholders": "",
                "image_specs": [],
                "final": "",
            }
            
            # Emit start event
            yield f"data: {json.dumps({'event': 'start', 'data': {'topic': request.topic}})}\n\n"
            
            # Stream through the graph
            current_state = {}
            for step in graph_app.stream(inputs, stream_mode="updates"):
                if isinstance(step, dict):
                    node_name = next(iter(step.keys())) if step else None
                    node_data = step.get(node_name, {}) if node_name else {}
                    
                    # Update current state
                    if isinstance(node_data, dict):
                        current_state.update(node_data)
                    
                    # Emit progress event
                    event_data = {
                        "node": node_name,
                        "queries_count": len(current_state.get("queries", [])),
                        "evidence_count": len(current_state.get("evidence", [])),
                        "sections_count": len(current_state.get("sections", [])),
                        "mode": current_state.get("mode", ""),
                    }
                    yield f"data: {json.dumps({'event': 'progress', 'data': event_data})}\n\n"
                    
                    await asyncio.sleep(0.1)
            
            # Final invocation to get complete result
            result = graph_app.invoke(inputs)
            
            # Build final response (same as non-streaming)
            final_md = result.get("final", "")
            plan = result.get("plan")
            evidence = result.get("evidence", [])
            
            title = plan.blog_title if plan else request.topic
            content = markdown_to_editorjs(final_md)
            
            final_data = {
                "title": title,
                "shortTitle": title[:50],
                "slug": safe_slug(title),
                "excerpt": extract_description(final_md),
                "content": content.model_dump(),
                "metaTags": {
                    "metaKeywords": extract_keywords(plan, request.topic),
                    "metaDescription": extract_description(final_md),
                    "googleBot": "ALLOW",
                    "excludeIA": False
                },
                "sources": [
                    {
                        "title": e.title if hasattr(e, 'title') else e.get('title', ''),
                        "url": e.url if hasattr(e, 'url') else e.get('url', ''),
                        "published_at": e.published_at if hasattr(e, 'published_at') else e.get('published_at'),
                    }
                    for e in evidence
                ],
                "category": request.category,
                "mandal": request.mandal,
                "district": request.district,
                "imageUrl": next((e.get('image') if isinstance(e, dict) else getattr(e, 'image', None) for e in evidence if (e.get('image') if isinstance(e, dict) else getattr(e, 'image', None))), get_placeholder_image(title, request.category))
            }
            
            yield f"data: {json.dumps({'event': 'complete', 'data': final_data})}\n\n"
            
        except Exception as e:
            yield f"data: {json.dumps({'event': 'error', 'data': {'message': str(e)}})}\n\n"
    
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )


@app.post("/trending-topics", response_model=List[TrendingTopic])
async def get_trending_topics(request: TrendingTopicsRequest):
    """Fetch trending news topics using Tavily."""
    try:
        from langchain_community.tools.tavily_search import TavilySearchResults
        
        if not os.getenv("TAVILY_API_KEY"):
            raise HTTPException(status_code=503, detail="Tavily API key not configured")
        
        # Search for trending news
        category_queries = {
            "General": "breaking news today headlines",
            "Politics": "latest political news government",
            "Sports": "sports news today scores",
            "Business": "business news markets economy",
            "Technology": "tech news latest gadgets AI",
            "Entertainment": "entertainment news celebrities movies",
            "Local": "local news community events",
        }
        
        query = category_queries.get(request.category, "breaking news today")
        tool = TavilySearchResults(max_results=request.count * 2)
        results = tool.invoke({"query": query})
        
        topics = []
        seen = set()
        for r in results or []:
            title = r.get("title", "").strip()
            if title and title not in seen:
                seen.add(title)
                topics.append(TrendingTopic(
                    topic=title,
                    description=r.get("content", r.get("snippet", ""))[:200],
                    category=request.category
                ))
                if len(topics) >= request.count:
                    break
        
        return topics
        
    except ImportError:
        raise HTTPException(status_code=503, detail="Tavily not installed")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================
# Main
# ============================================================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
