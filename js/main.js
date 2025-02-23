// التحقق من تحميل المستند
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة جميع المكونات
    initializeComponents();
    
    // إضافة مستمعي الأحداث
    setupEventListeners();
});

// تهيئة المكونات
function initializeComponents() {
    // تفعيل التمرير السلس للروابط
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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

    // تفعيل زر العودة للأعلى
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('active');
            } else {
                backToTop.classList.remove('active');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // تفعيل تأثيرات التمرير للنافبار
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // تفعيل القائمة المتحركة في الموبايل
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', () => {
            navbarCollapse.classList.toggle('show');
        });

        // إغلاق القائمة عند النقر على أي رابط
        document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navbarCollapse.classList.remove('show');
            });
        });
    }
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // تفعيل الروابط النشطة في النافبار
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.navbar-nav .nav-link[href="#${sectionId}"]`);
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink?.classList.add('active');
            } else {
                navLink?.classList.remove('active');
            }
        });
    });

    // تفعيل نموذج البحث
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    }

    // تفعيل الحركات عند التمرير
    window.addEventListener('scroll', revealOnScroll);
}

// معالجة البحث
async function handleSearch(e) {
    e.preventDefault();
    const serviceType = e.target.querySelector('select:first-child').value;
    const nationality = e.target.querySelector('select:last-child').value;
    
    if (serviceType === 'نوع الخدمة' || nationality === 'الجنسية') {
        showAlert('الرجاء اختيار نوع الخدمة والجنسية');
        return;
    }

    try {
        // محاكاة جلب البيانات من الخادم
        const workers = await getDummyWorkers(serviceType, nationality);
        
        // تخزين نتائج البحث في localStorage
        localStorage.setItem('searchResults', JSON.stringify(workers));
        localStorage.setItem('searchParams', JSON.stringify({ serviceType, nationality }));
        
        // الانتقال إلى صفحة النتائج
        window.location.href = 'workers.html';
    } catch (error) {
        console.error('خطأ في البحث:', error);
        showAlert('حدث خطأ أثناء البحث، يرجى المحاولة مرة أخرى');
    }
}

// دالة لمحاكاة جلب بيانات العمالة
function getDummyWorkers(serviceType, nationality) {
    return new Promise((resolve) => {
        // بيانات تجريبية للعمالة
        const dummyWorkers = [
            {
                id: 1,
                name: "أحمد محمد",
                nationality: "مصري",
                profession: "سائق خاص",
                experience: "5 سنوات",
                age: 35,
                status: "متاح",
                rating: 4.8,
                reviews: 24,
                salary: "2500 ريال",
                image: "images/worker1.jpg",
                languages: ["العربية", "الإنجليزية"],
                skills: ["رخصة قيادة دولية", "خبرة في الطرق السريعة", "صيانة السيارات"]
            },
            {
                id: 2,
                name: "ماري جون",
                nationality: "فلبينية",
                profession: "عاملة منزلية",
                experience: "3 سنوات",
                age: 28,
                status: "متاح",
                rating: 4.9,
                reviews: 18,
                salary: "2000 ريال",
                image: "images/worker2.jpg",
                languages: ["الإنجليزية", "العربية البسيطة"],
                skills: ["تنظيف", "طبخ", "رعاية أطفال"]
            },
            // يمكن إضافة المزيد من العمال هنا
        ];

        // فلترة النتائج حسب نوع الخدمة والجنسية
        const filteredWorkers = dummyWorkers.filter(worker => 
            (serviceType === 'الكل' || worker.profession === serviceType) &&
            (nationality === 'الكل' || worker.nationality === nationality)
        );

        // محاكاة تأخير الشبكة
        setTimeout(() => {
            resolve(filteredWorkers);
        }, 500);
    });
}

// إظهار العناصر عند التمرير
function revealOnScroll() {
    const elements = document.querySelectorAll('.service-card, .feature-card, .step');
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

// عرض تنبيه
function showAlert(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-warning alert-dismissible fade show';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.querySelector('.hero-search').prepend(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// تحريك الصور والأيقونات
function animateElements() {
    const elements = document.querySelectorAll('.service-icon, .feature-icon, .step-number');
    elements.forEach(element => {
        element.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.1) rotate(10deg)';
        });
        
        element.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1) rotate(0)';
        });
    });
}

// تفعيل الحركات عند تحميل الصفحة
window.addEventListener('load', () => {
    animateElements();
    
    // إضافة تأثيرات ظهور تدريجي للعناصر
    document.querySelectorAll('[data-aos]').forEach(element => {
        element.classList.add('aos-animate');
    });
});

// تحسين الأداء عند التمرير
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }
    
    scrollTimeout = window.requestAnimationFrame(() => {
        revealOnScroll();
    });
});

// إضافة إلى الملف الحالي
async function loadHeader() {
    try {
        const response = await fetch('components/header.html');
        const html = await response.text();
        document.body.insertAdjacentHTML('afterbegin', html);
        
        // تهيئة الهيدر
        new Header();
    } catch (error) {
        console.error('Error loading header:', error);
    }
}

// تحميل الهيدر في كل الصفحات
document.addEventListener('DOMContentLoaded', loadHeader); 