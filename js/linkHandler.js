class LinkHandler {
    constructor() {
        this.init();
    }

    init() {
        this.setupLinkHandlers();
        this.validateAllLinks();
    }

    setupLinkHandlers() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;

            // التعامل مع الروابط
            this.handleLinkClick(e, link);
        });
    }

    handleLinkClick(e, link) {
        const href = link.getAttribute('href');
        
        // تجاهل الروابط الفارغة أو #
        if (!href || href === '#') {
            e.preventDefault();
            return;
        }

        // التعامل مع روابط القسم (#section)
        if (href.startsWith('#')) {
            e.preventDefault();
            this.scrollToSection(href);
            return;
        }

        // التحقق من الصفحات المحمية
        if (this.isProtectedPage(href)) {
            e.preventDefault();
            if (!this.isUserLoggedIn()) {
                this.showLoginPrompt();
                return;
            }
        }

        // التحقق من صحة الرابط
        if (!this.isValidLink(href)) {
            e.preventDefault();
            console.error(`رابط غير صالح: ${href}`);
            return;
        }

        // إضافة التتبع للتحليلات
        this.trackNavigation(href);
    }

    scrollToSection(sectionId) {
        const section = document.querySelector(sectionId);
        if (section) {
            section.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
            // تحديث URL
            window.history.pushState({}, '', sectionId);
        }
    }

    isProtectedPage(href) {
        const protectedPages = [
            'profile.html',
            'settings.html',
            'booking.html',
            'orders.html',
            'dashboard.html'
        ];
        return protectedPages.some(page => href.includes(page));
    }

    isUserLoggedIn() {
        return !!localStorage.getItem('userData');
    }

    showLoginPrompt() {
        const loginPromptModal = document.getElementById('loginPromptModal');
        if (loginPromptModal && typeof bootstrap !== 'undefined') {
            const modal = new bootstrap.Modal(loginPromptModal);
            modal.show();
        } else {
            console.error('Bootstrap or loginPromptModal is not defined.');
        }
    }

    isValidLink(href) {
        // التحقق من وجود الصفحة
        if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
            return true;
        }

        const availablePages = [
            'index.html',
            'about.html',
            'services.html',
            'workers.html',
            'contact.html',
            'login.html',
            'register.html',
            'profile.html',
            'settings.html',
            'booking.html',
            'orders.html',
            'privacy.html',
            'terms.html',
            'faq.html'
        ];

        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_path: href
            });
        } else {
            console.error('gtag is not defined.');
        }
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_path: href
            });
        }
    }

    validateAllLinks() {
        const allLinks = document.querySelectorAll('a');
        allLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href) {
                console.warn('تم العثور على رابط بدون href:', link);
                return;
            }

            // إضافة السمات المناسبة للروابط الخارجية
            if (href.startsWith('http') && !href.includes(window.location.hostname)) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            }

            // التحقق من صحة الروابط الداخلية
            if (!href.startsWith('http') && !href.startsWith('#') && 
                !href.startsWith('mailto:') && !href.startsWith('tel:')) {
                if (!this.isValidLink(href)) {
                    console.warn(`رابط غير صالح: ${href}`);
                }
            }
        });
    }

    // تحديث الروابط النشطة في القائمة
    updateActiveLinks() {
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash;

        document.querySelectorAll('a').forEach(link => {
            const href = link.getAttribute('href');
            
            // إزالة الحالة النشطة من جميع الروابط
            link.classList.remove('active');
            
            // إضافة الحالة النشطة للرابط الحالي
            if (href === currentPath || 
                (currentHash && href === currentHash) ||
                (href === 'index.html' && currentPath === '/') ||
                (currentPath.includes(href) && href !== '#' && href !== 'index.html')) {
                link.classList.add('active');
            }
        });
    }
}

// تهيئة معالج الروابط
document.addEventListener('DOMContentLoaded', () => {
    window.linkHandler = new LinkHandler();
    
    // تحديث الروابط النشطة عند تغيير الهاش
    window.addEventListener('hashchange', () => {
        window.linkHandler.updateActiveLinks();
    });
    
    // تحديث الروابط النشطة عند التنقل
    window.addEventListener('popstate', () => {
        window.linkHandler.updateActiveLinks();
    });
}); 