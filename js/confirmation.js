document.addEventListener('DOMContentLoaded', function() {
    // التحقق من حالة الدفع
    //if (!checkPaymentStatus()) return;
    
    // تحميل وعرض تفاصيل الطلب
    loadOrderDetails();
    
    // إضافة مستمعي الأحداث
    setupEventListeners();
    
    // إرسال بريد التأكيد
    sendConfirmationEmail();
});

// التحقق من حالة الدفع
function checkPaymentStatus() {
    const paymentStatus = localStorage.getItem('paymentStatus');
    // if (paymentStatus !== 'success') {
    //     window.location.href = 'payment.html';
    //     return false;
    // }
    return true;
}

// تحميل تفاصيل الطلب
function loadOrderDetails() {
    const bookingData = JSON.parse(localStorage.getItem('currentBooking'));
    const workerData = JSON.parse(localStorage.getItem('selectedWorker'));
    
    // if (!bookingData || !workerData) {
    //     window.location.href = 'index.html';
    //     return;
    // }
    
    // إنشاء وعرض رقم الطلب
    const orderNumber = generateOrderNumber();
    document.getElementById('orderNumber').textContent = orderNumber;
    
    // عرض تاريخ الطلب
    document.getElementById('orderDate').textContent = formatDate(new Date());
    
    // عرض بيانات العامل
    document.getElementById('workerName').textContent = workerData.name;
    
    // عرض تفاصيل العقد
    document.getElementById('contractDuration').textContent = `${bookingData.duration} أشهر`;
    document.getElementById('startDate').textContent = formatDate(bookingData.startDate);
    
    // عرض المبلغ المدفوع
    const totalAmount = calculateTotalAmount(workerData.salary, bookingData.duration);
    document.getElementById('paidAmount').textContent = `${totalAmount} ريال`;
    
    // تخزين بيانات الطلب في localStorage
    saveOrderDetails(orderNumber, totalAmount);
}

// إنشاء رقم طلب عشوائي
function generateOrderNumber() {
    const prefix = 'ORD';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
}

// تنسيق التاريخ
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('ar-SA', options);
}

// حساب المبلغ الإجمالي
function calculateTotalAmount(salary, duration) {
    const monthlySalary = parseInt(salary);
    const months = parseInt(duration);
    const serviceFee = 500;
    const insurance = 200;
    
    return (monthlySalary + serviceFee + insurance) * months;
}

// حفظ بيانات الطلب
function saveOrderDetails(orderNumber, totalAmount) {
    const orderDetails = {
        orderNumber,
        orderDate: new Date(),
        totalAmount,
        bookingData: JSON.parse(localStorage.getItem('currentBooking')),
        workerData: JSON.parse(localStorage.getItem('selectedWorker'))
    };
    
    // حفظ في localStorage
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(orderDetails);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // مسح بيانات الحجز المؤقتة
    localStorage.removeItem('currentBooking');
    localStorage.removeItem('selectedWorker');
    localStorage.removeItem('paymentStatus');
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // زر الطباعة
    const printButton = document.querySelector('.btn-outline-primary');
    if (printButton) {
        printButton.addEventListener('click', printConfirmation);
    }
    
    // تأثيرات التحويم على الخطوات
    const stepItems = document.querySelectorAll('.step-item');
    stepItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(-10px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
}

// طباعة صفحة التأكيد
function printConfirmation() {
    window.print();
}

// إرسال بريد التأكيد (محاكاة)
function sendConfirmationEmail() {
    console.log('تم إرسال بريد التأكيد');
    
    // إظهار رسالة نجاح
    showAlert('success', 'تم إرسال تفاصيل الطلب إلى بريدك الإلكتروني');
}

// عرض رسالة تنبيه
function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.querySelector('.confirmation-card').prepend(alertDiv);
    
    setTimeout(() => alertDiv.remove(), 5000);
}

// تحديث حالة الخطوات
function updateStepStatus(step, status) {
    const stepElement = document.querySelector(`.step-item:nth-child(${step})`);
    if (stepElement) {
        stepElement.classList.add(status);
        
        if (status === 'completed') {
            const icon = stepElement.querySelector('.step-number');
            icon.innerHTML = '<i class="fas fa-check"></i>';
        }
    }
} 

// دالة لملء تفاصيل الطلب
function fillOrderDetails() {
    // بيانات الطلب (يمكن استبدالها ببيانات حقيقية من الخادم)
    const orderDetails = {
      orderNumber: "123456",
      orderDate: "2023-10-10",
      workerName: "علي أحمد",
      contractDuration: "6 أشهر",
      startDate: "2023-10-15",
      paidAmount: "5000 ريال",
    };
  
    // تعيين القيم في العناصر المناسبة
    document.getElementById("orderNumber").textContent = orderDetails.orderNumber;
    document.getElementById("orderDate").textContent = orderDetails.orderDate;
    document.getElementById("workerName").textContent = orderDetails.workerName;
    document.getElementById("contractDuration").textContent =
      orderDetails.contractDuration;
    document.getElementById("startDate").textContent = orderDetails.startDate;
    document.getElementById("paidAmount").textContent = orderDetails.paidAmount;
  }
  
  // دالة لطباعة التأكيد
  function printConfirmation() {
    window.print();
  }
  
  // عند تحميل الصفحة، يتم ملء تفاصيل الطلب تلقائيًا
  window.onload = function () {
    fillOrderDetails();
  };