// Features data extracted from verified code analysis
const featuresData = [
    {
        name: "Five-Stage Intelligent Retrieval Pipeline",
        category: "retrieval",
        description: "Advanced hybrid retrieval system combining multiple optimization techniques",
        implementation: "src/rag/vector-ops/retrieve.js",
        details: "Pipeline stages: (1) Acronym Expansion - expands 210 UGA-specific acronyms in queries, (2) Metadata Filtering - keyword-based category detection filters Pinecone queries, (3) Vector Search - OpenAI text-embedding-3-large with Pinecone, (4) Feedback Learning - PostgreSQL-based score adjustment from user feedback, (5) LLM Re-ranking - GPT-4o-mini reorders results when scores are uncertain (<0.05 difference) or for temporal/comparison queries"
    },
    {
        name: "PostgreSQL-Backed Conversation Memory",
        category: "conversation",
        description: "Persistent multi-turn conversation tracking with session management",
        implementation: "src/conversationMemoryPostgres.js",
        details: "Stores conversation history in PostgreSQL with anonymous session IDs. Features: max 10 turns per session, 30-minute TTL, automatic cleanup, session export API, feedback tracking. Survives server restarts and enables multi-instance deployments."
    },
    {
        name: "Intelligent Question Reframing",
        category: "conversation",
        description: "Converts context-dependent follow-up questions into standalone queries",
        implementation: "src/questionReframer.js",
        details: "Uses heuristics to detect context-dependent questions (pronouns, generic actions, short queries). Employs LLM to reframe questions using conversation history. Includes ambiguity detection with optional clarification mode. Example: 'What about the drawbacks?' → 'What are the main drawbacks of using vector databases?'"
    },
    {
        name: "Feedback Learning System",
        category: "retrieval",
        description: "User feedback improves search rankings over time",
        implementation: "src/rag/feedback/feedbackLearningPostgres.js",
        details: "Collects feedback from Google Sheets, analyzes with LLM-powered comment scorer, stores aggregated scores in PostgreSQL. Adjusts retrieval scores by up to ±10% based on historical performance. Tracks source-level performance and successful query patterns."
    },
    {
        name: "LLM Re-ranking",
        category: "retrieval",
        description: "Semantic reordering of search results when vector similarity is insufficient",
        implementation: "src/rag/vector-ops/retrieve.js:23-101",
        details: "Triggers on: (1) uncertain scores (top 3 within 0.05 threshold), (2) temporal queries (latest, recent, current), (3) comparison queries (difference, versus, compare). Uses GPT-4o-mini with truncated passages (400 chars). Adds 200-400ms latency, costs ~$0.0001 per operation, triggers on 20-30% of queries."
    },
    {
        name: "Acronym Expansion",
        category: "retrieval",
        description: "Automatic detection and expansion of domain-specific acronyms",
        implementation: "src/rag/utils/acronymExpander.js",
        details: "Loads 210 UGA-specific acronyms from PostgreSQL into memory at startup. Zero latency impact (in-memory lookup). Whole-word, case-insensitive matching. Appends definitions to queries before embedding. Examples: CAES → 'College of Agricultural and Environmental Sciences', NIFA → 'National Institute of Food and Agriculture'."
    },
    {
        name: "Metadata Filtering",
        category: "retrieval",
        description: "Query-aware content filtering before vector search",
        implementation: "src/rag/vector-ops/retrieve.js:149-190",
        details: "Keyword detection triggers Pinecone metadata filters. Maps query keywords to categories (e.g., 'travel' → hr_financial_help, abo_policies, intranet_files). Filters by category, sourceType, and priority. Improves precision by 15-25% on category-specific queries."
    },
    {
        name: "Authenticated Intranet Crawler",
        category: "processing",
        description: "Crawls password-protected ColdFusion/WordPress sites",
        implementation: "src/rag/crawlers/*.js",
        details: "Custom crawler with token-based authentication for ColdFusion passthrough. Extracts content using JSDOM + Readability. Converts HTML to markdown with Turndown. Crawlers for: GaCounts app, ABO policies, OIT help, OLOD leadership, OMC marketing, Brand guidelines, TeamDynamix KB."
    },
    {
        name: "Multi-Format Document Processing",
        category: "processing",
        description: "Extracts content from diverse document types",
        implementation: "src/rag/ingestion/ingest.js + python/document_processor.py",
        details: "Node.js: PDF (pdf-parse), Word (mammoth), PowerPoint (node-pptx-parser), Excel (xlsx), HTML, Markdown. Python processor for advanced extraction: python-docx, python-pptx, PyPDF2, openpyxl. LinkedIn profile extraction from content. Dropbox API integration for share link processing."
    },
    {
        name: "Intelligent Chunking",
        category: "processing",
        description: "Context-aware text segmentation with overlap",
        implementation: "src/rag/ingestion/chunk.js",
        details: "Smart boundary detection: paragraph breaks (priority 1), sentence endings (priority 2), line breaks (priority 3), word boundaries (priority 4). Config: 1200 char max, 200 char overlap, 400 char minimum viable chunk. Preserves source URLs across chunks."
    },
    {
        name: "Enhanced Metadata Enrichment",
        category: "processing",
        description: "Automatic tagging and categorization during ingestion",
        implementation: "src/rag/ingestion/ingest-enhanced.js",
        details: "Path-based classification into 14 categories: abo_policies, hr_financial_help, ga_counts_app, documentation, ets_training, leadership_dev, brand_guidelines, marketing, oit_help, extension_calendar, intranet_files, teamdynamix_kb, general_web. Priority scoring (1-10). Source type tagging."
    },
    {
        name: "Multi-User Basic Authentication",
        category: "infrastructure",
        description: "HTTP Basic Auth with team access support",
        implementation: "src/authMiddleware.js",
        details: "Supports multiple authorized users via environment variable (AUTHORIZED_USERS format: user1:pass1,user2:pass2). Falls back to single admin user (ADMIN_USER/ADMIN_PASS). Exempts /health endpoint. Logs all authentication attempts."
    },
    {
        name: "Google Sheets Feedback Storage",
        category: "infrastructure",
        description: "Persistent feedback collection with fallback",
        implementation: "src/googleSheetsStorage.js",
        details: "Google Sheets API integration with service account auth. Stores: timestamp, messageId, question, answer, rating, comments, sources, userAgent, IP, authenticatedUser. Graceful fallback to local file storage if Google Sheets unavailable."
    },
    {
        name: "Comment Scoring System",
        category: "retrieval",
        description: "Nuanced feedback analysis distinguishing criticism types",
        implementation: "src/rag/feedback/commentScorer.js",
        details: "Rule-based scoring with LLM fallback for ambiguous comments. Detects 'helpful_with_issues' (source issues vs content complaints). Pattern matching for: outdated content, broken links, wrong answer, formatting issues. Smart scoring: helpful=1.0, helpful_with_issues=0.7, not_helpful=0.0."
    },
    {
        name: "Date-Aware Retrieval",
        category: "retrieval",
        description: "Prioritizes recent content when similarity scores are close",
        implementation: "src/rag/vector-ops/retrieve.js:311-393",
        details: "Extracts dates from filenames using multiple patterns: YYYY, MM.DD.YY, MM-DD-YYYY, YYYY-MM-DD, Month Year. When scores differ by <0.02, sorts by date (newer first). Combines with feedback scoring for optimal ranking."
    },
    {
        name: "Anti-Hallucination System Prompt",
        category: "conversation",
        description: "Strict guardrails preventing fabricated information",
        implementation: "src/prompts/systemPrompt.txt",
        details: "Critical rules: (1) ONLY use context information, (2) NEVER invent login steps or procedures, (3) Required approach for login questions - either quote directly or refer to support contact, (4) Example-based training (bad vs good responses), (5) Markdown-only formatting requirement."
    },
    {
        name: "Dropbox Integration",
        category: "processing",
        description: "Fetches and processes documents from Dropbox share links",
        implementation: "src/rag/utils/dropboxFetcher.js + python/dropbox_api_processor.py",
        details: "Two modes: (1) Share link processing (converts ?dl=0 to ?dl=1 for direct download), (2) Dropbox API with access token for full folder traversal. Python script for batch processing. Handles 65+ Georgia Counts help documents."
    },
    {
        name: "Pinecone Vector Database",
        category: "infrastructure",
        description: "Serverless vector storage with metadata filtering",
        implementation: "src/rag/utils/pineconeClient.js",
        details: "Pinecone serverless index on AWS us-east-1. 3072 dimensions (OpenAI text-embedding-3-large). Cosine similarity metric. Namespace support for data isolation. Metadata filtering capability. Batch upsert with 10 vectors per batch."
    },
    {
        name: "Express REST API",
        category: "infrastructure",
        description: "Production-ready API with comprehensive endpoints",
        implementation: "src/server.js",
        details: "Endpoints: POST /chat (main chat), POST /feedback (user feedback), POST /chat/clear-session, GET /chat/stats, GET /chat/export/:sessionId, GET /debug-query, GET /health, GET /feedback/status. CORS with whitelist. API key authentication. Graceful error handling."
    },
    {
        name: "Session Management & Analytics",
        category: "conversation",
        description: "Comprehensive session tracking and export capabilities",
        implementation: "src/conversationMemoryPostgres.js",
        details: "Features: session creation with crypto-random IDs, auto-cleanup of 30min+ inactive sessions, session export with full history, statistics endpoint (active sessions, total turns), feedback integration per turn, pending clarification tracking."
    },
    {
        name: "URL Normalization",
        category: "infrastructure",
        description: "Automatic conversion of dev URLs to production",
        implementation: "src/server.js:262-409",
        details: "Replaces devssl.caes.uga.edu with secure.caes.uga.edu in: context text, source URLs, response content. Ensures users see production URLs. Handles Georgia Counts specific logic (adds help menu URL context)."
    },
    {
        name: "Clarification Mode (Optional)",
        category: "conversation",
        description: "Asks users to clarify ambiguous follow-up questions",
        implementation: "src/questionReframer.js:201-310 + server.js",
        details: "Detectable via ENABLE_CLARIFICATION_MODE env var. Detects ambiguity: generic actions without entities, pronouns, vague questions. Returns clarification request instead of auto-reframing. Stores pending clarification in PostgreSQL."
    },
    {
        name: "Debug Mode",
        category: "infrastructure",
        description: "Comprehensive logging for development and troubleshooting",
        implementation: "Throughout codebase, controlled by DEBUG_RAG env var",
        details: "Shows: question reframing details, acronym expansions, metadata filter application, retrieval scores (original + adjusted + feedback boost), re-ranking decisions, conversation turn counts, query processing pipeline. Adds debug object to API responses."
    },
    {
        name: "Source Deduplication",
        category: "retrieval",
        description: "Intelligent deduplication of source links in responses",
        implementation: "src/server.js:398-486",
        details: "Filters sources by usefulness: prioritizes web page URLs over markdown files, links Dropbox documents, adds Georgia Counts help menu for GA Counts content, links brand guidelines for logo queries. Deduplicates by URL. Returns top 3 most relevant sources."
    },
    {
        name: "LinkedIn Profile Extraction",
        category: "processing",
        description: "Detects and extracts LinkedIn profiles from documents",
        implementation: "src/rag/ingestion/ingest.js:103-157",
        details: "Pattern matching for: direct LinkedIn URLs (linkedin.com/in/...), name patterns with connect/message buttons. Enhances text with LinkedIn profile section. Generates search URLs for detected names. Filters out organizational names."
    }
];

// Initialize features on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeFeatures();
    initializeFilterButtons();
    initializeSmoothScroll();
    animateOnScroll();
});

// Populate features grid
function initializeFeatures() {
    const featuresGrid = document.getElementById('featuresGrid');

    featuresData.forEach(feature => {
        const card = document.createElement('div');
        card.className = `feature-card ${feature.category}`;
        card.setAttribute('data-category', feature.category);

        card.innerHTML = `
            <div class="feature-header">
                <h3>${feature.name}</h3>
                <span class="feature-tag">${feature.category}</span>
            </div>
            <p class="feature-description">${feature.description}</p>
            <div class="feature-implementation">
                <strong>Implementation:</strong>
                <code>${feature.implementation}</code>
            </div>
            <div class="feature-details">
                <strong>Technical Details:</strong><br>
                ${feature.details}
            </div>
        `;

        featuresGrid.appendChild(card);
    });
}

// Filter functionality
function initializeFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const featureCards = document.querySelectorAll('.feature-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            // Filter cards
            featureCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.classList.remove('hidden');
                    card.style.display = 'block';
                } else {
                    card.classList.add('hidden');
                    setTimeout(() => {
                        if (card.classList.contains('hidden')) {
                            card.style.display = 'none';
                        }
                    }, 300);
                }
            });
        });
    });
}

// Smooth scroll for navigation links
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Animate elements on scroll
function animateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe all cards and stages
    document.querySelectorAll('.feature-card, .optimization-card, .overview-card, .pipeline-stage').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}

// Add interactive hover effects to pipeline stages
document.addEventListener('DOMContentLoaded', function() {
    const pipelineStages = document.querySelectorAll('.pipeline-stage');

    pipelineStages.forEach((stage, index) => {
        stage.style.animationDelay = `${index * 0.1}s`;

        stage.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px) scale(1.02)';
        });

        stage.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0) scale(1)';
        });
    });
});

// Add click-to-copy functionality for code references
document.addEventListener('DOMContentLoaded', function() {
    const codeRefs = document.querySelectorAll('.code-ref, .feature-implementation code');

    codeRefs.forEach(code => {
        code.style.cursor = 'pointer';
        code.title = 'Click to copy';

        code.addEventListener('click', function() {
            const text = this.textContent;
            navigator.clipboard.writeText(text).then(() => {
                // Visual feedback
                const originalText = this.textContent;
                this.textContent = '✓ Copied!';
                this.style.color = '#10B981';

                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.color = '';
                }, 2000);
            });
        });
    });
});

// Navbar scroll effect
let lastScroll = 0;
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// Add statistics counter animation
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Trigger counter animation when hero is visible
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const stats = document.querySelectorAll('.stat-number');
            stats.forEach(stat => {
                const text = stat.textContent;
                const match = text.match(/\d+/);
                if (match) {
                    const number = parseInt(match[0]);
                    animateCounter(stat, number);
                }
            });
            heroObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', function() {
    const hero = document.querySelector('.hero');
    if (hero) {
        heroObserver.observe(hero);
    }
});

// Add search functionality (bonus feature)
function addSearchFunctionality() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search features...';
    searchInput.className = 'feature-search';
    searchInput.style.cssText = `
        width: 100%;
        max-width: 500px;
        margin: 0 auto 2rem;
        display: block;
        padding: 1rem;
        border: 2px solid var(--border-color);
        border-radius: 50px;
        font-size: 1rem;
        font-family: inherit;
    `;

    const featuresSection = document.getElementById('features');
    const filterButtons = document.querySelector('.feature-filters');

    if (featuresSection && filterButtons) {
        filterButtons.parentNode.insertBefore(searchInput, filterButtons.nextSibling);

        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const featureCards = document.querySelectorAll('.feature-card');

            featureCards.forEach(card => {
                const text = card.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    card.style.display = 'block';
                    card.classList.remove('hidden');
                } else {
                    card.style.display = 'none';
                    card.classList.add('hidden');
                }
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', addSearchFunctionality);

// Console easter egg
console.log('%c🤖 CAES RAG System Documentation', 'font-size: 20px; font-weight: bold; color: #4F46E5;');
console.log('%cBuilt with verified code analysis from the intranetChatbot codebase', 'font-size: 14px; color: #64748B;');
console.log('%c25+ features • 13+ optimizations • Production-ready', 'font-size: 12px; color: #10B981;');
