document.addEventListener('DOMContentLoaded', function() {
    // التحقق من تسجيل الدخول وبيانات الحجز
    if (!checkAuthAndBooking()) return;
    
    // تحميل بيانات الطلب
    loadOrderDetails();
    
    // إضافة مستمعي الأحداث
    setupEventListeners();
    
    // تهيئة التحقق من البطاقة
    initializeCardValidation();
});

// التحقق من تسجيل الدخول وبيانات الحجز
function checkAuthAndBooking() {
    const userData = localStorage.getItem('userData');
    const bookingData = localStorage.getItem('currentBooking');
    
    if (!userData || !bookingData) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// تحميل تفاصيل الطلب
function loadOrderDetails() {
    const bookingData = JSON.parse(localStorage.getItem('currentBooking'));
    const workerData = JSON.parse(localStorage.getItem('selectedWorker'));
    
    // عرض بيانات العامل
    document.getElementById('workerName').textContent = workerData.name;
    
    // عرض تفاصيل العقد
    document.getElementById('contractDuration').textContent = `${bookingData.duration} أشهر`;
    document.getElementById('startDate').textContent = formatDate(bookingData.startDate);
    
    // حساب وعرض المبلغ الإجمالي
    const totalAmount = calculateTotalAmount(workerData.salary, bookingData.duration);
    document.getElementById('totalAmount').textContent = `${totalAmount} ريال`;
    document.getElementById('paymentAmount').textContent = `${totalAmount} ريال`;
}

// تنسيق التاريخ
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ar-SA', options);
}

// حساب المبلغ الإجمالي
function calculateTotalAmount(salary, duration) {
    const monthlySalary = parseInt(salary);
    const months = parseInt(duration);
    const serviceFee = 500;
    const insurance = 200;
    
    return (monthlySalary + serviceFee + insurance) * months;
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // اختيار طريقة الدفع
    const methodCards = document.querySelectorAll('.method-card');
    methodCards.forEach(card => {
        card.addEventListener('click', () => {
            methodCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            toggleCardForm(card.querySelector('span').textContent);
        });
    });
    
    // نموذج الدفع
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', handlePayment);
    }
}

// تبديل نموذج البطاقة
function toggleCardForm(method) {
    const cardForm = document.querySelector('.card-details');
    if (method === 'تحويل بنكي') {
        cardForm.innerHTML = `
            <div class="bank-details">
                <h6>تفاصيل الحساب البنكي</h6>
                <div class="bank-info">
                    <p><strong>اسم البنك:</strong> البنك الأهلي السعودي</p>
                    <p><strong>اسم الحساب:</strong> شركة خدمات العمالة</p>
                    <p><strong>رقم الحساب (IBAN):</strong> SA0380000000608010167519</p>
                </div>
                <div class="mt-4">
                    <label class="form-label">رقم الحوالة</label>
                    <input type="text" class="form-control" required>
                </div>
                <div class="mt-3">
                    <label class="form-label">صورة الحوالة</label>
                    <input type="file" class="form-control" accept="image/*" required>
                </div>
                <button type="submit" class="btn btn-primary w-100 mt-4">
                    <i class="fas fa-check"></i> تأكيد التحويل
                </button>
            </div>
        `;
    }
}

// التحقق من بيانات البطاقة
function initializeCardValidation() {
    const cardNumber = document.querySelector('input[placeholder="0000 0000 0000 0000"]');
    if (cardNumber) {
        cardNumber.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{4})/g, '$1 ').trim();
            e.target.value = value;
        });
    }
    
    const expiry = document.querySelector('input[placeholder="MM/YY"]');
    if (expiry) {
        expiry.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0,2) + '/' + value.slice(2,4);
            }
            e.target.value = value;
        });
    }
    
    const cvv = document.querySelector('input[placeholder="123"]');
    if (cvv) {
        cvv.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0,3);
        });
    }
}

// معالجة الدفع
async function handlePayment(e) {
    e.preventDefault();
    
    try {
        const formData = new FormData(e.target);
        const paymentMethod = document.querySelector('.method-card.active span').textContent;
        
        // في الواقع، سيتم إرسال البيانات إلى الخادم
        console.log('بيانات الدفع:', {
            method: paymentMethod,
            formData: Object.fromEntries(formData)
        });
        
        // تخزين حالة الدفع مؤقتاً
        localStorage.setItem('paymentStatus', 'success');
        
        // الانتقال إلى صفحة التأكيد
        window.location.href = 'confirmation.html';
        
    } catch (error) {
        console.error('خطأ في عملية الدفع:', error);
        showAlert('danger', 'حدث خطأ أثناء معالجة الدفع. يرجى المحاولة مرة أخرى.');
    }
}

// عرض رسالة تنبيه
function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.querySelector('.payment-card').prepend(alertDiv);
    
    setTimeout(() => alertDiv.remove(), 3000);
} 