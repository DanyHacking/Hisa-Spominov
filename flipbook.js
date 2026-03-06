/**
 * Hiša spominov - Advanced E-Book Reader
 * Modular architecture with adaptive rendering
 * 
 * Modules: core, render, navigation, performance, security, ui
 */

// ============================================================================
// CORE MODULE - Device Detection, Configuration, State
// ============================================================================

const Core = (function() {
    // Device Detection
    const DeviceDetector = {
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        isTablet: /iPad|Android|Tablet|Tab/i.test(navigator.userAgent) && !/Mobile/i.test(navigator.userAgent),
        isDesktop: !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        pixelRatio: window.devicePixelRatio || 1,
        performanceTier: 'high',
        hasTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        
        init() {
            this.screenWidth = window.innerWidth;
            this.screenHeight = window.innerHeight;
            
            // Estimate performance
            if (this.isMobile && this.screenWidth < 400) {
                this.performanceTier = 'low';
            } else if (this.isMobile || (this.isTablet && this.screenWidth < 800)) {
                this.performanceTier = 'medium';
            } else {
                this.performanceTier = 'high';
            }
            
            return this.getDeviceType();
        },
        
        getDeviceType() {
            if (this.isTablet) return 'tablet';
            if (this.isMobile) return 'mobile';
            return 'desktop';
        }
    };

    // Rendering Modes Configuration
    const RENDER_MODES = {
        desktop: {
            flipAnimation: true,
            doublePage: true,
            shadows: true,
            paperTexture: true,
            pageCount: 50,
            scale: 1.4,
            prefetchRange: 5,
            flippingTime: 800,
            useCanvas: true,
            maxShadowOpacity: 0.5,
            maxRenderedPages: 15
        },
        tablet: {
            flipAnimation: true,
            doublePage: false,
            shadows: true,
            paperTexture: true,
            pageCount: 30,
            scale: 1.2,
            prefetchRange: 3,
            flippingTime: 600,
            useCanvas: true,
            maxShadowOpacity: 0.3,
            maxRenderedPages: 10
        },
        mobile: {
            flipAnimation: false,
            doublePage: false,
            shadows: false,
            paperTexture: false,
            pageCount: 15,
            scale: 1.0,
            prefetchRange: 2,
            flippingTime: 300,
            useCanvas: false,
            maxShadowOpacity: 0.1,
            maxRenderedPages: 5
        }
    };

    // Configuration
    let CONFIG = {
        pdfPath: 'pdf/hisa_spominov_poln.pdf',
        scale: 1.2,
        maxScale: 2.5,
        minScale: 0.8,
        prefetchRange: 5,
        pagesToLoad: 50,
        deviceType: 'desktop',
        renderMode: null,
        maxRenderedPages: 10,
        protection: {
            disableRightClick: true,
            disableCopy: true,
            disablePrint: true,
            watermark: 'Hiša spominov',
            dynamicWatermark: true
        }
    };

    // State
    let state = {
        pdfDoc: null,
        currentPage: 1,
        totalPages: 0,
        isLoading: false,
        isNightMode: false,
        isFullscreen: false,
        isSimpleMode: false,
        isLineFocusMode: false,
        pageFlip: null,
        pageImages: new Map(),
        loadedPages: new Set(),
        renderOrder: [],
        bookmarks: JSON.parse(localStorage.getItem('flipbook_bookmarks') || '[]'),
        renderTasks: new Map(),
        isPageFlipping: false,
        lastReadPage: parseInt(localStorage.getItem('lastReadPage') || '1'),
        readingStartTime: Date.now(),
        sessionId: null
    };

    // DOM Elements cache
    let elements = {};

    function initElements() {
        elements = {
            app: document.getElementById('app'),
            coverPage: document.getElementById('cover-page'),
            startButton: document.getElementById('start-reading'),
            flipbookContainer: document.getElementById('flipbook-container'),
            flipbook: document.getElementById('flipbook'),
            flipbookViewport: document.getElementById('flipbook-viewport'),
            prevButton: document.getElementById('prev-page'),
            nextButton: document.getElementById('next-page'),
            pageIndicator: document.getElementById('page-indicator'),
            loading: document.getElementById('loading'),
            resumeOverlay: document.getElementById('resume-overlay'),
            resumePageNum: document.getElementById('resume-page-num'),
            backToCover: document.getElementById('back-to-cover'),
            toggleToc: document.getElementById('toggle-toc'),
            toggleNightMode: document.getElementById('toggle-night-mode'),
            toggleFullscreen: document.getElementById('toggle-fullscreen'),
            toggleBookmark: document.getElementById('toggle-bookmark'),
            showBookmarks: document.getElementById('show-bookmarks'),
            tocOverlay: document.getElementById('toc-overlay'),
            closeToc: document.getElementById('close-toc'),
            bookmarksOverlay: document.getElementById('bookmarks-overlay'),
            closeBookmarks: document.getElementById('close-bookmarks'),
            bookmarksList: document.getElementById('bookmarks-list')
        };
    }

    function getDeviceType() {
        return DeviceDetector.init();
    }

    function applyDeviceSettings() {
        CONFIG.deviceType = getDeviceType();
        CONFIG.renderMode = RENDER_MODES[CONFIG.deviceType];
        
        CONFIG.pagesToLoad = CONFIG.renderMode.pageCount;
        CONFIG.scale = CONFIG.renderMode.scale;
        CONFIG.prefetchRange = CONFIG.renderMode.prefetchRange;
        CONFIG.maxRenderedPages = CONFIG.renderMode.maxRenderedPages;
        
        if (CONFIG.deviceType === 'mobile') {
            state.isSimpleMode = true;
        }
        
        document.body.classList.add('device-' + CONFIG.deviceType);
        document.body.classList.add('performance-' + DeviceDetector.performanceTier);
    }

    return {
        DeviceDetector,
        CONFIG,
        state,
        elements,
        initElements,
        getDeviceType,
        applyDeviceSettings
    };
})();

// ============================================================================
// PERFORMANCE MODULE - FPS, Memory, Telemetry, Auto-Fallback
// ============================================================================

const Performance = (function() {
    let fps = 60;
    let frameCount = 0;
    let lastTime = performance.now();
    let pageLoadTimes = [];
    let memoryUsage = 0;
    let isMonitoring = false;
    let lowFpsCount = 0;
    let currentRenderMode = Core.CONFIG.renderMode;

    function startMonitoring() {
        if (isMonitoring) return;
        isMonitoring = true;
        
        function measure() {
            if (!isMonitoring) return;
            
            frameCount++;
            const now = performance.now();
            const delta = now - lastTime;
            
            if (delta >= 1000) {
                fps = Math.round((frameCount * 1000) / delta);
                frameCount = 0;
                lastTime = now;
                
                checkPerformance();
            }
            
            checkMemory();
            requestAnimationFrame(measure);
        }
        
        requestAnimationFrame(measure);
    }

    function stopMonitoring() {
        isMonitoring = false;
    }

    function checkPerformance() {
        // Auto-fallback if FPS is consistently low
        if (fps < 30) {
            lowFpsCount++;
            if (lowFpsCount >= 3) {
                fallbackToSimplerMode();
                lowFpsCount = 0;
            }
        } else {
            lowFpsCount = 0;
        }
    }

    function checkMemory() {
        if (performance.memory) {
            memoryUsage = Math.round(performance.memory.usedJSHeapSize / (1024 * 1024));
            
            // If memory is getting high, reduce cached pages
            if (memoryUsage > 150 && Core.state.loadedPages.size > Core.CONFIG.maxRenderedPages) {
                Memory.evictOldPages(3);
            }
        }
    }

    function fallbackToSimplerMode() {
        if (Core.state.isSimpleMode) return;
        
        console.warn('Low FPS detected, switching to simple mode');
        Core.state.isSimpleMode = true;
        
        // Notify UI
        if (window.flipbook && window.flipbook.onModeChange) {
            window.flipbook.onModeChange('simple');
        }
    }

    function logPageLoadTime(pageNum, loadTime) {
        pageLoadTimes.push({ page: pageNum, time: loadTime, timestamp: Date.now() });
        
        // Keep only last 50 measurements
        if (pageLoadTimes.length > 50) {
            pageLoadTimes = pageLoadTimes.slice(-50);
        }
    }

    function getAveragePageLoadTime() {
        if (pageLoadTimes.length === 0) return 0;
        const sum = pageLoadTimes.reduce((a, b) => a + b.time, 0);
        return Math.round(sum / pageLoadTimes.length);
    }

    function getTelemetry() {
        return {
            fps,
            memoryUsage,
            avgPageLoadTime: getAveragePageLoadTime(),
            loadedPages: Core.state.loadedPages.size,
            deviceType: Core.CONFIG.deviceType,
            performanceTier: Core.DeviceDetector.performanceTier
        };
    }

    return {
        startMonitoring,
        stopMonitoring,
        logPageLoadTime,
        getTelemetry,
        fps: () => fps,
        memoryUsage: () => memoryUsage
    };
})();

// ============================================================================
// MEMORY MODULE - LRU Cache, Page Eviction
// ============================================================================

const Memory = (function() {
    const pageCache = new Map();
    const textureCache = new Map();
    let maxCacheSize = 10;

    function setMaxCacheSize(size) {
        maxCacheSize = size;
        enforceCacheLimit();
    }

    function cachePage(pageNum, data) {
        // Add to cache with timestamp
        pageCache.set(pageNum, {
            data,
            timestamp: Date.now(),
            lastAccessed: Date.now()
        });
        
        Core.state.renderOrder.push(pageNum);
        enforceCacheLimit();
    }

    function getPage(pageNum) {
        if (pageCache.has(pageNum)) {
            const page = pageCache.get(pageNum);
            page.lastAccessed = Date.now();
            return page.data;
        }
        return null;
    }

    function hasPage(pageNum) {
        return pageCache.has(pageNum);
    }

    function enforceCacheLimit() {
        while (pageCache.size > maxCacheSize) {
            evictOldestPage();
        }
    }

    function evictOldestPage() {
        if (Core.state.renderOrder.length === 0) return;
        
        const oldest = Core.state.renderOrder.shift();
        
        // Remove from cache
        pageCache.delete(oldest);
        
        // Remove from DOM if present
        const pageEl = Core.elements.flipbook.querySelector('[data-page-number="' + oldest + '"]');
        if (pageEl) {
            const img = pageEl.querySelector('img');
            if (img) {
                img.src = '';
                img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
            }
        }
        
        // Also evict texture if exists
        textureCache.delete(oldest);
        
        Core.state.loadedPages.delete(oldest);
        
        console.log('Evicted page:', oldest);
    }

    function evictOldPages(count) {
        for (let i = 0; i < count; i++) {
            evictOldestPage();
        }
    }

    function cacheTexture(pageNum, texture) {
        textureCache.set(pageNum, {
            texture,
            timestamp: Date.now()
        });
    }

    function getTexture(pageNum) {
        return textureCache.get(pageNum);
    }

    function clearAll() {
        pageCache.clear();
        textureCache.clear();
        Core.state.renderOrder = [];
    }

    return {
        setMaxCacheSize,
        cachePage,
        getPage,
        hasPage,
        evictOldPages,
        cacheTexture,
        getTexture,
        clearAll,
        getCacheSize: () => pageCache.size
    };
})();

// ============================================================================
// SECURITY MODULE - Protection, Watermark, CSP
// ============================================================================

const Security = (function() {
    let watermarkElement = null;
    let sessionId = null;

    function generateSessionId() {
        sessionId = 'hs_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        return sessionId;
    }

    function initProtection() {
        const cfg = Core.CONFIG.protection;
        
        // Right click
        if (cfg.disableRightClick) {
            document.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                return false;
            });
        }
        
        // Copy/Cut
        if (cfg.disableCopy) {
            document.addEventListener('copy', function(e) {
                e.preventDefault();
                return false;
            });
            document.addEventListener('cut', function(e) {
                e.preventDefault();
                return false;
            });
            document.addEventListener('selectstart', function(e) {
                if (!Core.elements.flipbookContainer.classList.contains('hidden')) {
                    e.preventDefault();
                    return false;
                }
            });
        }
        
        // Print
        if (cfg.disablePrint) {
            document.addEventListener('beforeprint', function(e) {
                e.preventDefault();
                return false;
            });
            window.print = function() { return false; };
        }
        
        // Generate session
        generateSessionId();
        
        // Add watermark
        if (cfg.watermark) {
            addWatermark();
        }
        
        // Canvas protection
        protectCanvas();
    }

    function addWatermark() {
        if (watermarkElement) return;
        
        watermarkElement = document.createElement('div');
        watermarkElement.className = 'watermark';
        
        updateWatermark();
        
        watermarkElement.style.cssText = [
            'position: fixed',
            'bottom: 20px',
            'right: 20px',
            'font-size: 12px',
            'color: rgba(139, 69, 19, 0.12)',
            'pointer-events: none',
            'z-index: 1000',
            'transform: rotate(-45deg)',
            'user-select: none',
            'font-family: sans-serif'
        ].join(';');
        
        document.body.appendChild(watermarkElement);
    }

    function updateWatermark() {
        if (!watermarkElement || !Core.CONFIG.protection.dynamicWatermark) return;
        
        const userId = getUserId();
        const timestamp = new Date().toLocaleString();
        const text = Core.CONFIG.protection.watermark + ' | ' + userId + ' | ' + timestamp;
        
        watermarkElement.textContent = text;
    }

    function getUserId() {
        let userId = sessionStorage.getItem('hisa_user_id');
        if (!userId) {
            userId = 'u_' + Math.random().toString(36).substr(2, 12);
            sessionStorage.setItem('hisa_user_id', userId);
        }
        return userId;
    }

    function protectCanvas() {
        // Override canvas toDataURL to add watermark
        const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
        
        HTMLCanvasElement.prototype.toDataURL = function() {
            // Add watermark overlay
            const ctx = this.getContext('2d');
            if (ctx) {
                ctx.font = '10px sans-serif';
                ctx.fillStyle = 'rgba(139, 69, 19, 0.1)';
                ctx.fillText(getUserId(), 10, this.height - 10);
            }
            return originalToDataURL.apply(this, arguments);
        };
    }

    function getSessionId() {
        return sessionId;
    }

    function getSecurityInfo() {
        return {
            sessionId,
            userId: getUserId(),
            timestamp: Date.now(),
            userAgent: navigator.userAgent
        };
    }

    return {
        initProtection,
        getSessionId,
        getSecurityInfo,
        updateWatermark
    };
})();

// ============================================================================
// NAVIGATION MODULE - Gestures, Keyboard, Touch
// ============================================================================

const Navigation = (function() {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    let touchVelocity = 0;
    const minSwipeDistance = 50;
    const velocityThreshold = 0.3;
    let gestureInProgress = false;
    let cancelGesture = false;
    let uiHideTimeout = null;
    const UI_HIDE_DELAY = 3000;
    
    function setupAll() {
        setupKeyboard();
        setupTouch();
        setupClickZones();
        setupAutoHideUI();
    }
    
    function setupAutoHideUI() {
        const toolbar = Core.elements.flipbookContainer.querySelector('.toolbar');
        
        function showUI() {
            if (toolbar) toolbar.classList.remove('hidden-ui');
            resetUITimer();
        }
        
        function hideUI() {
            if (toolbar) toolbar.classList.add('hidden-ui');
        }
        
        function resetUITimer() {
            if (uiHideTimeout) clearTimeout(uiHideTimeout);
            uiHideTimeout = setTimeout(hideUI, UI_HIDE_DELAY);
        }
        
        document.addEventListener('mousemove', function() {
            if (!Core.elements.flipbookContainer.classList.contains('hidden')) showUI();
        }, { passive: true });
        
        document.addEventListener('touchstart', function() {
            if (!Core.elements.flipbookContainer.classList.contains('hidden')) showUI();
        }, { passive: true });
        
        document.addEventListener('keydown', function() {
            if (!Core.elements.flipbookContainer.classList.contains('hidden')) showUI();
        });
        
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class') {
                    var isVisible = !Core.elements.flipbookContainer.classList.contains('hidden');
                    if (isVisible) {
                        resetUITimer();
                    } else {
                        if (uiHideTimeout) clearTimeout(uiHideTimeout);
                        if (toolbar) toolbar.classList.remove('hidden-ui');
                    }
                }
            });
        });
        
        observer.observe(Core.elements.flipbookContainer, { attributes: true });
    }
    
    function setupKeyboard() {
        document.addEventListener('keydown', function(e) {
            if (Core.elements.flipbookContainer.classList.contains('hidden')) return;
            if (!Core.elements.tocOverlay.classList.contains('hidden')) return;
            if (!Core.elements.bookmarksOverlay.classList.contains('hidden')) return;
            
            switch (e.key) {
                case 'ArrowLeft':
                case 'PageUp':
                    flipbook.gotoPrevPage();
                    break;
                case 'ArrowRight':
                case 'PageDown':
                case ' ':
                    flipbook.gotoNextPage();
                    e.preventDefault();
                    break;
                case 'Home':
                    flipbook.gotoPage(1);
                    break;
                case 'End':
                    flipbook.gotoPage(Core.state.totalPages);
                    break;
                case 'f':
                case 'F':
                    if (!e.ctrlKey && !e.metaKey) flipbook.toggleFullscreen();
                    break;
                case 'n':
                case 'N':
                    if (!e.ctrlKey && !e.metaKey) flipbook.toggleNightMode();
                    break;
                case 'b':
                case 'B':
                    if (!e.ctrlKey && !e.metaKey) flipbook.toggleBookmark();
                    break;
                case 'Escape':
                    closeAllOverlays();
                    break;
                case '+':
                case '=':
                    flipbook.zoomIn();
                    break;
                case '-':
                    flipbook.zoomOut();
                    break;
            }
        });
    }

    function setupTouch() {
        const viewport = Core.elements.flipbookViewport;
        
        viewport.addEventListener('touchstart', function(e) {
            gestureInProgress = true;
            cancelGesture = false;
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
        }, { passive: true });
        
        viewport.addEventListener('touchmove', function(e) {
            if (!gestureInProgress || cancelGesture) return;
            
            const currentX = e.touches[0].clientX;
            const deltaY = Math.abs(e.touches[0].clientY - touchStartY);
            
            // Cancel if vertical scroll is dominant
            if (deltaY > 30) {
                cancelGesture = true;
            }
        }, { passive: true });
        
        viewport.addEventListener('touchend', function(e) {
            if (!gestureInProgress || cancelGesture) {
                gestureInProgress = false;
                return;
            }
            
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            const deltaTime = Date.now() - touchStartTime;
            
            // Calculate velocity
            touchVelocity = Math.abs(deltaX) / deltaTime;
            
            // Check if horizontal swipe is dominant
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
                // Check velocity for quick gestures
                if (touchVelocity > velocityThreshold || Math.abs(deltaX) > minSwipeDistance * 1.5) {
                    if (deltaX < 0) {
                        flipbook.gotoNextPage();
                    } else {
                        flipbook.gotoPrevPage();
                    }
                }
            }
            
            gestureInProgress = false;
        }, { passive: true });
    }

    function setupClickZones() {
        Core.elements.flipbookViewport.addEventListener('click', function(e) {
            const rect = Core.elements.flipbookViewport.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            
            // Left 30% - previous, Right 30% - next
            if (clickX < width * 0.3) {
                flipbook.gotoPrevPage();
            } else if (clickX > width * 0.7) {
                flipbook.gotoNextPage();
            }
        });
    }

    function closeAllOverlays() {
        Core.elements.tocOverlay.classList.add('hidden');
        Core.elements.bookmarksOverlay.classList.add('hidden');
        if (Core.state.isFullscreen) {
            flipbook.toggleFullscreen();
        }
    }

    return {
        setupAll,
        closeAllOverlays
    };
})();

// ============================================================================
// UI MODULE - Bookmarks, Progress, Reading Comfort
// ============================================================================

const UI = (function() {
    function updatePageIndicator() {
        if (!Core.elements.pageIndicator) return;
        
        const current = Core.state.currentPage;
        const total = Core.state.totalPages;
        
        Core.elements.pageIndicator.textContent = current + ' / ' + total;
        
        // Update progress with transform for performance
        const progressEl = document.getElementById('reading-progress');
        if (progressEl) {
            const progress = current / total;
            progressEl.style.transform = 'scaleX(' + progress + ')';
        }
        
        // Update remaining
        const remainingEl = document.getElementById('pages-remaining');
        if (remainingEl) {
            const remaining = total - current;
            const wordsPerPage = 250;
            const totalWords = remaining * wordsPerPage;
            const minutesToRead = Math.ceil(totalWords / 200);
            
            let timeText = '';
            if (minutesToRead < 60) {
                timeText = minutesToRead + ' min';
            } else {
                const hours = Math.floor(minutesToRead / 60);
                const mins = minutesToRead % 60;
                timeText = hours + 'h ' + mins + 'min';
            }
            
            remainingEl.textContent = '≈ ' + timeText + ' do konca';
        }
    }

    function updateBookmarkButton() {
        const btn = Core.elements.toggleBookmark;
        if (!btn) return;
        
        const isBookmarked = Core.state.bookmarks.some(b => b.page === Core.state.currentPage);
        btn.classList.toggle('active', isBookmarked);
        
        const svg = btn.querySelector('svg');
        if (svg) {
            svg.setAttribute('fill', isBookmarked ? 'currentColor' : 'none');
        }
    }

    function toggleBookmark() {
        const currentPage = Core.state.currentPage;
        
        // Find existing bookmark
        let existingIdx = -1;
        for (let i = 0; i < Core.state.bookmarks.length; i++) {
            if (Core.state.bookmarks[i].page === currentPage) {
                existingIdx = i;
                break;
            }
        }
        
        if (existingIdx > -1) {
            // Remove bookmark
            Core.state.bookmarks.splice(existingIdx, 1);
        } else {
            // Add new bookmark
            Core.state.bookmarks.push({
                page: currentPage,
                type: 'page',
                note: '',
                timestamp: Date.now()
            });
        }
        
        localStorage.setItem('flipbook_bookmarks', JSON.stringify(Core.state.bookmarks));
        updateBookmarkButton();
        updateBookmarksList();
    }

    function updateBookmarksList() {
        const list = Core.elements.bookmarksList;
        if (!list) return;
        
        if (Core.state.bookmarks.length === 0) {
            list.innerHTML = '<div class="no-bookmarks">Ni zaznamkov</div>';
            return;
        }
        
        let html = '';
        for (let i = 0; i < Core.state.bookmarks.length; i++) {
            const bm = Core.state.bookmarks[i];
            html += '<div class="toc-item" data-page="' + bm.page + '">';
            html += '<span>';
            
            // Type icon
            if (bm.type === 'quote') html += '❝ ';
            else if (bm.type === 'chapter') html += '📖 ';
            
            html += 'Stran ' + bm.page;
            if (bm.note) html += ' - ' + bm.note.substring(0, 30);
            html += '</span>';
            html += '<button class="remove-bookmark" data-idx="' + i + '">×</button>';
            html += '</div>';
        }
        
        list.innerHTML = html;
        
        // Add click handlers
        list.querySelectorAll('.toc-item').forEach(function(item) {
            item.addEventListener('click', function(e) {
                if (!e.target.classList.contains('remove-bookmark')) {
                    const pageNum = parseInt(item.dataset.page);
                    flipbook.gotoPage(pageNum);
                    Core.elements.bookmarksOverlay.classList.add('hidden');
                }
            });
        });
        
        list.querySelectorAll('.remove-bookmark').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const idx = parseInt(btn.dataset.idx);
                Core.state.bookmarks.splice(idx, 1);
                localStorage.setItem('flipbook_bookmarks', JSON.stringify(Core.state.bookmarks));
                updateBookmarkButton();
                updateBookmarksList();
            });
        });
    }

    function toggleNightMode() {
        Core.state.isNightMode = !Core.state.isNightMode;
        document.documentElement.setAttribute('data-theme', Core.state.isNightMode ? 'night' : 'light');
        
        if (Core.elements.toggleNightMode) {
            Core.elements.toggleNightMode.classList.toggle('active', Core.state.isNightMode);
        }
        
        localStorage.setItem('nightMode', Core.state.isNightMode);
    }

    function toggleLineFocusMode() {
        Core.state.isLineFocusMode = !Core.state.isLineFocusMode;
        document.body.classList.toggle('line-focus-mode', Core.state.isLineFocusMode);
        
        if (window.flipbook) {
            window.flipbook.onModeChange(Core.state.isLineFocusMode ? 'line-focus' : 'normal');
        }
    }

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(function(err) {
                console.error('Fullscreen error:', err);
            });
            Core.state.isFullscreen = true;
        } else {
            document.exitFullscreen();
            Core.state.isFullscreen = false;
        }
        
        if (Core.elements.toggleFullscreen) {
            Core.elements.toggleFullscreen.classList.toggle('active', Core.state.isFullscreen);
        }
    }
    
    function showResumeOverlay(savedPage) {
        if (!Core.elements.resumeOverlay || !Core.elements.resumePageNum) return;
        
        Core.elements.resumePageNum.textContent = savedPage;
        Core.elements.resumeOverlay.classList.remove('hidden');
        
        // Continue button
        var continueBtn = document.getElementById('resume-continue');
        var startBtn = document.getElementById('resume-start');
        
        if (continueBtn) {
            continueBtn.onclick = function() {
                Core.elements.resumeOverlay.classList.add('hidden');
                Core.state.currentPage = savedPage;
                Render.gotoPage(savedPage);
            };
        }
        
        if (startBtn) {
            startBtn.onclick = function() {
                Core.elements.resumeOverlay.classList.add('hidden');
                Core.state.currentPage = 1;
                localStorage.setItem('lastReadPage', '1');
                Render.gotoPage(1);
            };
        }
    }
    
    function showToc() {
        Core.elements.tocOverlay.classList.remove('hidden');
        Core.elements.bookmarksOverlay.classList.add('hidden');
    }

    function showBookmarks() {
        updateBookmarksList();
        Core.elements.bookmarksOverlay.classList.remove('hidden');
        Core.elements.tocOverlay.classList.add('hidden');
    }

    function initSavedSettings() {
        // Restore night mode
        if (localStorage.getItem('nightMode') === 'true') {
            Core.state.isNightMode = true;
            document.documentElement.setAttribute('data-theme', 'night');
        }
    }

    return {
        updatePageIndicator,
        updateBookmarkButton,
        toggleBookmark,
        updateBookmarksList,
        toggleNightMode,
        toggleLineFocusMode,
        toggleFullscreen,
        showToc,
        showBookmarks,
        initSavedSettings
    };
})();

// ============================================================================
// RENDER MODULE - PDF Rendering, PageFlip, Simple Mode
// ============================================================================

const Render = (function() {
    async function loadPDF() {
        try {
            showLoading();
            
            const loadingTask = pdfjsLib.getDocument({
                url: Core.CONFIG.pdfPath,
                cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
                cMapPacked: true
            });
            
            Core.state.pdfDoc = await loadingTask.promise;
            Core.state.totalPages = Core.state.pdfDoc.numPages;
            
            hideLoading();
            console.log('PDF loaded: ' + Core.state.totalPages + ' pages');
            
            return true;
        } catch (error) {
            console.error('PDF load error:', error);
            hideLoading();
            showError('Napaka pri nalaganju PDF');
            return false;
        }
    }

    async function renderAllPages() {
        showLoading();
        
        const startTime = performance.now();
        
        const firstPage = await Core.state.pdfDoc.getPage(1);
        const viewport = firstPage.getViewport({ scale: Core.CONFIG.scale });
        const dims = { width: viewport.width, height: viewport.height };
        
        const pagesToLoad = Math.min(Core.state.totalPages, Core.CONFIG.pagesToLoad);
        
        for (let i = 1; i <= pagesToLoad; i++) {
            await renderPageAsImage(i, dims);
            Core.state.loadedPages.add(i);
        }
        
        const loadTime = performance.now() - startTime;
        Performance.logPageLoadTime(0, loadTime);
        
        hideLoading();
    }

    async function renderPageAsImage(pageNum, dims) {
        // Check cache first
        const cached = Memory.getPage(pageNum);
        if (cached) return cached;
        
        try {
            const page = await Core.state.pdfDoc.getPage(pageNum);
            const viewport = page.getViewport({ scale: Core.CONFIG.scale });
            
            const canvas = document.createElement('canvas');
            canvas.width = dims.width;
            canvas.height = dims.height;
            
            const ctx = canvas.getContext('2d');
            
            const scaleX = dims.width / viewport.width;
            const scaleY = dims.height / viewport.height;
            const scale = Math.min(scaleX, scaleY);
            
            const scaledViewport = page.getViewport({ scale: scale * Core.CONFIG.scale });
            
            await page.render({
                canvasContext: ctx,
                viewport: scaledViewport
            }).promise;
            
            // Add paper texture if enabled
            if (Core.CONFIG.renderMode.paperTexture) {
                addPaperTexture(ctx, dims.width, dims.height);
            }
            
            const imgData = canvas.toDataURL('image/jpeg', 0.85);
            
            // Cache the page
            Memory.cachePage(pageNum, imgData);
            
            return imgData;
        } catch (error) {
            console.error('Render error:', error);
            return null;
        }
    }

    function addPaperTexture(ctx, width, height) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * 8;
            data[i] = Math.min(255, Math.max(0, data[i] + noise));
            data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
            data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
        }
        
        ctx.putImageData(imageData, 0, 0);
    }

    function initPageFlip() {
        const pages = [];
        
        for (let i = 1; i <= Core.state.totalPages; i++) {
            const pageEl = document.createElement('div');
            pageEl.className = 'page';
            pageEl.dataset.pageNumber = i;
            
            const cached = Memory.getPage(i);
            if (cached) {
                const img = document.createElement('img');
                img.src = cached;
                img.alt = 'Stran ' + i;
                img.draggable = false;
                img.oncontextmenu = function() { return false; };
                pageEl.appendChild(img);
            } else {
                pageEl.innerHTML = '<div class="page-loading">Nalaganje...</div>';
            }
            
            pages.push(pageEl);
        }
        
        Core.elements.flipbook.innerHTML = '';
        pages.forEach(function(page) {
            Core.elements.flipbook.appendChild(page);
        });
        
        // Initialize PageFlip
        Core.state.pageFlip = new St.PageFlip(Core.elements.flipbook, {
            width: 400,
            height: 600,
            size: 'stretch',
            minWidth: 315,
            maxWidth: 800,
            minHeight: 420,
            maxHeight: 1000,
            maxShadowOpacity: Core.CONFIG.renderMode.maxShadowOpacity,
            showCover: true,
            mobileScrollSupport: false,
            flippingTime: Core.CONFIG.renderMode.flippingTime
        });
        
        Core.state.pageFlip.loadFromHTML(pages);
        
        Core.state.pageFlip.on('flip', function(e) {
            Core.state.currentPage = e.data + 1;
            UI.updatePageIndicator();
            prefetchNearbyPages(Core.state.currentPage);
            saveProgress();
        });
        
        loadMorePagesIfNeeded();
    }

    function initSimpleMode() {
        Core.state.isSimpleMode = true;
        Core.elements.flipbook.classList.add('simple-mode');
        Core.elements.flipbook.innerHTML = '';
        
        const pageContainer = document.createElement('div');
        pageContainer.className = 'page-container simple';
        
        const pageEl = document.createElement('div');
        pageEl.className = 'page simple-page';
        pageEl.id = 'current-page';
        
        const cached = Memory.getPage(Core.state.currentPage);
        if (cached) {
            pageEl.innerHTML = '<img class="page-image" src="' + cached + '" alt="Stran ' + Core.state.currentPage + '">';
        }
        
        pageContainer.appendChild(pageEl);
        Core.elements.flipbook.appendChild(pageContainer);
        
        if (Core.state.currentPage > 1) {
            gotoPage(Core.state.currentPage);
        }
    }

    async function loadMorePagesIfNeeded() {
        const currentPage = Core.state.currentPage;
        const range = Core.CONFIG.prefetchRange;
        
        for (let i = Math.max(1, currentPage - range); i <= Math.min(Core.state.totalPages, currentPage + range); i++) {
            if (!Core.state.loadedPages.has(i)) {
                const firstPage = await Core.state.pdfDoc.getPage(1);
                const dims = firstPage.getViewport({ scale: Core.CONFIG.scale });
                
                const imgData = await renderPageAsImage(i, dims);
                if (imgData) {
                    const pageEl = Core.elements.flipbook.querySelector('[data-page-number="' + i + '"]');
                    if (pageEl) {
                        const img = document.createElement('img');
                        img.src = imgData;
                        img.alt = 'Stran ' + i;
                        img.draggable = false;
                        pageEl.innerHTML = '';
                        pageEl.appendChild(img);
                    }
                    Core.state.loadedPages.add(i);
                }
            }
        }
    }

    function gotoPage(pageNum) {
        if (pageNum < 1 || pageNum > Core.state.totalPages) return;
        
        if (Core.state.isSimpleMode) {
            const pageEl = document.getElementById('current-page');
            if (!pageEl) return;
            
            const cached = Memory.getPage(pageNum);
            if (cached) {
                pageEl.innerHTML = '<img class="page-image" src="' + cached + '" alt="Stran ' + pageNum + '">';
            }
        } else if (Core.state.pageFlip) {
            Core.state.pageFlip.flip(pageNum - 1);
        }
        
        Core.state.currentPage = pageNum;
        UI.updatePageIndicator();
        UI.updateBookmarkButton();
        
        localStorage.setItem('lastReadPage', pageNum);
        
        loadMorePagesIfNeeded();
    }

    function gotoNextPage() {
        if (Core.state.currentPage < Core.state.totalPages) {
            gotoPage(Core.state.currentPage + 1);
        }
    }

    function gotoPrevPage() {
        if (Core.state.currentPage > 1) {
            gotoPage(Core.state.currentPage - 1);
        }
    }

    function showLoading() {
        Core.elements.loading.classList.remove('hidden');
    }

    function hideLoading() {
        Core.elements.loading.classList.add('hidden');
    }

    function showError(msg) {
        alert(msg);
    }

    function saveProgress() {
        localStorage.setItem('lastReadPage', Core.state.currentPage);
    }

    function prefetchNearbyPages(pageNum) {
        loadMorePagesIfNeeded();
    }

    return {
        loadPDF,
        renderAllPages,
        initPageFlip,
        initSimpleMode,
        gotoPage,
        gotoNextPage,
        gotoPrevPage,
        saveProgress
    };
})();

// ============================================================================
// ERROR RECOVERY MODULE
// ============================================================================

const ErrorRecovery = (function() {
    function handlePageLoadError(pageNum, retryCount) {
        retryCount = retryCount || 0;
        
        if (retryCount < 3) {
            console.log('Retrying page load:', pageNum, 'Attempt:', retryCount + 1);
            
            setTimeout(function() {
                Render.loadMorePagesIfNeeded();
            }, 1000 * (retryCount + 1));
        } else {
            showFallbackPage(pageNum);
        }
    }

    function showFallbackPage(pageNum) {
        const pageEl = Core.elements.flipbook.querySelector('[data-page-number="' + pageNum + '"]');
        if (pageEl) {
            pageEl.innerHTML = [
                '<div class="error-page">',
                '<p>Napaka pri nalaganju strani</p>',
                '<button onclick="flipbook.gotoPage(' + (pageNum + 1) + ')">Preskoči</button>',
                '</div>'
            ].join('');
        }
    }

    function setupGlobalErrorHandlers() {
        window.addEventListener('error', function(e) {
            console.error('Global error:', e.message);
        });
        
        window.addEventListener('unhandledrejection', function(e) {
            console.error('Unhandled rejection:', e.reason);
        });
    }

    return {
        handlePageLoadError,
        setupGlobalErrorHandlers
    };
})();

// ============================================================================
// MAIN FLIPBOOK API
// ============================================================================

const flipbook = {
    async init() {
        Core.initElements();
        Core.applyDeviceSettings();
        
        Security.initProtection();
        ErrorRecovery.setupGlobalErrorHandlers();
        
        setupEventListeners();
        
        const loaded = await Render.loadPDF();
        if (!loaded) return;
        
        if (typeof initTOC === 'function') {
            initTOC(Core.state.pdfDoc, Core.state.totalPages);
        }
        
        UI.initSavedSettings();
        
        // Show resume overlay if there's a saved page
        var hasSavedPage = Core.state.lastReadPage > 1 && Core.state.lastReadPage <= Core.state.totalPages;
        
        await Render.renderAllPages();
        
        // Initialize based on device
        if (Core.CONFIG.renderMode.flipAnimation && typeof St !== 'undefined') {
            Render.initPageFlip();
        } else {
            Render.initSimpleMode();
        }
        
        UI.updatePageIndicator();
        UI.updateBookmarkButton();
        
        // Show resume overlay if applicable
        if (hasSavedPage) {
            showResumeOverlay(Core.state.lastReadPage);
        }
        
        // Start performance monitoring after first page load (lazy init)
        setTimeout(function() {
            Performance.startMonitoring();
        }, 1000);
        
        // Setup orientation change handling
        handleOrientationChange();
        
        console.log('E-book initialized');
    },
    
    gotoPage: Render.gotoPage,
    gotoNextPage: Render.gotoNextPage,
    gotoPrevPage: Render.gotoPrevPage,
    
    toggleNightMode: UI.toggleNightMode,
    toggleFullscreen: UI.toggleFullscreen,
    toggleBookmark: UI.toggleBookmark,
    toggleLineFocusMode: UI.toggleLineFocusMode,
    
    showToc: UI.showToc,
    showBookmarks: UI.showBookmarks,
    
    getCurrentPage: function() { return Core.state.currentPage; },
    getTotalPages: function() { return Core.state.totalPages; },
    isNightMode: function() { return Core.state.isNightMode; },
    
    getPerformanceTelemetry: Performance.getTelemetry,
    
    onModeChange: function(mode) {
        console.log('Mode changed to:', mode);
    },
    
    zoomIn: function() {
        // Implementation for zoom
    },
    
    zoomOut: function() {
        // Implementation for zoom
    }
};

function setupEventListeners() {
    const e = Core.elements;
    
    e.startButton.addEventListener('click', function() {
        flipbook.init();
    });
    
    e.prevButton.addEventListener('click', Render.gotoPrevPage);
    e.nextButton.addEventListener('click', Render.gotoNextPage);
    e.backToCover.addEventListener('click', function() {
        e.coverPage.classList.remove('hidden');
        e.flipbookContainer.classList.add('hidden');
    });
    
    e.toggleToc.addEventListener('click', UI.showToc);
    e.toggleNightMode.addEventListener('click', UI.toggleNightMode);
    e.toggleFullscreen.addEventListener('click', UI.toggleFullscreen);
    e.toggleBookmark.addEventListener('click', UI.toggleBookmark);
    e.showBookmarks.addEventListener('click', UI.showBookmarks);
    
    e.closeToc.addEventListener('click', function() {
        e.tocOverlay.classList.add('hidden');
    });
    e.closeBookmarks.addEventListener('click', function() {
        e.bookmarksOverlay.classList.add('hidden');
    });
    
    e.tocOverlay.addEventListener('click', function(ev) {
        if (ev.target === e.tocOverlay) e.tocOverlay.classList.add('hidden');
    });
    e.bookmarksOverlay.addEventListener('click', function(ev) {
        if (ev.target === e.bookmarksOverlay) e.bookmarksOverlay.classList.add('hidden');
    });
    
    // Resize handler
    window.addEventListener('resize', debounce(function() {
        Core.DeviceDetector.init();
        if (Core.state.pageFlip) {
            Core.state.pageFlip.update();
        }
    }, 250));
    
    // Fullscreen change
    document.addEventListener('fullscreenchange', function() {
        Core.state.isFullscreen = !!document.fullscreenElement;
        if (e.toggleFullscreen) {
            e.toggleFullscreen.classList.toggle('active', Core.state.isFullscreen);
        }
    });
    
    Navigation.setupAll();
}

function handleOrientationChange() {
    var orientationTimeout = null;
    var resizeTimeout = null;
    
    window.addEventListener('orientationchange', function() {
        // Debounce 200ms
        if (orientationTimeout) clearTimeout(orientationTimeout);
        
        orientationTimeout = setTimeout(function() {
            // Recalculate viewport
            Core.DeviceDetector.init();
            
            // Update pageFlip if exists
            if (Core.state.pageFlip) {
                Core.state.pageFlip.update();
            }
            
            // For simple mode, re-render current page
            if (Core.state.isSimpleMode) {
                Render.gotoPage(Core.state.currentPage);
            }
            
            window.scrollTo(0, 0);
        }, 200);
    });
    
    // Also handle resize for orientation
    window.addEventListener('resize', function() {
        if (resizeTimeout) clearTimeout(resizeTimeout);
        
        resizeTimeout = setTimeout(function() {
            if (window.orientation !== undefined) {
                Core.DeviceDetector.init();
                Memory.setMaxCacheSize(Core.CONFIG.renderMode.maxRenderedPages);
                
                if (Core.state.pageFlip) {
                    Core.state.pageFlip.update();
                }
            }
        }, 200);
    });
}

function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            func.apply(context, args);
        }, wait);
    };
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    window.flipbook = flipbook;
});

export { flipbook };
