/**
 * Hiša spominov - Flipbook JavaScript
 * Handles PDF rendering, page navigation, and user interactions
 */

// Configuration
const CONFIG = {
    pdfPath: 'pdf/hisa_spominov_poln.pdf',
    scale: 1.5,
    zoomScale: 2.0,
    minScale: 1.0,
    maxScale: 3.0,
    prefetchRange: 2
};

// State
const state = {
    pdfDoc: null,
    currentPage: 1,
    totalPages: 0,
    isLoading: false,
    isZoomed: false,
    isNightMode: false,
    isFullscreen: false,
    pageHistory: [],
    canvas: null,
    ctx: null,
    renderTasks: new Map()
};

// DOM Elements
const elements = {
    app: document.getElementById('app'),
    coverPage: document.getElementById('cover-page'),
    startButton: document.getElementById('start-reading'),
    flipbookContainer: document.getElementById('flipbook-container'),
    pdfCanvas: document.getElementById('pdf-canvas'),
    flipbookViewport: document.getElementById('flipbook-viewport'),
    prevButton: document.getElementById('prev-page'),
    nextButton: document.getElementById('next-page'),
    pageIndicator: document.getElementById('page-indicator'),
    loading: document.getElementById('loading'),
    backToCover: document.getElementById('back-to-cover'),
    toggleToc: document.getElementById('toggle-toc'),
    toggleNightMode: document.getElementById('toggle-night-mode'),
    toggleFullscreen: document.getElementById('toggle-fullscreen'),
    toggleZoom: document.getElementById('toggle-zoom'),
    tocOverlay: document.getElementById('toc-overlay'),
    closeToc: document.getElementById('close-toc')
};

/**
 * Initialize the flipbook application
 */
async function init() {
    // Get canvas context
    state.canvas = elements.pdfCanvas;
    state.ctx = state.canvas.getContext('2d');

    // Set up event listeners
    setupEventListeners();

    // Load PDF document
    await loadPDF();

    // Initialize table of contents
    if (typeof initTOC === 'function') {
        initTOC(state.pdfDoc, state.totalPages);
    }

    // Render first page
    await renderPage(state.currentPage);

    // Update navigation buttons
    updateNavigation();

    console.log('Flipbook initialized successfully');
}

/**
 * Load PDF document
 */
async function loadPDF() {
    try {
        showLoading();
        
        const loadingTask = pdfjsLib.getDocument(CONFIG.pdfPath);
        state.pdfDoc = await loadingTask.promise;
        state.totalPages = state.pdfDoc.numPages;
        
        hideLoading();
        
        console.log(`PDF loaded: ${state.totalPages} pages`);
        
        // Prefetch first few pages
        prefetchPages(1, CONFIG.prefetchRange);
        
    } catch (error) {
        console.error('Error loading PDF:', error);
        hideLoading();
        showError('Napaka pri nalaganju PDF datoteke. Preverite, ali datoteka obstaja.');
    }
}

/**
 * Render a specific page
 */
async function renderPage(pageNum) {
    if (!state.pdfDoc || pageNum < 1 || pageNum > state.totalPages) {
        return;
    }

    // Cancel any pending render task for this page
    if (state.renderTasks.has(pageNum)) {
        state.renderTasks.get(pageNum).cancel();
    }

    try {
        showLoading();
        
        // Get the page
        const page = await state.pdfDoc.getPage(pageNum);
        
        // Calculate scale to fit viewport
        const viewport = calculateViewport(page);
        
        // Set canvas dimensions
        state.canvas.width = viewport.width;
        state.canvas.height = viewport.height;
        
        // Render the page
        const renderContext = {
            canvasContext: state.ctx,
            viewport: viewport,
            intent: 'display'
        };
        
        const renderTask = page.render(renderContext);
        state.renderTasks.set(pageNum, renderTask);
        
        await renderTask.promise;
        
        // Update state
        state.currentPage = pageNum;
        state.pageHistory.push(pageNum);
        
        // Update UI
        updatePageIndicator();
        updateNavigation();
        
        // Prefetch nearby pages
        prefetchPages(pageNum, CONFIG.prefetchRange);
        
        hideLoading();
        
    } catch (error) {
        if (error.name !== 'RenderingCancelledException') {
            console.error('Error rendering page:', error);
        }
        hideLoading();
    }
}

/**
 * Calculate viewport dimensions to fit the canvas in the viewport
 */
function calculateViewport(page) {
    const viewportEl = elements.flipbookViewport;
    const containerWidth = viewportEl.clientWidth - 80; // Account for nav buttons
    const containerHeight = viewportEl.clientHeight - 40;
    
    // Get original viewport
    const originalViewport = page.getViewport({ scale: 1 });
    
    // Calculate scale to fit
    const scaleX = containerWidth / originalViewport.width;
    const scaleY = containerHeight / originalViewport.height;
    const scale = Math.min(scaleX, scaleY, CONFIG.scale);
    
    return page.getViewport({ scale });
}

/**
 * Prefetch pages for smoother navigation
 */
function prefetchPages(currentPage, range) {
    for (let i = -range; i <= range; i++) {
        const pageNum = currentPage + i;
        if (pageNum >= 1 && pageNum <= state.totalPages && pageNum !== currentPage) {
            // Prefetch page (we don't render it, just get it to cache)
            state.pdfDoc.getPage(pageNum).catch(() => {});
        }
    }
}

/**
 * Navigate to previous page
 */
async function goToPrevPage() {
    if (state.currentPage > 1) {
        await renderPage(state.currentPage - 1);
    }
}

/**
 * Navigate to next page
 */
async function goToNextPage() {
    if (state.currentPage < state.totalPages) {
        await renderPage(state.currentPage + 1);
    }
}

/**
 * Navigate to specific page
 */
async function goToPage(pageNum) {
    if (pageNum >= 1 && pageNum <= state.totalPages && pageNum !== state.currentPage) {
        await renderPage(pageNum);
    }
}

/**
 * Update page indicator
 */
function updatePageIndicator() {
    elements.pageIndicator.textContent = `${state.currentPage} / ${state.totalPages}`;
}

/**
 * Update navigation buttons state
 */
function updateNavigation() {
    elements.prevButton.disabled = state.currentPage <= 1;
    elements.nextButton.disabled = state.currentPage >= state.totalPages;
    
    // Add/remove animation classes
    elements.prevButton.classList.toggle('hidden', state.currentPage <= 1);
    elements.nextButton.classList.toggle('hidden', state.currentPage >= state.totalPages);
}

/**
 * Show loading indicator
 */
function showLoading() {
    elements.loading.classList.remove('hidden');
}

/**
 * Hide loading indicator
 */
function hideLoading() {
    elements.loading.classList.add('hidden');
}

/**
 * Show error message
 */
function showError(message) {
    alert(message);
}

/**
 * Toggle night mode
 */
function toggleNightMode() {
    state.isNightMode = !state.isNightMode;
    document.documentElement.setAttribute('data-theme', state.isNightMode ? 'night' : 'light');
    elements.toggleNightMode.classList.toggle('active', state.isNightMode);
}

/**
 * Toggle fullscreen mode
 */
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.error('Error enabling fullscreen:', err);
        });
        state.isFullscreen = true;
    } else {
        document.exitFullscreen();
        state.isFullscreen = false;
    }
    elements.toggleFullscreen.classList.toggle('active', state.isFullscreen);
}

/**
 * Toggle zoom mode
 */
function toggleZoom() {
    state.isZoomed = !state.isZoomed;
    elements.flipbookContainer.classList.toggle('zoom-active', state.isZoomed);
    elements.toggleZoom.classList.toggle('active', state.isZoomed);
    
    // Re-render current page with new scale
    renderPage(state.currentPage);
}

/**
 * Show/hide table of contents
 */
function toggleToc() {
    elements.tocOverlay.classList.toggle('hidden');
}

/**
 * Close table of contents
 */
function closeToc() {
    elements.tocOverlay.classList.add('hidden');
}

/**
 * Go back to cover page
 */
function goToCover() {
    elements.coverPage.classList.remove('hidden');
    elements.flipbookContainer.classList.add('hidden');
}

/**
 * Start reading (from cover to first page)
 */
async function startReading() {
    elements.coverPage.classList.add('hidden');
    elements.flipbookContainer.classList.remove('hidden');
    
    // Ensure PDF is loaded
    if (!state.pdfDoc) {
        await loadPDF();
    }
    
    await renderPage(1);
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // Start reading button
    elements.startButton.addEventListener('click', startReading);
    
    // Navigation buttons
    elements.prevButton.addEventListener('click', goToPrevPage);
    elements.nextButton.addEventListener('click', goToNextPage);
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Toolbar buttons
    elements.backToCover.addEventListener('click', goToCover);
    elements.toggleToc.addEventListener('click', toggleToc);
    elements.toggleNightMode.addEventListener('click', toggleNightMode);
    elements.toggleFullscreen.addEventListener('click', toggleFullscreen);
    elements.toggleZoom.addEventListener('click', toggleZoom);
    
    // TOC close button
    elements.closeToc.addEventListener('click', closeToc);
    
    // Click outside TOC to close
    elements.tocOverlay.addEventListener('click', (e) => {
        if (e.target === elements.tocOverlay) {
            closeToc();
        }
    });
    
    // Touch swipe navigation
    setupTouchNavigation();
    
    // Window resize
    window.addEventListener('resize', debounce(() => {
        if (state.pdfDoc) {
            renderPage(state.currentPage);
        }
    }, 250));
    
    // Fullscreen change event
    document.addEventListener('fullscreenchange', () => {
        state.isFullscreen = !!document.fullscreenElement;
        elements.toggleFullscreen.classList.toggle('active', state.isFullscreen);
    });
    
    // Mouse wheel navigation
    elements.flipbookViewport.addEventListener('wheel', handleWheelNavigation, { passive: true });
}

/**
 * Handle keyboard navigation
 */
function handleKeyboardNavigation(e) {
    // Only handle if flipbook is visible
    if (elements.flipbookContainer.classList.contains('hidden')) {
        return;
    }
    
    switch (e.key) {
        case 'ArrowLeft':
        case 'PageUp':
            goToPrevPage();
            break;
        case 'ArrowRight':
        case 'PageDown':
        case ' ':
            goToNextPage();
            e.preventDefault();
            break;
        case 'Home':
            goToPage(1);
            break;
        case 'End':
            goToPage(state.totalPages);
            break;
        case 'f':
        case 'F':
            if (!e.ctrlKey && !e.metaKey) {
                toggleFullscreen();
            }
            break;
        case 'n':
        case 'N':
            if (!e.ctrlKey && !e.metaKey) {
                toggleNightMode();
            }
            break;
        case 'Escape':
            if (!elements.tocOverlay.classList.contains('hidden')) {
                closeToc();
            } else if (state.isFullscreen) {
                toggleFullscreen();
            }
            break;
    }
}

/**
 * Handle mouse wheel navigation
 */
function handleWheelNavigation(e) {
    // Only handle vertical scroll
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        if (e.deltaY > 0) {
            goToNextPage();
        } else if (e.deltaY < 0) {
            goToPrevPage();
        }
    }
}

/**
 * Set up touch navigation
 */
function setupTouchNavigation() {
    let touchStartX = 0;
    let touchStartY = 0;
    const minSwipeDistance = 50;
    
    elements.flipbookViewport.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    elements.flipbookViewport.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        // Determine swipe direction
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX < 0) {
                // Swipe left - next page
                goToNextPage();
            } else {
                // Swipe right - previous page
                goToPrevPage();
            }
        }
    }, { passive: true });
}

/**
 * Debounce utility function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);

// Export functions for external use
window.flipbook = {
    init: init,
    goToPage,
    goToNextPage,
    goToPrevPage,
    toggleNightMode,
    toggleFullscreen,
    toggleZoom,
    toggleToc,
    getCurrentPage: () => state.currentPage,
    getTotalPages: () => state.totalPages,
    isNightMode: () => state.isNightMode,
    isFullscreen: () => state.isFullscreen,
    isZoomed: () => state.isZoomed
};
