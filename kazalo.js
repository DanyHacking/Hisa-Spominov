/**
 * Hiša spominov - Table of Contents (Kazalo)
 * Generates and manages the table of contents for the flipbook
 */

// TOC data structure based on the book's content
const TOC_DATA = [
    { type: 'part', title: 'Predgovor', page: 2 },
    { type: 'part', title: 'I. HIŠA, KI HRANI SPOMINE', page: null },
    { type: 'chapter', title: '1. Stara hiša na robu mesta', page: null },
    { type: 'chapter', title: '2. Podstrešje', page: null },
    { type: 'chapter', title: '3. Odločitev', page: null },
    { type: 'part', title: 'II. GLAS MATERE', page: null },
    { type: 'chapter', title: '4. Dnevnik ženske', page: null },
    { type: 'chapter', title: '5. Tišina v zakonu', page: null },
    { type: 'chapter', title: '6. Materina ljubezen do otrok', page: null },
    { type: 'chapter', title: '7. Materina ljubezen do moža', page: null },
    { type: 'chapter', title: '8. Prva kriza', page: null },
    { type: 'chapter', title: '9. Upanje', page: null },
    { type: 'part', title: 'III. OČETOV SVET', page: null },
    { type: 'chapter', title: '10. Dnevnik očeta', page: null },
    { type: 'chapter', title: '11. Moški, ki ne zna govoriti o čustvih', page: null },
    { type: 'chapter', title: '12. Očetova jeza', page: null },
    { type: 'chapter', title: "13. Očetovo obžalovanje", page: null },
    { type: 'chapter', title: "14. Očetova utrujenost", page: null },
    { type: 'part', title: 'IV. OTROCI', page: null },
    { type: 'chapter', title: '15. Najstarejši sin', page: null },
    { type: 'chapter', title: '16. Srednji sin', page: null },
    { type: 'chapter', title: '17. Najmlajša hči', page: null },
    { type: 'chapter', title: '18. Otroška osamljenost', page: null },
    { type: 'part', title: 'V. TEMNI ODTENKI', page: null },
    { type: 'chapter', title: '19. Prepiri', page: null },
    { type: 'chapter', title: '20. Razpoke v odnosu', page: null },
    { type: 'chapter', title: '21. Materina utrujenost', page: null },
    { type: 'chapter', title: '22. Otroci v senci konflikta', page: null },
    { type: 'part', title: 'VI. MEJA', page: null },
    { type: 'chapter', title: '23. Materin notranji boj', page: null },
    { type: 'chapter', title: '24. Ljubezen kot razlog za obstanek', page: null },
    { type: 'part', title: 'VII. PRVI KORAK NAZAJ', page: null },
    { type: 'chapter', title: '25. Očetov poskus', page: null },
    { type: 'chapter', title: '26. Majhne spremembe', page: null },
    { type: 'part', title: 'VIII. MOJ ODGOVOR NA ZGODBO', page: null },
    { type: 'chapter', title: '27. Branje z ženo', page: null },
    { type: 'chapter', title: '28. Čustveni zlom', page: null },
    { type: 'chapter', title: '29. Preobrazba', page: null },
    { type: 'chapter', title: '30. Gradnja mostov', page: null },
    { type: 'part', title: 'IX. HIŠA SPOMINOV', page: null },
    { type: 'chapter', title: '31. Lekcije dnevnikov', page: null },
    { type: 'chapter', title: '32. Pomen drobnih trenutkov', page: null },
    { type: 'part', title: 'X. SPOROČILO BRALCEM', page: null },
    { type: 'chapter', title: '33. Ljubite zdaj', page: null },
    { type: 'chapter', title: '34. Odpuščajte hitro', page: null },
    { type: 'chapter', title: '35. Gradite spomine', page: null },
    { type: 'chapter', title: 'Epilog', page: null },
    { type: 'chapter', title: 'Zahvale', page: null }
];

// State
let pdfDoc = null;
let totalPages = 0;
let pageNumberMap = new Map();

/**
 * Initialize the table of contents
 */
function initTOC(pdf, pages) {
    pdfDoc = pdf;
    totalPages = pages;
    
    // Build page number map (estimate based on content structure)
    buildPageNumberMap();
    
    // Generate TOC HTML
    generateTocHTML();
    
    // Set up click handlers
    setupTocClickHandlers();
}

/**
 * Build a map of chapter titles to page numbers
 * Since we don't have actual PDF bookmarks, we'll estimate based on content structure
 */
function buildPageNumberMap() {
    // Calculate approximate page numbers based on content structure
    // Title page is page 1
    // Predgovor starts around page 2
    
    let currentPage = 2; // Start after title page
    let chapterIndex = 0;
    
    TOC_DATA.forEach((item, index) => {
        if (item.page === null) {
            // Assign estimated page number
            if (item.type === 'part') {
                // Parts get their own pages
                item.page = currentPage;
            } else if (item.type === 'chapter') {
                // Estimate chapters (roughly 4-5 pages each for content chapters)
                item.page = currentPage;
                // Add some pages for content
                currentPage += (index < 10 ? 5 : 4); // Earlier chapters tend to be longer
            }
        }
        
        // Store in map
        if (item.type === 'chapter' || item.type === 'part') {
            pageNumberMap.set(item.title, item.page);
        }
    });
    
    // Ensure we don't exceed total pages
    if (currentPage > totalPages) {
        // Recalculate with more accurate distribution
        const chaptersOnly = TOC_DATA.filter(i => i.type === 'chapter');
        const pagesPerChapter = Math.floor((totalPages - 3) / chaptersOnly.length);
        
        currentPage = 2;
        TOC_DATA.forEach(item => {
            if (item.type === 'part') {
                item.page = currentPage;
                currentPage += 1;
            } else if (item.type === 'chapter') {
                item.page = currentPage;
                currentPage += pagesPerChapter;
            }
        });
    }
}

/**
 * Generate HTML for the table of contents
 */
function generateTocHTML() {
    const tocList = document.getElementById('toc-list');
    if (!tocList) return;
    
    let html = '';
    
    TOC_DATA.forEach((item, index) => {
        const itemClass = `toc-item ${item.type}`;
        const displayTitle = item.type === 'part' ? item.title : item.title;
        
        html += `
            <div class="${itemClass}" data-page="${item.page || ''}" data-index="${index}">
                ${item.type === 'part' ? '◦ ' : ''}${displayTitle}
                ${item.page ? `<span class="toc-page-num">${item.page}</span>` : ''}
            </div>
        `;
    });
    
    tocList.innerHTML = html;
    
    // Add styles for page numbers dynamically
    addTocStyles();
}

/**
 * Add additional styles for TOC
 */
function addTocStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .toc-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .toc-page-num {
            font-size: 0.8rem;
            color: var(--text-light);
            opacity: 0.6;
        }
        
        .toc-item:hover .toc-page-num {
            opacity: 1;
            color: var(--primary-color);
        }
    `;
    document.head.appendChild(style);
}

/**
 * Set up click handlers for TOC items
 */
function setupTocClickHandlers() {
    const tocList = document.getElementById('toc-list');
    if (!tocList) return;
    
    tocList.addEventListener('click', (e) => {
        const item = e.target.closest('.toc-item');
        if (!item) return;
        
        const pageNum = item.dataset.page;
        const index = parseInt(item.dataset.index);
        
        if (pageNum && pageNum !== 'null') {
            // Navigate to the page
            if (window.flipbook) {
                window.flipbook.goToPage(parseInt(pageNum));
            }
            
            // Close TOC
            closeTOC();
        }
        
        // Update active state
        document.querySelectorAll('.toc-item').forEach(el => {
            el.classList.remove('active');
        });
        item.classList.add('active');
    });
}

/**
 * Close the TOC overlay
 */
function closeTOC() {
    const tocOverlay = document.getElementById('toc-overlay');
    if (tocOverlay) {
        tocOverlay.classList.add('hidden');
    }
}

/**
 * Open the TOC overlay
 */
function openTOC() {
    const tocOverlay = document.getElementById('toc-overlay');
    if (tocOverlay) {
        tocOverlay.classList.remove('hidden');
    }
}

/**
 * Update active TOC item based on current page
 */
function updateActiveItem(currentPage) {
    let activeIndex = -1;
    
    // Find the last chapter/part that appears before or on current page
    for (let i = TOC_DATA.length - 1; i >= 0; i--) {
        const item = TOC_DATA[i];
        if (item.page && item.page <= currentPage) {
            activeIndex = i;
            break;
        }
    }
    
    // Update active class
    document.querySelectorAll('.toc-item').forEach((el, index) => {
        el.classList.toggle('active', index === activeIndex);
    });
    
    // Scroll active item into view if needed
    const activeItem = document.querySelector('.toc-item.active');
    if (activeItem) {
        activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

/**
 * Search TOC for a specific term
 */
function searchTOC(searchTerm) {
    const term = searchTerm.toLowerCase();
    const results = [];
    
    TOC_DATA.forEach((item, index) => {
        if (item.title.toLowerCase().includes(term)) {
            results.push({
                index,
                title: item.title,
                type: item.type,
                page: item.page
            });
        }
    });
    
    return results;
}

/**
 * Get TOC data
 */
function getTocData() {
    return TOC_DATA;
}

/**
 * Get page number for a specific chapter
 */
function getPageForChapter(chapterTitle) {
    return pageNumberMap.get(chapterTitle);
}

// Export functions
window.toc = {
    init: initTOC,
    close: closeTOC,
    open: openTOC,
    updateActiveItem,
    search: searchTOC,
    getData: getTocData,
    getPageForChapter
};

// Auto-update active item when page changes (runs after both scripts are loaded)
setTimeout(() => {
    const originalGoToPage = window.flipbook?.goToPage;
    if (typeof originalGoToPage === 'function') {
        window.flipbook.goToPage = async function(...args) {
            const result = originalGoToPage.apply(this, args);
            // Update TOC after navigation
            setTimeout(() => {
                if (window.flipbook) {
                    const currentPage = window.flipbook.getCurrentPage();
                    updateActiveItem(currentPage);
                }
            }, 100);
            return result;
        };
    }
}, 500);
