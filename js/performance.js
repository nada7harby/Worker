class PerformanceOptimizer {
    static init() {
        this.setupLazyLoading();
        this.setupImageOptimization();
        this.cacheStaticAssets();
    }

    static setupLazyLoading() {
        // تحميل الصور والمحتوى بشكل تدريجي
        const lazyImages = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    static setupImageOptimization() {
        // تحسين حجم وجودة الصور
        document.querySelectorAll('img').forEach(img => {
            if (!img.dataset.optimized) {
                this.optimizeImage(img);
            }
        });
    }

    static cacheStaticAssets() {
        // تخزين الملفات الثابتة
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js');
        }
    }
} 