// Global search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('globalSearch');

    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();

            // Search through all content
            const allSections = document.querySelectorAll('.stage, .stack-card, .lesson, .content-card, .info-box');

            allSections.forEach(section => {
                const text = section.textContent.toLowerCase();

                if (text.includes(searchTerm) || searchTerm === '') {
                    section.style.display = '';
                    section.style.opacity = '1';
                    section.style.filter = 'none';

                    // Highlight the search term
                    if (searchTerm !== '') {
                        section.style.backgroundColor = '#FEF3C7';
                        section.style.transition = 'background-color 0.3s';

                        setTimeout(() => {
                            section.style.backgroundColor = '';
                        }, 2000);
                    }
                } else {
                    section.style.opacity = '0.3';
                    section.style.filter = 'blur(2px)';
                }
            });

            // Show message if no results
            const visibleCount = Array.from(allSections).filter(s => s.style.opacity !== '0.3').length;

            let messageDiv = document.getElementById('search-message');
            if (searchTerm !== '' && visibleCount === 0) {
                if (!messageDiv) {
                    messageDiv = document.createElement('div');
                    messageDiv.id = 'search-message';
                    messageDiv.style.cssText = 'text-align: center; padding: 3rem; font-size: 1.25rem; color: #64748B;';
                    messageDiv.textContent = 'No results found for "' + searchTerm + '"';
                    document.querySelector('.container').appendChild(messageDiv);
                }
            } else if (messageDiv) {
                messageDiv.remove();
            }
        });
    }

    // Smooth scroll for navigation
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

    // Click to copy code
    document.querySelectorAll('code').forEach(code => {
        code.style.cursor = 'pointer';
        code.title = 'Click to copy';

        code.addEventListener('click', function() {
            const text = this.textContent;
            navigator.clipboard.writeText(text).then(() => {
                const original = this.textContent;
                this.textContent = '✓ Copied!';
                this.style.color = '#10B981';

                setTimeout(() => {
                    this.textContent = original;
                    this.style.color = '';
                }, 2000);
            });
        });
    });

    // Animate on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.stage, .stack-card, .lesson').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });

    // Counter animation for stats
    const stats = document.querySelectorAll('.stat-number');
    let animated = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                stats.forEach(stat => {
                    const text = stat.textContent;
                    const match = text.match(/\d+/);
                    if (match) {
                        const target = parseInt(match[0]);
                        let current = 0;
                        const increment = target / 50;

                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= target) {
                                stat.textContent = text;
                                clearInterval(timer);
                            } else {
                                stat.textContent = Math.floor(current) + (text.includes('+') ? '+' : '');
                            }
                        }, 30);
                    }
                });
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        statsObserver.observe(heroStats);
    }

    // Console easter egg
    console.log('%c📚 RAG System Knowledge Library', 'font-size: 20px; font-weight: bold; color: #4F46E5;');
    console.log('%cBuilt with verified code analysis', 'font-size: 14px; color: #64748B;');
    console.log('%cUse the search bar to explore!', 'font-size: 12px; color: #10B981;');
});
