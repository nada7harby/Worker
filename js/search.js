class SearchSystem {
    constructor() {
        this.searchForm = document.getElementById('searchForm');
        this.filterForm = document.getElementById('filterForm');
        this.resultsContainer = document.getElementById('searchResults');
        this.init();
    }

    init() {
        this.setupSearchForm();
        this.setupFilters();
        this.setupSorting();
    }

    setupSearchForm() {
        this.searchForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            
            // تحديث URL مع معايير البحث
            const searchParams = new URLSearchParams(window.location.search);
            for (let [key, value] of formData.entries()) {
                if (value) {
                    searchParams.set(key, value);
                } else {
                    searchParams.delete(key);
                }
            }
            
            // تحديث URL وتنفيذ البحث
            window.history.pushState({}, '', `${window.location.pathname}?${searchParams.toString()}`);
            this.performSearch(Object.fromEntries(formData));
        });

        // تحميل معايير البحث من URL عند تحميل الصفحة
        const urlParams = new URLSearchParams(window.location.search);
        for (let [key, value] of urlParams.entries()) {
            const input = this.searchForm.querySelector(`[name="${key}"]`);
            if (input) {
                input.value = value;
            }
        }
    }

    setupFilters() {
        const filters = document.querySelectorAll('.filter-input');
        filters.forEach(filter => {
            filter.addEventListener('change', () => {
                const formData = new FormData(this.filterForm);
                const filterParams = Object.fromEntries(formData);
                
                // تحديث URL مع الفلاتر
                const searchParams = new URLSearchParams(window.location.search);
                for (let [key, value] of Object.entries(filterParams)) {
                    if (value) {
                        searchParams.set(key, value);
                    } else {
                        searchParams.delete(key);
                    }
                }
                
                window.history.pushState({}, '', `${window.location.pathname}?${searchParams.toString()}`);
                this.applyFilters(filterParams);
            });
        });

        // تحميل الفلاتر من URL
        const urlParams = new URLSearchParams(window.location.search);
        for (let [key, value] of urlParams.entries()) {
            const filter = this.filterForm?.querySelector(`[name="${key}"]`);
            if (filter) {
                filter.value = value;
            }
        }
    }

    setupSorting() {
        const sortSelect = document.getElementById('sortSelect');
        sortSelect?.addEventListener('change', (e) => {
            this.sortResults(e.target.value);
        });
    }

    async performSearch(params) {
        try {
            // في الواقع، سيتم إرسال طلب للخادم
            const workers = await this.fetchWorkers(params);
            this.displayResults(workers);
            this.updateURL(params);
        } catch (error) {
            console.error('خطأ في البحث:', error);
            this.showError('حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.');
        }
    }

    async fetchWorkers(params) {
        // محاكاة طلب الخادم
        const response = await fetch('data/workers.json');
        let workers = await response.json();
        
        // تطبيق الفلترة
        workers = workers.filter(worker => {
            return (!params.keyword || worker.name.includes(params.keyword)) &&
                   (!params.category || worker.category === params.category) &&
                   (!params.location || worker.location === params.location);
        });

        return workers;
    }

    displayResults(workers) {
        if (!this.resultsContainer) return;

        if (workers.length === 0) {
            this.resultsContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search fa-3x mb-3"></i>
                    <h3>لم يتم العثور على نتائج</h3>
                    <p>حاول تغيير معايير البحث</p>
                </div>
            `;
            return;
        }

        this.resultsContainer.innerHTML = workers.map(worker => `
            <div class="worker-card" data-aos="fade-up">
                <div class="worker-image">
                    <img src="${worker.image}" alt="${worker.name}">
                    <span class="worker-status ${worker.availability ? 'available' : 'unavailable'}">
                        ${worker.availability ? 'متاح' : 'غير متاح'}
                    </span>
                </div>
                <div class="worker-info">
                    <h3>${worker.name}</h3>
                    <div class="worker-meta">
                        <span><i class="fas fa-flag"></i> ${worker.nationality}</span>
                        <span><i class="fas fa-briefcase"></i> ${worker.experience} سنوات</span>
                    </div>
                    <div class="worker-rating">
                        ${this.generateRatingStars(worker.rating)}
                        <span class="rating-number">${worker.rating}</span>
                    </div>
                    <button class="btn btn-primary w-100" onclick="viewWorker(${worker.id})">
                        عرض التفاصيل
                    </button>
                </div>
            </div>
        `).join('');
    }

    generateRatingStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let stars = '';
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        
        return stars;
    }

    updateURL(params) {
        const url = new URL(window.location);
        Object.entries(params).forEach(([key, value]) => {
            if (value) {
                url.searchParams.set(key, value);
            } else {
                url.searchParams.delete(key);
            }
        });
        window.history.pushState({}, '', url);
    }

    showError(message) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-danger alert-dismissible fade show';
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        this.searchForm.prepend(alert);
    }
}

// تهيئة نظام البحث
new SearchSystem(); 