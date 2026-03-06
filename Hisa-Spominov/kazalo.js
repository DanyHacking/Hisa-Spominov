/**
 * Hiša spominov - Table of Contents (Kazalo)
 * Generates and manages the table of contents for the flipbook
 * Complete version with 310 pages
 */

// TOC data structure based on the book's content - 310 pages
const TOC_DATA = [
    { type: 'title', title: 'Hiša spominov', page: 1 },
    { type: 'title', title: 'Ko dnevniki spregovorijo', page: 1 },
    { type: 'part', title: 'Predgovor', page: 2 },
    { type: 'chapter', title: 'Zakaj ta zgodba obstoja', page: 7 },
    { type: 'chapter', title: 'Spomini kot temelj identitete', page: 9 },
    { type: 'chapter', title: 'Kako so bili dnevniki najdeni', page: 11 },
    { type: 'chapter', title: 'Bralec kot soudeleženec zgodbe', page: 14 },
    
    // I. DEL — HIŠA (pages 19-52)
    { type: 'part', title: 'I. DEL — HIŠA', page: 19 },
    { type: 'chapter', title: 'Stara hiša na robu mesta', page: 19 },
    { type: 'chapter', title: 'Vonj prahu in pozabe', page: 22 },
    { type: 'chapter', title: 'Hodnik tišine', page: 26 },
    { type: 'chapter', title: 'Sobe brez življenja', page: 29 },
    { type: 'chapter', title: 'Podstrešje', page: 33 },
    { type: 'chapter', title: 'Škatla z dnevniki', page: 37 },
    { type: 'chapter', title: 'Odločitev, da jih vzamem', page: 41 },
    { type: 'chapter', title: 'Pogovor z ženo', page: 44 },
    { type: 'chapter', title: 'Prva stran', page: 48 },
    
    // II. DEL — MATI (pages 53-104)
    { type: 'part', title: 'II. DEL — MATI', page: 53 },
    { type: 'chapter', title: 'Prvi zapis', page: 53 },
    { type: 'chapter', title: 'Začetek ljubezni', page: 56 },
    { type: 'chapter', title: 'Prvi znaki tišine', page: 60 },
    { type: 'chapter', title: 'Njegove oči', page: 63 },
    { type: 'chapter', title: 'Drobne spremembe', page: 67 },
    { type: 'chapter', title: 'Materina ljubezen do najstarejšega sina', page: 71 },
    { type: 'chapter', title: 'Materina ljubezen do srednjega sina', page: 75 },
    { type: 'chapter', title: 'Materina ljubezen do hčere', page: 78 },
    { type: 'chapter', title: 'Dnevi, ko je še verjela', page: 82 },
    { type: 'chapter', title: 'Prva senca dvoma', page: 86 },
    { type: 'chapter', title: 'Tišina za mizo', page: 90 },
    { type: 'chapter', title: 'Strah pred izgubo bližine', page: 94 },
    { type: 'chapter', title: 'Spomini na začetek', page: 98 },
    
    // III. DEL — OČE (pages 105-144)
    { type: 'part', title: 'III. DEL — OČE', page: 105 },
    { type: 'chapter', title: 'Dnevnik očeta', page: 105 },
    { type: 'chapter', title: 'Moški, ki ne zna govoriti', page: 108 },
    { type: 'chapter', title: 'Teža odgovornosti', page: 112 },
    { type: 'chapter', title: 'Jeza kot obramba', page: 116 },
    { type: 'chapter', title: 'Njegova utrujenost', page: 119 },
    { type: 'chapter', title: 'Strah za otroke', page: 123 },
    { type: 'chapter', title: 'Konflikt z najstarejšim sinom', page: 127 },
    { type: 'chapter', title: 'Noč obžalovanja', page: 131 },
    { type: 'chapter', title: 'Tišina v avtu', page: 135 },
    { type: 'chapter', title: 'Razmišljanje o življenju', page: 138 },
    
    // IV. DEL — OTROCI (pages 145-208)
    { type: 'part', title: 'IV. DEL — OTROCI', page: 145 },
    { type: 'chapter', title: 'Najstarejši sin', page: 145 },
    { type: 'chapter', title: 'Prezgodnja odgovornost', page: 148 },
    { type: 'chapter', title: 'Varuh bratov in sestre', page: 152 },
    { type: 'chapter', title: 'Poslušanje prepira', page: 155 },
    { type: 'chapter', title: 'Občutek krivde', page: 159 },
    { type: 'chapter', title: 'Strah, da postane kot oče', page: 163 },
    
    { type: 'chapter', title: 'Srednji sin', page: 169 },
    { type: 'chapter', title: 'Svet domišljije', page: 169 },
    { type: 'chapter', title: 'Zgodbe kot pobeg', page: 173 },
    { type: 'chapter', title: 'Zgodba o izgubljenih starših', page: 177 },
    { type: 'chapter', title: 'Park in tišina', page: 181 },
    
    { type: 'chapter', title: 'Najmlajša hči', page: 187 },
    { type: 'chapter', title: 'Risba družine', page: 187 },
    { type: 'chapter', title: 'Sonce brez nasmehov', page: 190 },
    { type: 'chapter', title: 'Skrita pod mizo', page: 194 },
    { type: 'chapter', title: 'Najlepši dan', page: 198 },
    { type: 'chapter', title: 'Sanje o pikniku', page: 202 },
    
    // V. DEL — TEMNI ODTENKI (pages 209-240)
    { type: 'part', title: 'V. DEL — TEMNI ODTENKI', page: 209 },
    { type: 'chapter', title: 'Noč prepira', page: 209 },
    { type: 'chapter', title: 'Materin zapis o tisti noči', page: 212 },
    { type: 'chapter', title: 'Očetov zapis o isti noči', page: 216 },
    { type: 'chapter', title: 'Najstarejši sin kot priča', page: 220 },
    { type: 'chapter', title: 'Tišina po viharju', page: 224 },
    { type: 'chapter', title: 'Razpoke v odnosu', page: 228 },
    { type: 'chapter', title: 'Materina utrujenost', page: 232 },
    { type: 'chapter', title: 'Očetov občutek neuspeha', page: 236 },
    
    // VI. DEL — MEJA (pages 241-258)
    { type: 'part', title: 'VI. DEL — MEJA', page: 241 },
    { type: 'chapter', title: 'Materin notranji boj', page: 241 },
    { type: 'chapter', title: 'Občutek izgubljene identitete', page: 245 },
    { type: 'chapter', title: 'Razmišljanje o odhodu', page: 248 },
    { type: 'chapter', title: 'Ljubezen do otrok kot sidro', page: 252 },
    
    // VII. DEL — PRVI PREOBRAT (pages 259-270)
    { type: 'part', title: 'VII. DEL — PRVI PREOBRAT', page: 259 },
    { type: 'chapter', title: 'Očetov poskus povezovanja', page: 259 },
    { type: 'chapter', title: 'Besede sinu', page: 262 },
    { type: 'chapter', title: 'Majhen premik', page: 265 },
    
    // VIII. DEL — NAJU Z ŽENO (pages 271-288)
    { type: 'part', title: 'VIII. DEL — NAJU Z ŽENO', page: 271 },
    { type: 'chapter', title: 'Refleksija ob branju', page: 271 },
    { type: 'chapter', title: 'Ženin čustveni zlom', page: 275 },
    { type: 'chapter', title: 'Pogovor, ki ga nisva nikoli imela', page: 279 },
    { type: 'chapter', title: 'Počasi nazaj drug k drugemu', page: 283 },
    
    // IX. DEL — HIŠA SPOMINOV (pages 289-300)
    { type: 'part', title: 'IX. DEL — HIŠA SPOMINOV', page: 289 },
    { type: 'chapter', title: 'Kaj so nas naučili dnevniki', page: 289 },
    { type: 'chapter', title: 'Pomen drobnih trenutkov', page: 293 },
    { type: 'chapter', title: 'Ljubezen kot odločitev', page: 297 },
    
    // EPILOG (pages 301-308)
    { type: 'part', title: 'EPILOG', page: 301 },
    { type: 'chapter', title: 'Hiša še vedno stoji', page: 301 },
    { type: 'chapter', title: 'Sporočilo bralcem', page: 305 },
    { type: 'chapter', title: 'Ljubite zdaj', page: 305 },
    
    // ZAHVALE (pages 309-310)
    { type: 'part', title: 'Zahvale', page: 309 },
    { type: 'chapter', title: 'Hvala', page: 309 }
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
