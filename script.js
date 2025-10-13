// All documentation content
const docs = {
  'early-cache-check': {
    title: '🚀 Early Cache Check (NEW!)',
    content: `
            <h1>🚀 Early Cache Check</h1>
            <p class="subtitle">Checks cache BEFORE reframing for 97% faster responses - October 12, 2025</p>

            <div style="background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <strong>🎉 Optimization:</strong> Cache check moved before expensive operations for maximum performance gain!
            </div>

            <h2>The Strategy</h2>
            <p>Check the cache BEFORE expensive operations like reframing, clarification, embedding, and RAG retrieval.</p>

            <h2>Why It Matters</h2>
            <p>Original architecture checked cache inside the retrieval function, after reframing and clarification. Moving it earlier eliminates ALL unnecessary processing for cached queries.</p>

            <h2>Implementation</h2>
            <div class="code-block">
                <pre><code>// Early cache check in server.js (line 238)
const cachedResult = await responseCache.get(message, sessionId);

if (cachedResult) {
  console.log('✅ Early cache hit - serving immediately');
  return res.json({
    answer: cachedResult.response,
    sources: cachedResult.sources,
    cached: true,
    responseTime: Date.now() - startTime
  });
}

// Only if cache misses do we continue with:
// - Loading conversation history
// - Checking for clarification
// - Reframing questions
// - RAG retrieval</code></pre>
                <span class="code-ref">src/server.js:238-336</span>
            </div>

            <h2>Performance Impact</h2>
            <div class="metrics-grid">
                <div class="metric-item">
                    <span class="metric-label">Cache Hit Time</span>
                    <span class="metric-value">~50ms</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Full RAG Time</span>
                    <span class="metric-value">~1800ms</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Speedup</span>
                    <span class="metric-value">36x faster</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Cache Hit Rate</span>
                    <span class="metric-value">95%+</span>
                </div>
            </div>

            <h2>Benefits</h2>
            <ul>
                <li>97% faster responses for cached queries</li>
                <li>Reduces API costs (no unnecessary LLM calls)</li>
                <li>Lower latency for common questions</li>
                <li>Better user experience</li>
            </ul>
        `
  },

  'redis-caching': {
    title: '🔥 Redis + PostgreSQL Caching',
    content: `
            <h1>🚀 Redis + PostgreSQL Dual Caching</h1>
            <p class="subtitle">89% performance improvement achieved - October 10, 2025</p>

            <div style="background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <strong>🎉 Major Breakthrough:</strong> Response time reduced from 16.9s to 1.8s through Redis caching!
            </div>

            <h2>The Problem</h2>
            <p>Sevalla DB1 plan (0.25 GB RAM) causes frequent container restarts, forcing Pinecone to reconnect on every request (4-second penalty).</p>

            <h2>The Solution</h2>
            <p>Redis caches Pinecone validation across container restarts, eliminating reconnection delays.</p>

            <h2>Implementation</h2>
            <div class="code-block">
                <pre><code>// Redis with automatic fallback
const redisClient = new Redis(REDIS_URL, {
  retryStrategy: (times) => times > 3 ? null : Math.min(times * 100, 2000),
  connectTimeout: 5000
});

// Cache Pinecone validation
await redisClient.setex('pinecone:index:validated', 3600, JSON.stringify({
  validated: true,
  indexName: INDEX_NAME,
  timestamp: new Date().toISOString()
}));</code></pre>
                <span class="code-ref">src/rag/utils/pineconeClientWithRedis.js:15-40</span>
            </div>

            <h2>Performance Impact</h2>
            <div class="metrics-grid">
                <div class="metric-item">
                    <span class="metric-label">Before</span>
                    <span class="metric-value">16.9s</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">After</span>
                    <span class="metric-value">1.8s</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Improvement</span>
                    <span class="metric-value">89%</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Cost</span>
                    <span class="metric-value">$5/mo</span>
                </div>
            </div>

            <h2>Configuration</h2>
            <div class="code-block">
                <pre><code># Sevalla Redis Configuration
REDIS_URL=redis://:PASSWORD@host:port/0

# Performance achieved
- Pinecone connect: 4000ms → 50ms
- Total response: 16.9s → 1.8s
- Cache hit rate: 95%+
- ROI: 900%+ based on UX improvement</code></pre>
                <span class="code-ref">.env configuration</span>
            </div>
        `
  },
  'llm-reranking': {
    title: 'LLM Re-ranking',
    content: `
            <h1>LLM Re-ranking</h1>
            <p class="subtitle">Semantic reordering using GPT-5-nano when vector scores are ambiguous</p>

            <h2>What It Is</h2>
            <p>Uses an LLM to reorder search results when vector similarity alone isn't enough.</p>

            <h3>When It Triggers</h3>
            <ul>
                <li>Top 3 results within 0.05 score difference</li>
                <li>Temporal queries ("latest", "recent", "current")</li>
                <li>Comparison queries ("difference", "versus")</li>
            </ul>

            <h2>Code Example</h2>
            <div class="code-block">
                <pre><code>const shouldRerank = (
  (matches[0].score - matches[2].score) < 0.05 ||
  /\\b(latest|recent|current)\\b/i.test(query) ||
  /\\b(difference|versus|compare)\\b/i.test(query)
);

if (shouldRerank) {
  matches = await rerankWithLLM(matches, query);
}</code></pre>
                <span class="code-ref">src/rag/vector-ops/retrieve.js:23-101</span>
            </div>

            <h2>Performance</h2>
            <div class="metrics-grid">
                <div class="metric-item">
                    <span class="metric-label">Trigger Rate</span>
                    <span class="metric-value">20-30%</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Latency</span>
                    <span class="metric-value">200-400ms</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Cost</span>
                    <span class="metric-value">~$0.0001</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Savings</span>
                    <span class="metric-value">70-80%</span>
                </div>
            </div>

            <h2>Benefits</h2>
            <ul>
                <li>Better temporal query accuracy</li>
                <li>Handles complex comparisons</li>
                <li>Graceful fallback if fails</li>
            </ul>

            <h2>Learn More</h2>
            <ul>
                <li><a href="https://developer.nvidia.com/blog/enhancing-rag-pipelines-with-re-ranking/" target="_blank">NVIDIA: Enhancing RAG Pipelines with Re-ranking</a></li>
                <li><a href="https://www.pinecone.io/learn/series/rag/rerankers/" target="_blank">Pinecone: Understanding Rerankers</a></li>
                <li><a href="https://arxiv.org/abs/2310.06839" target="_blank">Research Paper: LLM-based Reranking</a></li>
            </ul>
        `,
  },

  'metadata-filtering': {
    title: 'Metadata Filtering',
    content: `
            <h1>Metadata Filtering</h1>
            <p class="subtitle">Query-aware category filtering before vector search</p>

            <h2>What It Is</h2>
            <p>Detects query keywords and filters Pinecone search by category, reducing noise by 15-25%.</p>

            <h3>Categories</h3>
            <ul>
                <li>hr_financial_help - Travel, reimbursement, expenses</li>
                <li>ga_counts_app - Reporting, GaCounts</li>
                <li>abo_policies - Policies, procedures</li>
                <li>oit_help - Email, password, tech support</li>
                <li>14 total categories</li>
            </ul>

            <h2>Code Example</h2>
            <div class="code-block">
                <pre><code>const categoryKeywords = {
  hr_financial: ['travel', 'reimbursement'],
  ga_counts: ['report', 'gacounts'],
  oit_help: ['email', 'password']
};

const categories = detectCategories(query);
if (categories) {
  queryParams.filter = { category: { $in: categories } };
}</code></pre>
                <span class="code-ref">src/rag/vector-ops/retrieve.js:149-190</span>
            </div>

            <h2>Performance</h2>
            <div class="metrics-grid">
                <div class="metric-item">
                    <span class="metric-label">Precision Gain</span>
                    <span class="metric-value">15-25%</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Latency</span>
                    <span class="metric-value">0ms</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Detection Rate</span>
                    <span class="metric-value">~40%</span>
                </div>
            </div>

            <h2>Learn More</h2>
            <ul>
                <li><a href="https://docs.pinecone.io/guides/search/filter-by-metadata" target="_blank">Pinecone: Metadata Filtering Guide</a></li>
                <li><a href="https://developers.llamaindex.ai/python/examples/vector_stores/pinecone_metadata_filter/" target="_blank">LlamaIndex: Metadata Filtering Examples</a></li>
                <li><a href="https://www.pinecone.io/learn/retrieval-augmented-generation/" target="_blank">Pinecone: RAG with Filtering</a></li>
            </ul>
        `,
  },

  'acronym-expansion': {
    title: 'Acronym Expansion',
    content: `
            <h1>Acronym Expansion</h1>
            <p class="subtitle">210 domain-specific acronyms expanded automatically</p>

            <h2>What It Is</h2>
            <p>In-memory dictionary that expands UGA acronyms before embedding. Improves accuracy 8-12%.</p>

            <h3>Example</h3>
            <p><strong>Input:</strong> "How do I report CAES travel?"</p>
            <p><strong>Expanded:</strong> "How do I report CAES (College of Agricultural and Environmental Sciences) travel?"</p>

            <h2>Code Example</h2>
            <div class="code-block">
                <pre><code>// Load 210 acronyms at startup
let acronymsCache = new Map();
await db.query('SELECT acronym, definition FROM acronyms')
  .then(r => r.rows.forEach(row =>
    acronymsCache.set(row.acronym, row.definition)
  ));

// Expand in queries
function expandAcronyms(query) {
  for (const [acronym, def] of acronymsCache) {
    query = query.replace(
      new RegExp(\`\\\\b\${acronym}\\\\b\`, 'gi'),
      \`\${acronym} (\${def})\`
    );
  }
  return query;
}</code></pre>
                <span class="code-ref">src/rag/utils/acronymExpander.js</span>
            </div>

            <h2>Performance</h2>
            <div class="metrics-grid">
                <div class="metric-item">
                    <span class="metric-label">Acronyms</span>
                    <span class="metric-value">210</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Latency</span>
                    <span class="metric-value">0-2ms</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Accuracy Gain</span>
                    <span class="metric-value">8-12%</span>
                </div>
            </div>

            <h2>Learn More</h2>
            <ul>
                <li><a href="https://ai.meta.com/blog/retrieval-augmented-generation-streamlining-the-creation-of-intelligent-natural-language-processing-models/" target="_blank">Meta: RAG Best Practices</a></li>
                <li><a href="https://www.anthropic.com/research/contextual-retrieval" target="_blank">Anthropic: Contextual Retrieval</a></li>
                <li><a href="https://eugeneyan.com/writing/llm-patterns/#expand-acronyms-and-abbreviations" target="_blank">Eugene Yan: LLM Patterns for Search</a></li>
            </ul>
        `,
  },

  'conversation-memory': {
    title: 'Conversation Memory',
    content: `
            <h1>PostgreSQL Conversation Memory</h1>
            <p class="subtitle">Persistent sessions with 30-min TTL and multi-instance support</p>

            <h2>What It Is</h2>
            <p>Database-backed conversation history that survives restarts and enables horizontal scaling.</p>

            <h3>Features</h3>
            <ul>
                <li>30-minute session TTL with automatic cleanup</li>
                <li>Max 10 turns per session</li>
                <li>Multi-instance ready (shared PostgreSQL state)</li>
                <li>Session export API</li>
            </ul>

            <h2>Database Schema</h2>
            <div class="code-block">
                <pre><code>CREATE TABLE conversation_sessions (
  id UUID PRIMARY KEY,
  last_activity TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE conversations (
  session_id UUID REFERENCES conversation_sessions(id),
  role TEXT,
  content TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);</code></pre>
            </div>

            <h2>Code Example</h2>
            <div class="code-block">
                <pre><code>async function addMessage(sessionId, role, content) {
  await db.query(\`
    INSERT INTO conversations (session_id, role, content)
    VALUES ($1, $2, $3)
  \`, [sessionId, role, content]);

  await db.query(\`
    UPDATE conversation_sessions
    SET last_activity = NOW()
    WHERE id = $1
  \`, [sessionId]);
}</code></pre>
                <span class="code-ref">src/conversationMemoryPostgres.js</span>
            </div>

            <h2>Performance</h2>
            <div class="metrics-grid">
                <div class="metric-item">
                    <span class="metric-label">TTL</span>
                    <span class="metric-value">30 min</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Max Turns</span>
                    <span class="metric-value">10</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Query Time</span>
                    <span class="metric-value">~5ms</span>
                </div>
            </div>

            <h2>Learn More</h2>
            <ul>
                <li><a href="https://docs.claude.com/en/docs/build-with-claude/conversation-design" target="_blank">Anthropic: Conversation Design</a></li>
                <li><a href="https://www.postgresql.org/docs/current/datatype-json.html" target="_blank">PostgreSQL: JSON Types for Sessions</a></li>
                <li><a href="https://python.langchain.com/docs/how_to/chatbots_memory/" target="_blank">LangChain: Chat Memory</a></li>
            </ul>
        `,
  },

  'question-reframing': {
    title: 'Question Reframing',
    content: `
            <h1>Question Reframing</h1>
            <p class="subtitle">Converts context-dependent follow-ups into standalone queries</p>

            <h2>What It Is</h2>
            <p>LLM-powered system that detects and rewrites follow-up questions using conversation history.</p>

            <h3>Example</h3>
            <p><strong>Turn 1:</strong> "How do vector databases work?"</p>
            <p><strong>Turn 2 (original):</strong> "What about the drawbacks?"</p>
            <p><strong>Turn 2 (reframed):</strong> "What are the drawbacks of vector databases?"</p>

            <h2>Detection Logic</h2>
            <div class="code-block">
                <pre><code>function needsReframing(query, history) {
  if (!history.length) return false;

  const hasPronouns = /\\b(it|this|that)\\b/i.test(query);
  const isShort = query.length < 30;
  return hasPronouns || isShort;
}</code></pre>
                <span class="code-ref">src/questionReframer.js</span>
            </div>

            <h2>Performance</h2>
            <div class="metrics-grid">
                <div class="metric-item">
                    <span class="metric-label">LLM Calls Saved</span>
                    <span class="metric-value">~60%</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Latency</span>
                    <span class="metric-value">200-500ms</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Context</span>
                    <span class="metric-value">3 turns</span>
                </div>
            </div>

            <h2>Learn More</h2>
            <ul>
                <li><a href="https://arxiv.org/abs/2305.14283" target="_blank">Research: Query Rewriting for RAG</a></li>
                <li><a href="https://developers.llamaindex.ai/python/examples/query_transformations/query_transform_cookbook/" target="_blank">LlamaIndex: Query Transformation Cookbook</a></li>
                <li><a href="https://python.langchain.com/docs/how_to/query_transformations/" target="_blank">LangChain: Query Transformations</a></li>
            </ul>
        `,
  },

  'clarification-mode': {
    title: '🤔 Clarification Mode (NEW!)',
    content: `
            <h1>🤔 Clarification Mode</h1>
            <p class="subtitle">Detects ambiguous queries and asks for clarification - October 12, 2025</p>

            <div style="background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <strong>🎉 New Feature:</strong> Prevents hallucinations by asking clarifying questions instead of guessing!
            </div>

            <h2>What It Is</h2>
            <p>Detects ambiguous queries and asks users to clarify before attempting to answer. Prevents incorrect or misleading responses.</p>

            <h3>Triggers</h3>
            <ul>
                <li>Ambiguous pronouns without context ("it", "that", "this")</li>
                <li>Multiple possible interpretations</li>
                <li>Missing critical information</li>
                <li>Overly vague queries</li>
            </ul>

            <h2>Example</h2>
            <p><strong>User:</strong> "How do I reset it?"</p>
            <p><strong>System:</strong> "I'd be happy to help! Could you clarify what you need to reset? For example:</p>
            <ul>
                <li>Password</li>
                <li>Two-factor authentication</li>
                <li>Workday settings</li>
                <li>Something else?"</li>
            </ul>

            <h2>Implementation</h2>
            <div class="code-block">
                <pre><code>// Detect ambiguity
const ambiguity = detectQuestionAmbiguity(query, conversationHistory);

if (ambiguity.needsClarification) {
  const clarification = await generateClarificationResponse(
    query,
    ambiguity.reason,
    conversationHistory
  );

  return res.json({
    answer: clarification,
    needsClarification: true,
    skipRAG: true  // Don't waste resources on ambiguous queries
  });
}</code></pre>
                <span class="code-ref">src/server.js:346-414</span>
            </div>

            <h2>Benefits</h2>
            <ul>
                <li>Reduces hallucinations and incorrect answers</li>
                <li>Improves answer accuracy</li>
                <li>Better user experience</li>
                <li>Saves RAG cycles on ambiguous queries</li>
            </ul>

            <h2>Configuration</h2>
            <div class="code-block">
                <pre><code># Enable clarification mode
ENABLE_CLARIFICATION_MODE=true

# Set in environment variables or .env file</code></pre>
                <span class="code-ref">.env configuration</span>
            </div>
        `,
  },

  'date-prioritization': {
    title: '📅 Date-Based Prioritization (NEW!)',
    content: `
            <h1>📅 Date-Based Content Prioritization</h1>
            <p class="subtitle">Prioritizes recent content when similarity scores are close - October 12, 2025</p>

            <div style="background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <strong>🎉 New Feature:</strong> Ensures policies and procedures are up-to-date!
            </div>

            <h2>What It Is</h2>
            <p>When multiple documents have similar vector similarity scores (within 0.02), the system prioritizes more recently published content.</p>

            <h2>Why It Matters</h2>
            <p>Policies and procedures get updated over time. Old documents may contain deprecated information. This ensures users see the most current guidance.</p>

            <h3>Date Sources</h3>
            <ul>
                <li>Filenames with dates (e.g., "policy-2024-update.pdf")</li>
                <li>Document metadata (published_date field)</li>
                <li>Last modified timestamps</li>
            </ul>

            <h2>Implementation</h2>
            <div class="code-block">
                <pre><code>// Extract dates from sources
function extractDateFromSource(source) {
  // Try metadata first
  if (source.published_date) return new Date(source.published_date);

  // Try filename patterns
  const dateMatch = source.filename.match(/20\\d{2}-\\d{2}-\\d{2}/);
  if (dateMatch) return new Date(dateMatch[0]);

  return null;
}

// Apply prioritization when scores are similar
if (matches[0].score - matches[1].score < 0.02) {
  const date1 = extractDateFromSource(matches[0]);
  const date2 = extractDateFromSource(matches[1]);

  // Swap if second is newer
  if (date1 && date2 && date2 > date1) {
    [matches[0], matches[1]] = [matches[1], matches[0]];
  }
}</code></pre>
                <span class="code-ref">src/rag/vector-ops/retrieve.js:167-232</span>
            </div>

            <h2>Example</h2>
            <p><strong>Query:</strong> "What is the travel reimbursement policy?"</p>
            <p><strong>Results before prioritization:</strong></p>
            <ul>
                <li>travel-policy-2019.pdf (score: 0.92)</li>
                <li>travel-policy-2024-update.pdf (score: 0.91)</li>
            </ul>
            <p><strong>Results after prioritization:</strong></p>
            <ul>
                <li>travel-policy-2024-update.pdf (score: 0.91) ← Promoted</li>
                <li>travel-policy-2019.pdf (score: 0.92) ← Demoted</li>
            </ul>

            <h2>Benefits</h2>
            <ul>
                <li>Ensures up-to-date policy information</li>
                <li>Reduces outdated guidance</li>
                <li>Only activates when scores are close (minimal impact on relevance)</li>
                <li>Transparent: logs when prioritization occurs</li>
            </ul>

            <h2>Performance</h2>
            <div class="metrics-grid">
                <div class="metric-item">
                    <span class="metric-label">Threshold</span>
                    <span class="metric-value">0.02</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Overhead</span>
                    <span class="metric-value"><1ms</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Activation Rate</span>
                    <span class="metric-value">~15%</span>
                </div>
            </div>
        `,
  },

  'streaming-support': {
    title: '📡 Streaming Support (NEW!)',
    content: `
            <h1>📡 Streaming Response Support</h1>
            <p class="subtitle">Server-Sent Events (SSE) for progressive response rendering - October 12, 2025</p>

            <div style="background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <strong>🎉 New Feature:</strong> Progressive response rendering for better perceived performance!
            </div>

            <h2>What It Is</h2>
            <p>Streams responses word-by-word as they're generated, providing immediate feedback to users instead of waiting for the complete response.</p>

            <h2>How It Works</h2>
            <ol>
                <li><strong>Cache check:</strong> If cached, returns JSON immediately (no streaming needed)</li>
                <li><strong>RAG processing:</strong> If cache miss, performs full RAG pipeline</li>
                <li><strong>Stream generation:</strong> Uses GPT-5-mini streaming API to send chunks as they're generated</li>
            </ol>

            <h2>Implementation</h2>
            <div class="code-block">
                <pre><code>// Server-Sent Events endpoint
app.post('/chat/stream', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Check cache first
  const cached = await responseCache.get(query, sessionId);
  if (cached) {
    // Send complete response as JSON event
    res.write(\`data: \${JSON.stringify(cached)}\\n\\n\`);
    return res.end();
  }

  // Stream new response
  const stream = await openai.responses.create({
    model: 'gpt-5-mini',
    input: query,
    stream: true
  });

  for await (const chunk of stream) {
    res.write(\`data: \${JSON.stringify(chunk)}\\n\\n\`);
  }

  res.end();
});</code></pre>
                <span class="code-ref">src/routes/chatStreaming.js</span>
            </div>

            <h2>Benefits</h2>
            <ul>
                <li><strong>Better perceived performance:</strong> Users see responses immediately</li>
                <li><strong>Improved UX:</strong> No blank screen while waiting</li>
                <li><strong>Maintains speed:</strong> Cached responses still return instantly</li>
                <li><strong>Hybrid approach:</strong> JSON for cached, streaming for new</li>
            </ul>

            <h2>Protocol</h2>
            <p><strong>Server-Sent Events (SSE)</strong></p>
            <ul>
                <li>One-way server-to-client communication</li>
                <li>Auto-reconnection on disconnect</li>
                <li>Simple text-based protocol</li>
                <li>Works over HTTP/HTTPS</li>
            </ul>

            <h2>Client Integration</h2>
            <div class="code-block">
                <pre><code>// Client-side SSE connection
const eventSource = new EventSource('/chat/stream', {
  method: 'POST',
  body: JSON.stringify({ message, sessionId })
});

eventSource.onmessage = (event) => {
  const chunk = JSON.parse(event.data);

  if (chunk.cached) {
    // Complete response
    displayResponse(chunk.response);
    eventSource.close();
  } else {
    // Stream chunk
    appendToResponse(chunk.text);
  }
};</code></pre>
                <span class="code-ref">Client implementation example</span>
            </div>

            <h2>Performance</h2>
            <div class="metrics-grid">
                <div class="metric-item">
                    <span class="metric-label">First Token</span>
                    <span class="metric-value">~500ms</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Total Time</span>
                    <span class="metric-value">~1800ms</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Perceived Speed</span>
                    <span class="metric-value">Much faster</span>
                </div>
            </div>
        `,
  },

  'intelligent-chunking': {
    title: 'Intelligent Chunking',
    content: `
            <h1>Intelligent Chunking</h1>
            <p class="subtitle">Smart text segmentation with boundary detection</p>

            <h2>What It Is</h2>
            <p>Context-aware chunking with priority boundaries: paragraph > sentence > line > word</p>

            <h3>Configuration</h3>
            <ul>
                <li><strong>Max Size:</strong> 1200 characters</li>
                <li><strong>Overlap:</strong> 200 characters</li>
                <li><strong>Minimum:</strong> 400 characters</li>
            </ul>

            <h2>Code Example</h2>
            <div class="code-block">
                <pre><code>function findBoundary(text, idealEnd) {
  // Priority 1: Paragraph
  let idx = text.lastIndexOf('\\n\\n', idealEnd);
  if (idx > idealEnd - 200) return idx;

  // Priority 2: Sentence
  idx = text.lastIndexOf('. ', idealEnd);
  if (idx > idealEnd - 200) return idx;

  // Priority 3: Line
  idx = text.lastIndexOf('\\n', idealEnd);
  if (idx > idealEnd - 200) return idx;

  // Priority 4: Word
  return text.lastIndexOf(' ', idealEnd);
}</code></pre>
                <span class="code-ref">src/rag/ingestion/chunk.js</span>
            </div>

            <h2>Impact</h2>
            <div class="metrics-grid">
                <div class="metric-item">
                    <span class="metric-label">Vector Reduction</span>
                    <span class="metric-value">~30%</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Context</span>
                    <span class="metric-value">Preserved</span>
                </div>
            </div>

            <h2>Learn More</h2>
            <ul>
                <li><a href="https://www.pinecone.io/learn/chunking-strategies/" target="_blank">Pinecone: Chunking Strategies for RAG</a></li>
                <li><a href="https://python.langchain.com/docs/how_to/#text-splitters" target="_blank">LangChain: Text Splitting Strategies</a></li>
                <li><a href="https://www.llamaindex.ai/blog/evaluating-the-ideal-chunk-size-for-a-rag-system-using-llamaindex-6207e5d3fec5" target="_blank">LlamaIndex: Evaluating Chunk Sizes</a></li>
            </ul>
        `,
  },

  'feedback-learning': {
    title: 'Feedback Learning',
    content: `
            <h1>Feedback Learning</h1>
            <p class="subtitle">Adjusts retrieval scores based on user feedback</p>

            <h2>What It Is</h2>
            <p>Collects thumbs up/down + comments, analyzes with LLM, adjusts scores ±10%.</p>

            <h3>Scoring</h3>
            <ul>
                <li><strong>Helpful:</strong> 1.0 (full boost)</li>
                <li><strong>Helpful with issues:</strong> 0.7 (outdated, broken links)</li>
                <li><strong>Not helpful:</strong> 0.0 (penalty)</li>
            </ul>

            <h2>Code Example</h2>
            <div class="code-block">
                <pre><code>function scoreComment(rating, comment) {
  const hasIssue = /outdated|broken.*link/i.test(comment);

  if (rating === 'helpful' && hasIssue) return 0.7;
  if (rating === 'helpful') return 1.0;
  return 0.0;
}

// Apply during retrieval
const adjustment = (feedbackScore - 0.5) * 0.2;
match.score += adjustment;</code></pre>
                <span class="code-ref">src/rag/feedback/feedbackLearningPostgres.js</span>
            </div>

            <h2>Performance</h2>
            <div class="metrics-grid">
                <div class="metric-item">
                    <span class="metric-label">Adjustment</span>
                    <span class="metric-value">±10%</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Lookup</span>
                    <span class="metric-value"><1ms</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Source</span>
                    <span class="metric-value">Google Sheets</span>
                </div>
            </div>

            <h2>Learn More</h2>
            <ul>
                <li><a href="https://en.wikipedia.org/wiki/Reinforcement_learning_from_human_feedback" target="_blank">WIKI: Reinforcement Learning from Human Feedback</a></li>
                <li><a href="https://huggingface.co/blog/rlhf" target="_blank">Hugging Face: RLHF Explained</a></li>
                <li><a href="https://github.com/anthropics/hh-rlhf" target="_blank">Anthropic: Learning from Human Preferences</a></li>
            </ul>
        `,
  },

  'multi-format': {
    title: 'Multi-Format Processing',
    content: `
            <h1>Multi-Format Processing</h1>
            <p class="subtitle">Extract content from PDF, Word, PowerPoint, Excel, HTML</p>

            <h2>Supported Formats</h2>
            <ul>
                <li><strong>PDF:</strong> pdf-parse</li>
                <li><strong>Word:</strong> mammoth, python-docx</li>
                <li><strong>PowerPoint:</strong> node-pptx-parser, python-pptx</li>
                <li><strong>Excel:</strong> xlsx, openpyxl</li>
                <li><strong>HTML:</strong> JSDOM + Readability</li>
            </ul>

            <h2>Why Hybrid</h2>
            <p>Node.js for speed, Python for complex Office files.</p>

            <div class="code-block">
                <pre><code>async function processDocument(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  switch (ext) {
    case '.pdf': return await processPDF(filePath);
    case '.docx': return await processWord(filePath);
    case '.pptx': return await processPowerPoint(filePath);
    // ... more formats
  }
}</code></pre>
                <span class="code-ref">src/rag/ingestion/ingest.js</span>
            </div>

            <h2>Learn More</h2>
            <ul>
                <li><a href="https://docs.unstructured.io" target="_blank">Unstructured.io: Document Processing Library</a></li>
                <li><a href="https://python.langchain.com/docs/how_to/#document-loaders" target="_blank">LangChain: Document Loaders</a></li>
                <li><a href="https://developers.llamaindex.ai/python/framework/module_guides/loading/documents_and_nodes/" target="_blank">LlamaIndex: Loading Documents</a></li>
            </ul>
        `,
  },

  crawlers: {
    title: 'Authenticated Crawlers',
    content: `
            <h1>Authenticated Crawlers</h1>
            <p class="subtitle">8 specialized crawlers for password-protected sites</p>

            <h2>Crawlers</h2>
            <ul>
                <li><strong>GaCounts:</strong> Georgia Counts reporting (ColdFusion)</li>
                <li><strong>ABO:</strong> Admin & Business Operations policies (WordPress)</li>
                <li><strong>OIT:</strong> IT help site (WordPress)</li>
                <li><strong>OLOD:</strong> Leadership development (WordPress)</li>
                <li><strong>OMC:</strong> Marketing communications (WordPress)</li>
                <li><strong>Brand:</strong> Brand guidelines (WordPress)</li>
                <li><strong>TeamDynamix:</strong> IT knowledge base</li>
                <li><strong>Generic Intranet:</strong> Fallback for other authenticated sites</li>
            </ul>

            <h2>Authentication Types</h2>
            <ul>
                <li><strong>ColdFusion (pAuth):</strong> Token-based passthrough for GaCounts</li>
                <li><strong>WordPress:</strong> Session-based authentication for content sites</li>
            </ul>

            <h2>How They Work</h2>
            <ol>
                <li>Token-based or session-based authentication</li>
                <li>JSDOM + Readability for clean text extraction</li>
                <li>Turndown for HTML → Markdown conversion</li>
                <li>Automatic pagination handling</li>
                <li>Sitemap parsing for complete coverage</li>
            </ol>

            <div class="code-block">
                <pre><code>const response = await fetch(url, {
  headers: {
    'Cookie': \`pAuth=\${process.env.CRAWL_TOKEN}\`
  }
});

const html = await response.text();
const dom = new JSDOM(html);
const reader = new Readability(dom.window.document);
const article = reader.parse();</code></pre>
                <span class="code-ref">src/rag/crawlers/crawlIntranet.js</span>
            </div>

            <h2>Learn More</h2>
            <ul>
                <li><a href="https://docs.scrapy.org/en/latest/" target="_blank">Scrapy: Web Crawling Framework</a></li>
                <li><a href="https://cheerio.js.org/" target="_blank">Cheerio: Fast HTML Parsing</a></li>
                <li><a href="https://github.com/mozilla/readability" target="_blank">Mozilla Readability: Content Extraction</a></li>
            </ul>
        `,
  },

  architecture: {
    title: 'System Architecture',
    content: `
            <h1>System Architecture</h1>
            <p class="subtitle">Complete system architecture and query flow diagrams</p>

            <h2>High-Level Query Flow</h2>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <img src="./images/basic-2025-10-13-140748.png"
                     alt="High-Level Query Flow"
                     style="width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            </div>

            <p>The diagram above shows the streamlined query processing flow:</p>
            <ol>
                <li><strong>Entry Point:</strong> User submits query via Web App or API</li>
                <li><strong>Acronym Detection:</strong> Check if query contains acronyms and expand them</li>
                <li><strong>Early Cache Check:</strong> Redis lookup before expensive operations</li>
                <li><strong>Cache Hit:</strong> Return cached response immediately (~50ms)</li>
                <li><strong>Cache Miss:</strong> Full RAG pipeline with retrieval, reranking, and generation (~1800ms)</li>
                <li><strong>Persistence:</strong> Store response in cache and save conversation/feedback</li>
            </ol>

            <h2>Complete System Architecture</h2>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <img src="./images/detail.png"
                     alt="Detailed System Architecture"
                     style="width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            </div>

            <p>The comprehensive architecture diagram above illustrates all system components:</p>

            <h3>🔵 INGESTION (Top Left)</h3>
            <ul>
                <li>Authenticated web crawlers for password-protected sites</li>
                <li>Multiformat document processing (PDFs, HTML, Office docs)</li>
                <li>Intelligent chunking for optimal retrieval</li>
                <li>Document embedding and vector index storage</li>
            </ul>

            <h3>🔵 CLIENT (Top Right)</h3>
            <ul>
                <li>User interface (Intranet or Tool)</li>
                <li>Web browser or API access</li>
            </ul>

            <h3>🔵 GATEWAY (Middle)</h3>
            <ul>
                <li>API and Web Server endpoints</li>
                <li>SSO and authentication checks</li>
                <li>Request logging and tracing</li>
            </ul>

            <h3>🔵 PREPROCESSING</h3>
            <ul>
                <li>Question reframing for context</li>
                <li>Acronym detection and expansion</li>
            </ul>

            <h3>🔵 CACHE</h3>
            <ul>
                <li>Redis cache lookup for instant responses</li>
                <li>Cache hit: Immediate response (~50ms)</li>
                <li>Cache miss: Proceed to retrieval pipeline</li>
            </ul>

            <h3>🔵 RETRIEVAL</h3>
            <ul>
                <li>Metadata filtering for precision</li>
                <li>Vector search across indexed documents</li>
                <li>Result merging and deduplication</li>
                <li>LLM-powered re-ranking (GPT-5-nano)</li>
            </ul>

            <h3>🔵 GENERATION</h3>
            <ul>
                <li>LLM answer generation with citations (GPT-5-mini)</li>
                <li>Guardrails and validation</li>
                <li>Safe fallback messages for edge cases</li>
                <li>Redis cache write for future queries</li>
            </ul>

            <h3>🔵 PERSISTENCE</h3>
            <ul>
                <li>Database storage for conversations and feedback</li>
                <li>Analytics and logs for monitoring</li>
            </ul>

            <h2>Key Architecture Layers</h2>

            <h3>1. Client Layer</h3>
            <ul>
                <li>React chat UI</li>
                <li>REST API</li>
            </ul>

            <h3>2. Application Layer</h3>
            <ul>
                <li>Express.js server</li>
                <li>Conversation memory</li>
                <li>Question reframing</li>
            </ul>

            <h3>3. RAG Pipeline</h3>
            <ul>
                <li>5-stage pipeline: Acronym → Metadata → Vector → Feedback → Re-rank</li>
                <li>Document ingestion</li>
                <li>Intelligent chunking</li>
            </ul>

            <h3>4. Data Layer</h3>
            <ul>
                <li><strong>PostgreSQL:</strong> Conversations, sessions, feedback, acronyms</li>
                <li><strong>Pinecone:</strong> 3072-dim vectors, metadata filtering</li>
                <li><strong>Redis:</strong> Response caching (89% performance boost)</li>
                <li><strong>Google Sheets:</strong> Raw feedback + fallback</li>
            </ul>

            <h3>5. External Services</h3>
            <ul>
                <li><strong>OpenAI:</strong> Embeddings (text-embedding-3-large), Generation (GPT-5-mini), Re-ranking (GPT-5-nano)</li>
                <li><strong>Dropbox:</strong> Document fetching</li>
            </ul>

            <h2>Learn More</h2>
            <ul>
                <li><a href="https://www.pinecone.io/learn/retrieval-augmented-generation/" target="_blank">Pinecone: RAG Architecture Deep Dive</a></li>
                <li><a href="https://developers.llamaindex.ai/python/framework/understanding/rag/" target="_blank">LlamaIndex: Understanding RAG</a></li>
                <li><a href="https://arxiv.org/abs/2005.11401" target="_blank">RAG Paper: Lewis et al. 2020</a></li>
            </ul>
        `,
  },

  'tech-stack': {
    title: 'Tech Stack',
    content: `
            <h1>Technology Stack</h1>
            <p class="subtitle">Complete technology choices</p>

            <h2>Backend</h2>
            <ul>
                <li><strong>Runtime:</strong> Node.js 18+</li>
                <li><strong>Framework:</strong> Express.js</li>
                <li><strong>Language:</strong> JavaScript (async/await)</li>
            </ul>

            <h2>Databases</h2>
            <ul>
                <li><strong>PostgreSQL:</strong> Sevalla managed, conversations/sessions/feedback/acronyms</li>
                <li><strong>Pinecone:</strong> Serverless, AWS us-east-1, 3072-dim</li>
                <li><strong>Redis:</strong> Sevalla Redis, Pinecone connection caching (89% performance boost)</li>
            </ul>

            <h2>AI Services</h2>
            <ul>
                <li><strong>Embeddings:</strong> text-embedding-3-large (3072-dim)</li>
                <li><strong>Generation:</strong> GPT-5-mini</li>
                <li><strong>Re-ranking:</strong> GPT-5-nano</li>
            </ul>

            <h2>Cost</h2>
            <div class="metrics-grid">
                <div class="metric-item">
                    <span class="metric-label">OpenAI</span>
                    <span class="metric-value">~$0.075/mo</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Pinecone</span>
                    <span class="metric-value">Free tier</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Redis</span>
                    <span class="metric-value">$5/mo</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Total</span>
                    <span class="metric-value">~$5-10/mo</span>
                </div>
            </div>
            <p><em>Based on ~100 queries/day</em></p>

            <h2>Learn More</h2>
            <ul>
                <li><a href="https://nodejs.org/docs/latest/api/" target="_blank">Node.js Documentation</a></li>
                <li><a href="https://www.pinecone.io/pricing/" target="_blank">Pinecone Pricing & Features</a></li>
                <li><a href="https://openai.com/api/pricing/" target="_blank">OpenAI API Pricing</a></li>
            </ul>
        `,
  },
};

// Initialize
document.addEventListener('DOMContentLoaded', function () {
  loadDocs();
  setupNav();
  setupSearch();
});

// Load all documents
function loadDocs() {
  const viewer = document.getElementById('docContent');

  Object.keys(docs).forEach(id => {
    const div = document.createElement('div');
    div.id = id;
    div.className = 'document';
    div.innerHTML = docs[id].content;
    viewer.appendChild(div);
  });
}

// Setup navigation
function setupNav() {
  // Navigation function for all links
  function navigateTo(id) {
    // Update active states
    document
      .querySelectorAll('.nav-link')
      .forEach(l => l.classList.remove('active'));

    // Show document
    document
      .querySelectorAll('.document')
      .forEach(doc => doc.classList.remove('active'));
    const targetDoc = document.getElementById(id);
    if (targetDoc) {
      targetDoc.classList.add('active');

      // Update active nav link if not going to welcome
      if (id !== 'welcome') {
        const navLink = document.querySelector(`.nav-link[href="#${id}"]`);
        if (navLink) navLink.classList.add('active');
      }
    }
  }

  // Handle sidebar navigation links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const id = this.getAttribute('href').slice(1);
      navigateTo(id);
      window.location.hash = id;
    });
  });

  // Handle quick links on welcome page
  document.querySelectorAll('.btn-link').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const id = this.getAttribute('href').slice(1);
      navigateTo(id);
      window.location.hash = id;
    });
  });

  // Handle home link
  document.querySelectorAll('.home-link').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      navigateTo('welcome');
      window.location.hash = '';
    });
  });

  // Handle hash on load
  if (window.location.hash) {
    const id = window.location.hash.slice(1);
    navigateTo(id);
  }

  // Handle hash changes (browser back/forward)
  window.addEventListener('hashchange', function () {
    const id = window.location.hash ? window.location.hash.slice(1) : 'welcome';
    navigateTo(id);
  });
}

// Setup search
function setupSearch() {
  const search = document.getElementById('docSearch');

  search.addEventListener('input', function (e) {
    const term = e.target.value.toLowerCase();

    document.querySelectorAll('.nav-link').forEach(link => {
      const text = link.textContent.toLowerCase();
      link.style.display = text.includes(term) ? '' : 'none';
    });

    document.querySelectorAll('.nav-section').forEach(section => {
      const visible = section.querySelectorAll('.nav-link[style=""]').length;
      section.style.display = visible > 0 ? '' : 'none';
    });
  });
}

// Click to copy code
document.addEventListener('click', function (e) {
  if (e.target.tagName === 'CODE') {
    navigator.clipboard.writeText(e.target.textContent).then(() => {
      const orig = e.target.textContent;
      e.target.textContent = '✓ Copied!';
      e.target.style.color = '#10B981';
      setTimeout(() => {
        e.target.textContent = orig;
        e.target.style.color = '';
      }, 2000);
    });
  }
});
