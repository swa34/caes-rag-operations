# CAES RAG System Architecture

## Overview

The CAES Intranet Help Bot uses a sophisticated multi-layer RAG (Retrieval-Augmented Generation) architecture with Redis caching, intelligent query processing, and streaming responses.

## High-Level Architecture Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Query Input                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   LAYER 1: CACHE CHECK (Early)                   │
│  server.js:238-336                                               │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Redis Cache Lookup (query hash + session context)         │ │
│  │  • Check BEFORE reframing/clarification                    │ │
│  │  • TTL: 30 days                                            │ │
│  │  • Returns cached response immediately if found            │ │
│  └────────────────────────────────────────────────────────────┘ │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
                    ▼                 ▼
            ┌──────────┐      ┌──────────────┐
            │ CACHE HIT│      │ CACHE MISS   │
            └─────┬────┘      └──────┬───────┘
                  │                  │
                  │                  ▼
                  │    ┌─────────────────────────────────────────┐
                  │    │  LAYER 2: CONVERSATION MEMORY           │
                  │    │  ┌───────────────────────────────────┐  │
                  │    │  │ PostgreSQL Session Management     │  │
                  │    │  │ • Load last N messages            │  │
                  │    │  │ • 30-min session TTL              │  │
                  │    │  │ • Automatic cleanup               │  │
                  │    │  └───────────────────────────────────┘  │
                  │    └──────────────────┬──────────────────────┘
                  │                       │
                  │                       ▼
                  │    ┌─────────────────────────────────────────┐
                  │    │  LAYER 3: QUERY PROCESSING              │
                  │    │  ┌───────────────────────────────────┐  │
                  │    │  │ Clarification Check                │  │
                  │    │  │ • Detect ambiguous queries        │  │
                  │    │  │ • Ask clarifying questions        │  │
                  │    │  │ • Skip RAG if clarification needed│  │
                  │    │  └────────────┬──────────────────────┘  │
                  │    │               │                          │
                  │    │               ▼                          │
                  │    │  ┌───────────────────────────────────┐  │
                  │    │  │ Reframing Engine (if needed)      │  │
                  │    │  │ • Analyze with conversation       │  │
                  │    │  │ • Detect follow-up questions      │  │
                  │    │  │ • Add context from history        │  │
                  │    │  └────────────┬──────────────────────┘  │
                  │    └────────────────┼──────────────────────────┘
                  │                     │
                  │                     ▼
                  │    ┌─────────────────────────────────────────┐
                  │    │  LAYER 4: RAG RETRIEVAL PIPELINE        │
                  │    │  (5-Stage Intelligent Retrieval)        │
                  │    │                                          │
                  │    │  Stage 1: Acronym Expansion             │
                  │    │  • 210 UGA acronyms, 0-2ms lookup      │
                  │    │               ▼                          │
                  │    │  Stage 2: Metadata Filtering            │
                  │    │  • Query-aware category detection      │
                  │    │               ▼                          │
                  │    │  Stage 3: Vector Search + Date Priority │
                  │    │  • Pinecone vector search              │
                  │    │  • Recent content prioritization       │
                  │    │               ▼                          │
                  │    │  Stage 4: Feedback Learning            │
                  │    │  • ±10% score adjustment               │
                  │    │               ▼                          │
                  │    │  Stage 5: LLM Re-ranking (GPT-5-nano)  │
                  │    │  • Smart triggers (20-30% usage)       │
                  │    └─────────────────────────────────────────┘
                  │                     │
                  │                     ▼
                  │    ┌─────────────────────────────────────────┐
                  │    │  LAYER 5: RESPONSE GENERATION           │
                  │    │  ┌───────────────────────────────────┐  │
                  │    │  │ GPT-5-mini Response Generation    │  │
                  │    │  │ • Streaming support enabled       │  │
                  │    │  │ • Citation generation             │  │
                  │    │  └───────────────────────────────────┘  │
                  │    └─────────────────────────────────────────┘
                  │                     │
                  │                     ▼
                  │    ┌─────────────────────────────────────────┐
                  │    │  LAYER 6: RESPONSE CACHING              │
                  │    │  ┌───────────────────────────────────┐  │
                  │    │  │ Store in cache for future queries │  │
                  │    │  │ • PostgreSQL + Redis              │  │
                  │    │  │ • TTL: 30 days                    │  │
                  │    │  └───────────────────────────────────┘  │
                  │    └─────────────────────────────────────────┘
                  │                     │
                  └─────────────────────┘
                                        │
                                        ▼
                            ┌─────────────────────┐
                            │  Stream to Client   │
                            └─────────────────────┘
```

## Key Features by Layer

### Layer 1: Early Cache Check
**Location**: `server.js:238-336`

**Why Early?** Checking cache BEFORE expensive operations (reframing, embedding, retrieval) provides maximum performance gain.

**Performance**:
- Cache hit: ~50ms (just Redis lookup + DB read)
- Cache miss without early check: ~1800ms (full RAG pipeline)
- **Savings**: 97% faster for cached queries

### Layer 2: Conversation Memory
**Location**: `server.js` (session management)

- PostgreSQL-backed persistent storage
- 30-minute session TTL
- Automatic cleanup of expired sessions
- Multi-instance support

### Layer 3: Query Processing

#### Clarification Mode
**Location**: `server.js:346-414`
**Environment Variable**: `ENABLE_CLARIFICATION_MODE=true`

Detects ambiguous queries and asks for clarification instead of guessing:

```
User: "How do I reset it?"
System: "Could you clarify what you need to reset?
  • Password
  • Two-factor authentication
  • Workday settings"
```

#### Reframing Engine
**Location**: `server.js:368-427`

Handles follow-up questions by adding context from conversation history:

```
User: "What's the deadline?"
Context: Previous question about "travel reimbursement"
Reframed: "What's the deadline for travel reimbursement submission?"
```

### Layer 4: RAG Retrieval Pipeline

#### Stage 1: Acronym Expansion
**Location**: `utils/acronymExpander.js`
- 210 UGA-specific acronyms
- In-memory HashMap (0-2ms lookup)

#### Stage 2: Metadata Filtering
**Location**: `vector-ops/retrieve.js:180-226`
- Query-aware category detection
- 15-25% precision improvement

#### Stage 3: Vector Search with Date Prioritization
**Location**: `vector-ops/retrieve.js:167-232`

**Date-Based Prioritization**:
- Extracts dates from filenames/sources
- When scores are similar (within 0.02), prioritizes recent content
- Ensures policies and procedures are up-to-date

#### Stage 4: Feedback Learning
**Location**: `vector-ops/retrieve.js:234-237`
- User thumbs up: +10% score boost
- User thumbs down: -10% score penalty
- Persistent feedback storage

#### Stage 5: LLM Re-ranking
**Location**: `vector-ops/retrieve.js:36-128`
**Model**: GPT-5-nano

**Smart Triggers** (70-80% cost savings):
- Top 3 scores too similar (< 0.05 spread)
- Temporal queries ("latest", "most recent")
- Comparison queries ("difference", "vs")

**GPT-5 Responses API**:
```javascript
const response = await openai.responses.create({
  model: 'gpt-5-nano',
  input: prompt,
  reasoning: { effort: 'minimal' },
  text: {
    verbosity: 'low',
    format: { type: 'json_object' }
  }
});
```

### Layer 5: Response Generation
**Location**: `server.js:591-629`
**Model**: GPT-5-mini

**GPT-5 Responses API** (optimized for reasoning models):
```javascript
const response = await openai.responses.create({
  model: 'gpt-5-mini',
  instructions: systemPrompt,
  input: userQuery,
  reasoning: { effort: 'minimal' },  // Fast chatbot responses
  text: { verbosity: 'low' }          // Concise answers
});
```

**Streaming Support**: Available via `/chat/stream` endpoint

### Layer 6: Response Caching
**Location**: `server.js:808-840`

Caches successful responses for future use with quality control:
- Feedback quality check before caching
- PostgreSQL + Redis dual storage
- 30-day TTL

## Performance Metrics

### Response Time Breakdown (After Optimizations)

**Cache Hit** (~95% of queries after warm-up):
```
Total: ~50ms
└── Cache lookup: 50ms (Redis + PostgreSQL)
```

**Cache Miss** (new/unique queries):
```
Total: ~1800ms
├── Conversation load: 50ms
├── Clarification check: 100ms
├── Reframing (if needed): 300ms
├── Acronym expansion: 2ms
├── Embedding: 500ms
├── Vector search: 300ms
├── Feedback adjustment: 10ms
├── Re-ranking (if triggered): 400ms
├── Generation: 500ms (streaming)
└── Cache storage: 35ms
```

### Cache Hit Rates

```
After warm-up (1 hour of usage):
├── Cache hit rate: 95%+
├── Average response time (hit): 50ms
├── Average response time (miss): 1800ms
└── Overall average: ~200ms
```

## Infrastructure

### Redis Configuration
**Provider**: Sevalla Redis Add-on ($5/month)

**Features**:
- Automatic retry with exponential backoff
- 5-second connection timeout
- Graceful fallback (system works without Redis)
- Survives container restarts

### PostgreSQL Configuration

**Tables**:
- `conversations` - Session storage and conversation history
- `cached_responses` - Response cache with quality control
- `feedback` - User feedback and learning

### Pinecone Configuration
**Index**: `uga-intranet-index`
- Dimensions: 3072 (OpenAI text-embedding-3-large)
- Metric: cosine similarity
- Pre-initialized at server startup

## Known Issues

### ⚠️ Duplicate Cache Check

**Problem**: Cache is checked in two places:
- `server.js:238-336` (early check) ✅ Keep this
- `retrieve.js:235-251` (inside retrieveRelevantChunks) ❌ Remove this

**Recommendation**: Remove the check in `retrieve.js` since early cache check is more efficient.

See [BACKEND_RECOMMENDATIONS.md](./BACKEND_RECOMMENDATIONS.md) for details.

## API Support

### GPT-5 Models
- **Generation**: GPT-5-mini (Responses API)
- **Re-ranking**: GPT-5-nano (Responses API)
- **Reasoning effort**: Minimal (optimized for speed)
- **Verbosity**: Low (concise responses)

### Streaming
- Endpoint: `/chat/stream`
- Protocol: Server-Sent Events (SSE)
- Hybrid: Serves cached responses as JSON, streams new responses

## Monitoring & Observability

### Key Metrics Tracked
- Response time breakdown (cache, retrieval, generation)
- Cache hit rate
- Re-ranking trigger rate
- Clarification request rate
- Feedback sentiment

### Performance Logs
```javascript
console.log('📊 Performance Breakdown:', {
  retrieval: `${retrievalTime}ms`,
  generation: `${generationTime}ms`,
  total: `${responseTime}ms`,
  rerankingApplied: true/false,
  cacheHit: true/false
});
```

## Future Enhancements

1. **Semantic Caching**: Cache similar queries, not just exact matches
2. **Progressive Retrieval**: Start with top-3, fetch more if needed
3. **Hybrid Search**: Combine vector + keyword search
4. **Query Classification**: Route to specialized pipelines

---

*Last Updated: October 12, 2025*
*Reflects production architecture as of October 2025*
*Based on code analysis of intranetChatbot repository*
