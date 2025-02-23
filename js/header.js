class Header {
    constructor() {
        this.header = document.querySelector('.main-header');
        this.init();
    }

    init() {
        this.handleScroll();
        this.setupActiveLinks();
        this.loadUserData();
        this.setupNotifications();
    }

    handleScroll() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
        });
    }

    setupActiveLinks() {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const currentHash = window.location.hash;

        document.querySelectorAll('.nav-link').forEach(link => {
            const href = link.getAttribute('href');
            
            // التحقق من المسار الحالي والهاش
            if (href === currentPath || 
                (currentHash && href === currentHash) || 
                (href.includes('#') && currentPath + href.substring(href.indexOf('#')) === currentPath + currentHash)) {
                link.classList.add('active');
            }
            
            // إضافة مستمع الأحداث للروابط
            link.addEventListener('click', (e) => {
                if (!this.isLoggedIn() && this.isProtectedRoute(href)) {
                    e.preventDefault();
                    this.showLoginPrompt();
                    return;
                }

                // التمرير السلس للأقسام
                if (href.includes('#') && href !== '#') {
                    e.preventDefault();
                    const targetId = href.substring(href.indexOf('#'));
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                        window.history.pushState({}, '', href);
                    }
                }
            });
        });
    }

    loadUserData() {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData) {
            document.querySelector('.user-name').textContent = userData.name;
            if (userData.avatar) {
                document.querySelector('.user-avatar').src = userData.avatar;
            }
        } else {
            this.showLoginButtons();
        }
    }

    showLoginButtons() {
        const navButtons = document.querySelector('.nav-buttons');
        navButtons.innerHTML = `
            <a href="login.html" class="btn btn-outline-primary">تسجيل الدخول</a>
            <a href="register.html" class="btn btn-primary">إنشاء حساب</a>
        `;
    }

    setupNotifications() {
        const notifSystem = new NotificationSystem();
        notifSystem.loadNotifications();
    }

    isLoggedIn() {
        return !!localStorage.getItem('userData');
    }

    isProtectedRoute(route) {
        const protectedRoutes = ['profile.html', 'settings.html', 'booking.html'];
        return protectedRoutes.includes(route);
    }

    showLoginPrompt() {
        const modal = new bootstrap.Modal(document.getElementById('loginPromptModal'));
        modal.show();
    }
}

// تهيئة الهيدر
document.addEventListener('DOMContentLoaded', () => {
    new Header();
}); 