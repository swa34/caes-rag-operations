// All documentation content
const docs = {
  'llm-reranking': {
    title: 'LLM Re-ranking',
    content: `
            <h1>LLM Re-ranking</h1>
            <p class="subtitle">Semantic reordering using GPT-4o-mini when vector scores are ambiguous</p>

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
            <p class="subtitle">5-layer architecture overview</p>

            <h2>Layers</h2>

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
                <li><strong>Google Sheets:</strong> Raw feedback + fallback</li>
            </ul>

            <h3>5. External Services</h3>
            <ul>
                <li><strong>OpenAI:</strong> Embeddings (text-embedding-3-large), Generation (GPT-5-mini)</li>
                <li><strong>Dropbox:</strong> Document fetching</li>
            </ul>

            <h2>Data Flow</h2>
            <ol>
                <li>User query → Express</li>
                <li>Load conversation history</li>
                <li>Reframe if needed</li>
                <li>Expand acronyms</li>
                <li>Detect categories</li>
                <li>Embed query</li>
                <li>Vector search with filters</li>
                <li>Adjust scores with feedback</li>
                <li>Re-rank if needed</li>
                <li>Generate response</li>
                <li>Save conversation</li>
            </ol>

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
            </ul>

            <h2>AI Services</h2>
            <ul>
                <li><strong>Embeddings:</strong> text-embedding-3-large (3072-dim)</li>
                <li><strong>Generation:</strong> GPT-5-mini</li>
                <li><strong>Re-ranking:</strong> GPT-5-mini</li>
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
