document.addEventListener("DOMContentLoaded", function () {
  // التحقق من تسجيل الدخول
  // if (!checkAuthStatus()) return;

  // تحميل بيانات العامل
  loadWorkerDetails();

  // إضافة مستمعي الأحداث
  setupEventListeners();
});

// التحقق من حالة تسجيل الدخول
function checkAuthStatus() {
  const userData = localStorage.getItem("userData");
  /*
    if (!userData) {
        window.location.href = 'login.html';
        return false;
    }
         */
  return true;
}

// تحميل بيانات العامل
function loadWorkerDetails() {
  // استخراج معرف العامل من URL
  const urlParams = new URLSearchParams(window.location.search);
  const workerId = urlParams.get("worker");

  // if (!workerId) {
  //     window.location.href = 'workers.html';
  //     return;
  // }

  // محاولة استرجاع بيانات العامل من localStorage
  const workers = JSON.parse(localStorage.getItem("searchResults")) || [];
  const worker = workers.find((w) => w.id === parseInt(workerId));

  if (worker) {
    displayWorkerDetails(worker);
    calculateCosts(worker.salary);
  } else {
    //window.location.href = 'workers.html';
  }
}

// عرض بيانات العامل
function displayWorkerDetails(worker) {
  document.getElementById("workerImage").src = worker.image;
  document.getElementById("workerImage").alt = worker.name;
  document.getElementById("workerName").textContent = worker.name;
  document.getElementById("workerNationality").textContent = worker.nationality;
  document.getElementById("workerExperience").textContent = worker.experience;
  document.getElementById("workerSalary").textContent = worker.salary;
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
  // نموذج الحجز
  const bookingForm = document.getElementById("bookingForm");
  if (bookingForm) {
    bookingForm.addEventListener("submit", handleBooking);
  }

  // مدة العقد
  const contractDuration = document.querySelector('select[name="duration"]');
  if (contractDuration) {
    contractDuration.addEventListener("change", updateCosts);
  }
}

// حساب التكاليف
function calculateCosts(salary) {
  const monthlySalary = parseInt(salary);
  const serviceFee = 500;
  const insurance = 200;
  const total = monthlySalary + serviceFee + insurance;

  document.getElementById(
    "monthlySalary"
  ).textContent = `${monthlySalary} ريال`;
  document.getElementById("totalCost").textContent = `${total} ريال`;

  return total;
}

// تحديث التكاليف عند تغيير مدة العقد
function updateCosts(e) {
  const duration = parseInt(e.target.value);
  const monthlySalary = parseInt(
    document.getElementById("monthlySalary").textContent
  );
  const total = calculateCosts(monthlySalary) * duration;

  document.getElementById("totalCost").textContent = `${total} ريال`;
}

// معالجة الحجز
async function handleBooking(e) {
  e.preventDefault();

  try {
    const formData = new FormData(e.target);
    const bookingData = {
      startDate: formData.get("startDate"),
      duration: formData.get("duration"),
      clientName: formData.get("clientName"),
      clientId: formData.get("clientId"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      address: formData.get("address"),
    };

    // في الواقع، سيتم إرسال البيانات إلى الخادم
    console.log("بيانات الحجز:", bookingData);

    // تخزين بيانات الحجز مؤقتاً
    localStorage.setItem("currentBooking", JSON.stringify(bookingData));

    // الانتقال إلى صفحة الدفع
    window.location.href = "payment.html";
  } catch (error) {
    console.error("خطأ في عملية الحجز:", error);
    showAlert("danger", "حدث خطأ أثناء إتمام الحجز. يرجى المحاولة مرة أخرى.");
  }
}

// عرض رسالة تنبيه
function showAlert(type, message) {
  const alertDiv = document.createElement("div");
  alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
  alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

  document.querySelector(".booking-form").prepend(alertDiv);

  setTimeout(() => alertDiv.remove(), 3000);
}
