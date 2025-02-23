document.addEventListener('DOMContentLoaded', function() {
    // استخراج معرف العامل من URL
    const urlParams = new URLSearchParams(window.location.search);
    const workerId = urlParams.get('id');
    
    if (workerId) {
        loadWorkerDetails(workerId);
    } else {
      //  window.location.href = 'index.html';
    }
});

async function loadWorkerDetails(workerId) {
    try {
        const workersData = await getWorkersData();
        const worker = workersData.workers.find(w => w.id === parseInt(workerId));
        
        if (worker) {
            displayWorkerDetails(worker);
            loadDummyReviews();
        } else {
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('خطأ في تحميل البيانات:', error);
    }
}

function displayWorkerDetails(worker) {
    // الصورة والمعلومات الأساسية
    document.getElementById('workerImage').src = `images/${worker.image}`;
    document.getElementById('workerImage').alt = worker.name;
    document.getElementById('workerName').textContent = worker.name;
    document.getElementById('workerNationality').textContent = worker.nationality;
    document.getElementById('workerAge').textContent = worker.age;
    document.getElementById('workerExperience').textContent = worker.experience;
    document.getElementById('workerSalary').textContent = worker.salary;
    
    // حالة التوفر
    const availabilityBadge = document.getElementById('availabilityBadge');
    availabilityBadge.textContent = worker.availability ? 'متاح' : 'غير متاح';
    availabilityBadge.className = `availability-badge ${worker.availability ? 'available' : 'unavailable'}`;
    
    // التقييم
    document.getElementById('workerRating').innerHTML = getStarRating(worker.rating);
    
    // المهارات
    const skillsContainer = document.getElementById('workerSkills');
    skillsContainer.innerHTML = worker.skills.map(skill => 
        `<span class="skill-badge">${skill}</span>`
    ).join('');
    
    // اللغات
    const languagesContainer = document.getElementById('workerLanguages');
    languagesContainer.innerHTML = worker.languages.map(language => 
        `<div class="language-item">
            <i class="fas fa-language"></i>
            <span>${language}</span>
        </div>`
    ).join('');
}

function loadDummyReviews() {
    const reviews = [
        {
            name: "محمد أحمد",
            date: "2024-02-15",
            rating: 5,
            text: "خدمة ممتازة وأداء احترافي"
        },
        {
            name: "سارة محمد",
            date: "2024-02-10",
            rating: 4.5,
            text: "تجربة جيدة جداً، أنصح بالتعامل معه"
        }
    ];
    
    const reviewsContainer = document.getElementById('reviewsContainer');
    reviewsContainer.innerHTML = reviews.map(review => `
        <div class="review-item">
            <div class="review-header">
                <span class="reviewer-name">${review.name}</span>
                <span class="review-date">${formatDate(review.date)}</span>
            </div>
            <div class="review-rating">
                ${getStarRating(review.rating)}
            </div>
            <p class="review-text">${review.text}</p>
        </div>
    `).join('');
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ar-SA', options);
}

// نموذج الطلب
document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // هنا يمكن إضافة منطق معالجة الطلب
    alert('تم استلام طلبك بنجاح! سنتواصل معك قريباً.');
    this.reset();
});

// إعادة استخدام الدوال المساعدة من الملفات السابقة
function getStarRating(rating) {
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

async function getWorkersData() {
    const cachedData = localStorage.getItem('workersData');
    if (cachedData) {
        return JSON.parse(cachedData);
    }
    
    const response = await fetch('../data/workers.json');
    const data = await response.json();
    localStorage.setItem('workersData', JSON.stringify(data));
    return data;
} 