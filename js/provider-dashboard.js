document.addEventListener("DOMContentLoaded", function () {
  // التحقق من حالة تسجيل الدخول
  // if (!checkAuthStatus()) return;

  // تهيئة البيانات
  async function loadDashboardData() {
    try {
      // تحميل البيانات من localStorage أو من الخادم
      const userData = JSON.parse(localStorage.getItem("userData"));

      // تحديث اسم المستخدم
      const userNameElement = document.querySelector(".user-name");
      if (userNameElement && userData) {
        userNameElement.textContent =
          userData.firstName + " " + userData.lastName;
      }

      // تحديث الإحصائيات
      updateStats();
    } catch (error) {
      console.error("خطأ في تحميل البيانات:", error);
    }
  }
  loadDashboardData();

  // إضافة مستمعي الأحداث
  setupEventListeners();

  // تحميل العمالة
  loadWorkers();

  // تحميل النشاطات الأخيرة
  loadRecentActivities();

  // تهيئة الرسوم البيانية
  initializeCharts();

  // تحميل بيانات أفضل العمال
  loadTopWorkers();

  // إضافة مستمعي الأحداث لنماذج الإعدادات
  setupSettingsForms();
});

// تهيئة مستمعي الأحداث
function setupEventListeners() {
  // فلاتر العمالة
  const filters = document.querySelectorAll(".form-select");
  filters.forEach((filter) => {
    filter.addEventListener("change", applyFilters);
  });

  // نموذج إضافة عامل جديد
  const addWorkerForm = document.getElementById("addWorkerForm");
  if (addWorkerForm) {
    addWorkerForm.addEventListener("submit", handleAddWorker);
  }
}

// تحميل بيانات العمالة
async function loadWorkers() {
  try {
    // جلب البيانات من ملف workers.json
    const response = await fetch("./workers.json");

    // التحقق من نجاح الطلب
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // تحويل البيانات إلى JSON
    const workers = await response.json();
    console.log("تم تحميل العمال بنجاح:", workers); // رسالة تصحيح

    // عرض العمالة في الواجهة
    displayWorkers(workers);
  } catch (error) {
    // console.error("خطأ في تحميل بيانات العمالة:", error);
    // showAlert("danger", "حدث خطأ أثناء تحميل بيانات العمالة");
  }
}
// عرض بيانات العمالة
function displayWorkers(workers) {
  const workersGrid = document.getElementById("workersGrid");
  if (!workersGrid) return;

  // إنشاء HTML لعرض كل عامل
  workersGrid.innerHTML = workers
    .map(
      (worker) => `
        <div class="col-md-4">
            <div class="worker-card">
                <div class="position-relative">
                    <img src="images/${
                      worker.image
                    }" class="worker-image" alt="${worker.name}">
                    <span class="worker-status ${
                      worker.status === "متاح" ? "available" : "busy"
                    }">
                        ${worker.status}
                    </span>
                </div>
                <div class="worker-info">
                    <h5>${worker.name}</h5>
                    <div class="worker-meta-info">
                        <span><i class="fas fa-flag"></i> ${
                          worker.nationality
                        }</span>
                        <span><i class="fas fa-briefcase"></i> ${
                          worker.profession
                        }</span>
                        <span><i class="fas fa-star"></i> ${
                          worker.rating
                        }</span>
                    </div>
                    <div class="worker-actions">
                        <button class="btn btn-sm btn-primary" onclick="viewWorkerDetails(${
                          worker.id
                        })">
                            <i class="fas fa-eye"></i> عرض
                        </button>
                        <button class="btn btn-sm btn-warning" onclick="editWorker(${
                          worker.id
                        })">
                            <i class="fas fa-edit"></i> تعديل
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteWorker(${
                          worker.id
                        })">
                            <i class="fas fa-trash"></i> حذف
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `
    )
    .join(""); // تحويل المصفوفة إلى سلسلة نصية
}
// تطبيق الفلاتر
function applyFilters() {
  const nationality = document.getElementById("nationalityFilter").value;
  const profession = document.getElementById("professionFilter").value;
  const status = document.getElementById("statusFilter").value;
  const experience = document.getElementById("experienceFilter").value;

  // في الواقع، سيتم إرسال هذه الفلاتر إلى الخادم
  console.log("تطبيق الفلاتر:", {
    nationality,
    profession,
    status,
    experience,
  });
  loadWorkers(); // إعادة تحميل البيانات مع الفلاتر
}

async function handleAddWorker(e) {
  e.preventDefault(); // منع إعادة تحميل الصفحة

  try {
    const formData = new FormData(e.target); // جمع البيانات من النموذج

    // تحويل FormData إلى كائن JSON (اختياري)
    const workerData = {};
    formData.forEach((value, key) => {
      workerData[key] = value;
    });

    // في الواقع، سيتم إرسال البيانات إلى الخادم
    console.log("إضافة عامل جديد:", workerData);

    // إغلاق المودال بعد الإضافة
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("addWorkerModal")
    );
    modal.hide();

    // إعادة تحميل قائمة العمالة
    loadWorkers();

    // إضافة نشاط جديد إلى "آخر النشاطات"
    const newActivity = {
      activity: "تسجيل عامل جديد",
      details: `تم تسجيل العامل: ${workerData.fullName}`, // استخدم الاسم الكامل للعامل
      date: new Date().toISOString().split("T")[0], // تاريخ اليوم
      status: "مكتمل",
    };

    // إضافة النشاط إلى قائمة "آخر النشاطات"
    addRecentActivity(newActivity);

    // عرض رسالة نجاح
    showAlert("success", "تم إضافة العامل بنجاح");
  } catch (error) {
    console.error("خطأ في إضافة العامل:", error);
    showAlert("danger", "حدث خطأ أثناء إضافة العامل");
  }
}
// عرض تفاصيل العامل
function viewWorkerDetails(workerId) {
  // في الواقع، سيتم توجيه المستخدم إلى صفحة تفاصيل العامل
  window.location.href = `worker-details.html?id=${workerId}`;
}

// تعديل بيانات العامل
function editWorker(workerId) {
  // في الواقع، سيتم فتح نموذج التعديل مع بيانات العامل
  console.log("تعديل العامل:", workerId);
}

// حذف العامل
function deleteWorker(workerId) {
  if (confirm("هل أنت متأكد من حذف هذا العامل؟")) {
    // في الواقع، سيتم إرسال طلب حذف إلى الخادم
    console.log("حذف العامل:", workerId);
    loadWorkers(); // إعادة تحميل البيانات
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

  document.querySelector(".dashboard-content").prepend(alertDiv);

  // إخفاء التنبيه تلقائياً بعد 3 ثواني
  setTimeout(() => alertDiv.remove(), 3000);
}

// التحقق من حالة تسجيل الدخول
function checkAuthStatus() {
  const userData = localStorage.getItem("userData");
  if (!userData) {
    window.location.href = "login.html";
    return false;
  }
  return true;
}

// تحميل بيانات الطلبات
async function loadRequests(filter = "all") {
  try {
    // بيانات وهمية للاختبار
    const dummyRequests = [
      {
        id: "REQ001",
        client: "عبدالله محمد",
        serviceType: "سائق خاص",
        worker: "أحمد محمد",
        date: "2024-03-15",
        status: "pending",
        clientPhone: "0501234567",
        clientAddress: "الرياض - حي النخيل",
        startDate: "2024-03-20",
        duration: "شهر واحد",
      },
      {
        id: "REQ002",
        client: "سارة أحمد",
        serviceType: "عاملة منزلية",
        worker: "ماري جون",
        date: "2024-03-14",
        status: "processing",
        clientPhone: "0507654321",
        clientAddress: "الرياض - حي الورود",
        startDate: "2024-03-25",
        duration: "سنتين",
      },
    ];

    // تطبيق الفلتر
    const filteredRequests =
      filter === "all"
        ? dummyRequests
        : dummyRequests.filter((req) => req.status === filter);

    displayRequests(filteredRequests);
  } catch (error) {
    console.error("خطأ في تحميل الطلبات:", error);
    showAlert("danger", "حدث خطأ أثناء تحميل الطلبات");
  }
}
// عرض الطلبات في الجدول
function displayRequests(requests) {
  const tbody = document.getElementById("requestsTableBody");
  if (!tbody) return;

  tbody.innerHTML = requests
    .map(
      (request) => `
        <tr>
            <td>${request.id}</td>
            <td>${request.client}</td>
            <td>${request.serviceType}</td>
            <td>${request.worker}</td>
            <td>${formatDate(request.date)}</td>
            <td>
                <span class="badge bg-${getStatusBadgeClass(request.status)}">
                    ${getStatusInArabic(request.status)}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewRequestDetails('${
                  request.id
                }')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-warning" onclick="assignWorker('${
                  request.id
                }')">
                    <i class="fas fa-user-plus"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="cancelRequest('${
                  request.id
                }')">
                    <i class="fas fa-times"></i>
                </button>
            </td>
        </tr>
    `
    )
    .join("");
}

// عرض تفاصيل الطلب
function viewRequestDetails(requestId) {
  // في الواقع، سيتم جلب تفاصيل الطلب من الخادم
  const request = {
    id: requestId,
    client: "عبدالله محمد",
    clientPhone: "0501234567",
    clientAddress: "الرياض - حي النخيل",
    serviceType: "سائق خاص",
    startDate: "2024-03-20",
    duration: "شهر واحد",
    status: "pending",
  };

  // ملء بيانات المودال
  document.getElementById("requestNumber").textContent = request.id;
  document.getElementById("clientName").textContent = request.client;
  document.getElementById("clientPhone").textContent = request.clientPhone;
  document.getElementById("clientAddress").textContent = request.clientAddress;
  document.getElementById("serviceType").textContent = request.serviceType;
  document.getElementById("startDate").textContent = formatDate(
    request.startDate
  );
  document.getElementById("duration").textContent = request.duration;
  document.getElementById("statusUpdate").value = request.status;

  // عرض المودال
  const modal = new bootstrap.Modal(
    document.getElementById("requestDetailsModal")
  );
  modal.show();
}

// تحديث حالة الطلب
async function updateRequestStatus() {
  const requestId = document.getElementById("requestNumber").textContent;
  const newStatus = document.getElementById("statusUpdate").value;
  const note = document.getElementById("requestNote").value;

  try {
    // في الواقع، سيتم إرسال التحديث إلى الخادم
    console.log("تحديث حالة الطلب:", { requestId, newStatus, note });

    // إغلاق المودال وإعادة تحميل البيانات
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("requestDetailsModal")
    );
    modal.hide();
    loadRequests();

    showAlert("success", "تم تحديث حالة الطلب بنجاح");
  } catch (error) {
    console.error("خطأ في تحديث حالة الطلب:", error);
    showAlert("danger", "حدث خطأ أثناء تحديث حالة الطلب");
  }
}

function exportRequests() {
  alert("جاري تصدير تقرير الطلبات...");
}

// تصفية الطلبات
function filterRequests(status) {
  loadRequests(status);
}

// تعيين عامل للطلب
function assignWorker(requestId) {
  // في الواقع، سيتم فتح مودال لاختيار العامل
  alert(`سيتم فتح نافذة لتعيين عامل للطلب رقم ${requestId}`);
}

// إلغاء الطلب
function cancelRequest(requestId) {
  if (confirm("هل أنت متأكد من إلغاء هذا الطلب؟")) {
    // في الواقع، سيتم إرسال طلب إلغاء إلى الخادم
    console.log("إلغاء الطلب:", requestId);
    loadRequests();
  }
}

// الحصول على لون الحالة
function getStatusBadgeClass(status) {
  const statusClasses = {
    pending: "warning",
    processing: "info",
    completed: "success",
    cancelled: "danger",
  };
  return statusClasses[status] || "secondary";
}

// الحصول على الحالة بالعربية
function getStatusInArabic(status) {
  const statusInArabic = {
    pending: "قيد الانتظار",
    processing: "قيد المعالجة",
    completed: "مكتمل",
    cancelled: "ملغي",
  };
  return statusInArabic[status] || status;
}

// تهيئة الرسوم البيانية
function initializeCharts() {
  // رسم بياني للإيرادات
  const revenueCtx = document.getElementById("revenueChart");
  if (revenueCtx) {
    new Chart(revenueCtx, {
      type: "line",
      data: {
        labels: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو"],
        datasets: [
          {
            label: "الإيرادات الشهرية",
            data: [15000, 18000, 22000, 20000, 25000, 28000],
            borderColor: "#2962ff",
            tension: 0.3,
            fill: true,
            backgroundColor: "rgba(41, 98, 255, 0.1)",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => value + " ريال",
            },
          },
        },
      },
    });
  }

  // رسم بياني للخدمات
  const servicesCtx = document.getElementById("servicesChart");
  if (servicesCtx) {
    new Chart(servicesCtx, {
      type: "doughnut",
      data: {
        labels: ["سائق خاص", "عاملة منزلية", "طباخ", "مربية أطفال"],
        datasets: [
          {
            data: [40, 30, 20, 10],
            backgroundColor: ["#2962ff", "#ff6d00", "#2e7d32", "#c2185b"],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      },
    });
  }
}

// توليد تقرير شهري
async function generateMonthlyReport() {
  const selectedMonth = document.getElementById("reportMonth").value;
  if (!selectedMonth) {
    showAlert("warning", "الرجاء اختيار الشهر أولاً");
    return;
  }

  try {
    // في الواقع، سيتم جلب البيانات من الخادم
    console.log("توليد تقرير لشهر:", selectedMonth);

    // تحديث الإحصائيات
    updateStatistics({
      revenue: 25000,
      completedRequests: 85,
      rating: 4.8,
      activeWorkers: 42,
    });

    // تحديث الرسوم البيانية
    initializeCharts();

    showAlert("success", "تم تحديث التقرير بنجاح");
  } catch (error) {
    console.error("خطأ في توليد التقرير:", error);
    showAlert("danger", "حدث خطأ أثناء توليد التقرير");
  }
}

// تحديث الإحصائيات
function updateStatistics(data) {
  document.getElementById("totalRevenue").textContent = data.revenue + " ريال";
  document.getElementById("completedRequests").textContent =
    data.completedRequests;
  document.getElementById("averageRating").textContent = data.rating;
  document.getElementById("activeWorkers").textContent = data.activeWorkers;
}

// تحميل بيانات أفضل العمال
async function loadTopWorkers() {
  try {
    // في الواقع، سيتم جلب البيانات من الخادم
    const dummyTopWorkers = [
      {
        name: "أحمد محمد",
        profession: "سائق",
        requests: 45,
        rating: 4.9,
        revenue: 12000,
      },
      {
        name: "ماري جون",
        profession: "عاملة منزلية",
        requests: 38,
        rating: 4.8,
        revenue: 9500,
      },
      {
        name: "راجيش كومار",
        profession: "طباخ",
        requests: 32,
        rating: 4.7,
        revenue: 8000,
      },
    ];

    displayTopWorkers(dummyTopWorkers);
  } catch (error) {
    console.error("خطأ في تحميل بيانات أفضل العمال:", error);
  }
}

// عرض بيانات أفضل العمال
function displayTopWorkers(workers) {
  const tbody = document.getElementById("topWorkersTable");
  if (!tbody) return;

  tbody.innerHTML = workers
    .map(
      (worker) => `
        <tr>
            <td>${worker.name}</td>
            <td>${worker.profession}</td>
            <td>${worker.requests}</td>
            <td>
                <span class="text-warning">
                    <i class="fas fa-star"></i>
                </span>
                ${worker.rating}
            </td>
            <td>${worker.revenue} ريال</td>
        </tr>
    `
    )
    .join("");
}

// تصدير التقرير
function exportReport() {
  // في الواقع، سيتم تنفيذ عملية التصدير إلى Excel أو PDF
  const selectedMonth = document.getElementById("reportMonth").value;
  if (!selectedMonth) {
    showAlert("warning", "الرجاء اختيار الشهر أولاً");
    return;
  }

  alert("جاري تصدير التقرير...");
}

// إعداد نماذج الإعدادات
function setupSettingsForms() {
  // نموذج الملف الشخصي
  const profileForm = document.getElementById("profileSettingsForm");
  if (profileForm) {
    profileForm.addEventListener("submit", handleProfileUpdate);
  }

  // نموذج الأمان
  const securityForm = document.getElementById("securitySettingsForm");
  if (securityForm) {
    securityForm.addEventListener("submit", handleSecurityUpdate);
  }

  // نموذج الإشعارات
  const notificationForm = document.getElementById("notificationSettingsForm");
  if (notificationForm) {
    notificationForm.addEventListener("submit", handleNotificationUpdate);
  }

  // نموذج المدفوعات
  const paymentForm = document.getElementById("paymentSettingsForm");
  if (paymentForm) {
    paymentForm.addEventListener("submit", handlePaymentUpdate);
  }
}

// تحديث الملف الشخصي
async function handleProfileUpdate(e) {
  e.preventDefault();

  try {
    const formData = new FormData(e.target);
    const profileData = {
      companyName: formData.get("companyName"),
      crNumber: formData.get("crNumber"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      description: formData.get("description"),
      twitter: formData.get("twitter"),
      instagram: formData.get("instagram"),
    };

    // في الواقع، سيتم إرسال البيانات إلى الخادم
    console.log("تحديث الملف الشخصي:", profileData);

    showAlert("success", "تم تحديث الملف الشخصي بنجاح");
  } catch (error) {
    console.error("خطأ في تحديث الملف الشخصي:", error);
    showAlert("danger", "حدث خطأ أثناء تحديث الملف الشخصي");
  }
}

// تحديث إعدادات الأمان
async function handleSecurityUpdate(e) {
  e.preventDefault();

  try {
    const formData = new FormData(e.target);
    const currentPassword = formData.get("currentPassword");
    const newPassword = formData.get("newPassword");
    const confirmPassword = formData.get("confirmPassword");

    if (newPassword !== confirmPassword) {
      throw new Error("كلمتا المرور غير متطابقتين");
    }

    // في الواقع، سيتم إرسال البيانات إلى الخادم
    console.log("تحديث إعدادات الأمان");

    showAlert("success", "تم تحديث إعدادات الأمان بنجاح");
  } catch (error) {
    console.error("خطأ في تحديث إعدادات الأمان:", error);
    showAlert("danger", error.message || "حدث خطأ أثناء تحديث إعدادات الأمان");
  }
}

// تحديث إعدادات الإشعارات
async function handleNotificationUpdate(e) {
  e.preventDefault();

  try {
    const notificationSettings = {
      email: e.target.querySelector("#emailNotifications").checked,
      sms: e.target.querySelector("#smsNotifications").checked,
      whatsapp: e.target.querySelector("#whatsappNotifications").checked,
      newRequests: e.target.querySelector("#newRequests").checked,
      requestUpdates: e.target.querySelector("#requestUpdates").checked,
      payments: e.target.querySelector("#payments").checked,
    };

    // في الواقع، سيتم إرسال البيانات إلى الخادم
    console.log("تحديث إعدادات الإشعارات:", notificationSettings);

    showAlert("success", "تم تحديث إعدادات الإشعارات بنجاح");
  } catch (error) {
    console.error("خطأ في تحديث إعدادات الإشعارات:", error);
    showAlert("danger", "حدث خطأ أثناء تحديث إعدادات الإشعارات");
  }
}

// تحديث إعدادات المدفوعات
async function handlePaymentUpdate(e) {
  e.preventDefault();

  try {
    const paymentSettings = {
      bankName: e.target.querySelector('[name="bankName"]').value,
      iban: e.target.querySelector('[name="iban"]').value,
      accountName: e.target.querySelector('[name="accountName"]').value,
      acceptedMethods: {
        bankTransfer: e.target.querySelector("#bankTransfer").checked,
        creditCard: e.target.querySelector("#creditCard").checked,
        mada: e.target.querySelector("#mada").checked,
      },
    };

    // في الواقع، سيتم إرسال البيانات إلى الخادم
    console.log("تحديث إعدادات المدفوعات:", paymentSettings);

    showAlert("success", "تم تحديث إعدادات المدفوعات بنجاح");
  } catch (error) {
    console.error("خطأ في تحديث إعدادات المدفوعات:", error);
    showAlert("danger", "حدث خطأ أثناء تحديث إعدادات المدفوعات");
  }
}

// معالجة تحميل الشعار
function handleLogoUpload(input) {
  if (input.files && input.files[0]) {
    const file = input.files[0];

    // التحقق من حجم الملف (2 ميجابايت كحد أقصى)
    if (file.size > 2 * 1024 * 1024) {
      showAlert("warning", "حجم الملف يتجاوز 2 ميجابايت");
      input.value = "";
      return;
    }

    // عرض معاينة الصورة
    const reader = new FileReader();
    reader.onload = function (e) {
      const preview = input.parentElement.querySelector("img");
      if (preview) {
        preview.src = e.target.result;
      }
    };
    reader.readAsDataURL(file);
  }
}

// تفعيل/تعطيل التحقق بخطوتين
async function toggleTwoFactorAuth(checked) {
  try {
    // في الواقع، سيتم إرسال الطلب إلى الخادم
    console.log("تحديث حالة التحقق بخطوتين:", checked);

    if (checked) {
      // عرض مودال لإدخال رقم الجوال وتأكيده
      showTwoFactorSetupModal();
    } else {
      showAlert("success", "تم تعطيل التحقق بخطوتين بنجاح");
    }
  } catch (error) {
    console.error("خطأ في تحديث التحقق بخطوتين:", error);
    showAlert("danger", "حدث خطأ أثناء تحديث إعدادات التحقق بخطوتين");
  }
}

const menuItems = document.querySelectorAll(".sidebar-menu li");

// إضافة حدث عند الضغط على عنصر
menuItems.forEach((item) => {
  item.addEventListener("click", () => {
    // إخفاء كل الأقسام
    document.querySelectorAll(".content-section").forEach((section) => {
      section.style.display = "none";
    });

    // عرض القسم المحدد
    const targetId = item.getAttribute("data-target");
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.style.display = "block";
      //targetSection.classList.add("active");
    }
  });
});

function viewNewRequests() {
  // إخفاء كل الأقسام
  document.querySelectorAll(".content-section").forEach((section) => {
    section.style.display = "none";
  });

  // عرض قسم الطلبات
  const requestsSection = document.getElementById("requests");
  if (requestsSection) {
    requestsSection.style.display = "block";
  }

  // تحميل الطلبات الجديدة
  loadRequests("pending");
}

function addNewWorker() {
  // فتح نموذج إضافة عامل جديد
  $("#addWorkerModal").modal("show");
}
function exportReport() {
  // يمكنك استخدام مكتبة مثل SheetJS أو jsPDF لتصدير البيانات
  alert("تصدير التقرير يعمل!"); // اختبار بسيط للتأكد من أن الدالة تعمل
}
function addNewWorker() {
  // فتح نموذج إضافة عامل جديد
  $("#addWorkerModal").modal("show");
}
// توليد تقرير شهري
// توليد تقرير شهري
async function generateReport() {
  const selectedMonth = document.getElementById("reportMonth").value;
  if (!selectedMonth) {
    showAlert("warning", "الرجاء اختيار الشهر أولاً");
    return;
  }

  try {
    // في الواقع، سيتم جلب البيانات من الخادم
    console.log("توليد تقرير لشهر:", selectedMonth);

    // تحديث الإحصائيات
    updateStatistics({
      revenue: 25000,
      completedRequests: 85,
      rating: 4.8,
      activeWorkers: 42,
    });

    // تحديث الرسوم البيانية
    initializeCharts();

    showAlert("success", "تم تحديث التقرير بنجاح");
  } catch (error) {
    console.error("خطأ في توليد التقرير:", error);
    showAlert("danger", "حدث خطأ أثناء توليد التقرير");
  }
}

// تصدير التقرير
function exportReport() {
  const selectedMonth = document.getElementById("reportMonth").value;
  if (!selectedMonth) {
    showAlert("warning", "الرجاء اختيار الشهر أولاً");
    return;
  }

  // يمكنك استخدام مكتبة مثل SheetJS أو jsPDF لتصدير البيانات
  alert("جاري تصدير التقرير...");
}

function manageSettings() {
  // إخفاء كل الأقسام
  document.querySelectorAll(".content-section").forEach((section) => {
    section.style.display = "none";
  });

  // عرض قسم الإعدادات
  const settingsSection = document.getElementById("settings");
  if (settingsSection) {
    settingsSection.style.display = "block";
    console.log("تم عرض قسم الإعدادات"); // للتأكد من أن الدالة تعمل
  } else {
    console.error("قسم الإعدادات غير موجود"); // في حالة وجود خطأ
  }
}

// عرض تفاصيل الرسالة
function viewMessageDetails(messageId) {
  // في الواقع، سيتم جلب تفاصيل الرسالة من الخادم
  const message = {
    id: messageId,
    sender: "عميل 1",
    subject: "طلب توظيف سائق",
    date: "2024-03-15",
    status: "unread",
    content: "السلام عليكم، أود طلب سائق خاص لمدة شهر. الرجاء التواصل معي.",
  };

  // ملء بيانات المودال
  document.getElementById("messageDetailsSender").textContent = message.sender;
  document.getElementById("messageDetailsSubject").textContent =
    message.subject;
  document.getElementById("messageDetailsDate").textContent = formatDate(
    message.date
  );
  document.getElementById("messageDetailsContent").textContent =
    message.content;

  // عرض المودال
  const modal = new bootstrap.Modal(
    document.getElementById("messageDetailsModal")
  );
  modal.show();
}

// حذف الرسالة
function deleteMessage(messageId) {
  if (confirm("هل أنت متأكد من حذف هذه الرسالة؟")) {
    // في الواقع، سيتم إرسال طلب حذف إلى الخادم
    console.log("حذف الرسالة:", messageId);
    loadMessages(); // إعادة تحميل الرسائل
  }
}

// الحصول على لون حالة الرسالة
function getMessageStatusBadgeClass(status) {
  const statusClasses = {
    unread: "warning",
    read: "success",
    draft: "secondary",
  };
  return statusClasses[status] || "secondary";
}

// الحصول على حالة الرسالة بالعربية
function getMessageStatusInArabic(status) {
  const statusInArabic = {
    unread: "غير مقروءة",
    read: "مقروءة",
    draft: "مسودة",
  };
  return statusInArabic[status] || status;
}

// إنشاء رسالة جديدة
function composeMessage() {
  const modal = new bootstrap.Modal(
    document.getElementById("composeMessageModal")
  );
  modal.show();
}

// تحديث الرسائل
function refreshMessages() {
  loadMessages();
}

// إضافة مستمعي الأحداث للرسائل
function setupMessagesEventListeners() {
  const messageTypeFilter = document.getElementById("messageTypeFilter");
  if (messageTypeFilter) {
    messageTypeFilter.addEventListener("change", () => {
      loadMessages(messageTypeFilter.value);
    });
  }

  const messageDateFilter = document.getElementById("messageDateFilter");
  if (messageDateFilter) {
    messageDateFilter.addEventListener("change", () => {
      loadMessages();
    });
  }

  const messageSearch = document.getElementById("messageSearch");
  if (messageSearch) {
    messageSearch.addEventListener("input", () => {
      loadMessages();
    });
  }
}

// تهيئة الرسائل عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", function () {
  setupMessagesEventListeners();
  loadMessages();
});

function showReviews() {
  // إخفاء كل الأقسام
  document.querySelectorAll(".content-section").forEach((section) => {
    section.style.display = "none";
  });

  // عرض قسم التقييمات
  const reviewsSection = document.getElementById("reviews");
  if (reviewsSection) {
    reviewsSection.style.display = "block";
    loadReviews(); // تحميل التقييمات عند عرض القسم
  } else {
    console.error("قسم التقييمات غير موجود");
  }
}
// تحميل آخر النشاطات
async function loadRecentActivities() {
  try {
    // بيانات وهمية للاختبار
    const dummyActivities = [
      {
        activity: "تسجيل عامل جديد",
        details: "تم تسجيل العامل: أحمد محمد",
        date: "2024-03-15",
        status: "مكتمل",
      },
      {
        activity: "تحديث طلب",
        details: "تم تحديث حالة الطلب #REQ001 إلى 'قيد المعالجة'",
        date: "2024-03-14",
        status: "مكتمل",
      },
      {
        activity: "إضافة تقييم",
        details: "تمت إضافة تقييم جديد من العميل: سارة أحمد",
        date: "2024-03-13",
        status: "مكتمل",
      },
      {
        activity: "حذف عامل",
        details: "تم حذف العامل: محمد علي",
        date: "2024-03-12",
        status: "ملغي",
      },
    ];

    // عرض النشاطات في الجدول
    displayRecentActivities(dummyActivities);
  } catch (error) {
    console.error("خطأ في تحميل آخر النشاطات:", error);
    showAlert("danger", "حدث خطأ أثناء تحميل آخر النشاطات");
  }
}

// عرض آخر النشاطات في الجدول
function displayRecentActivities(activities) {
  const activitiesTable = document.getElementById("activitiesTable");
  if (!activitiesTable) return;

  activitiesTable.innerHTML = activities
    .map(
      (activity) => `
        <tr>
          <td>${activity.activity}</td>
          <td>${activity.details}</td>
          <td>${activity.date}</td>
          <td>
            <span class="badge bg-${
              activity.status === "مكتمل" ? "success" : "danger"
            }">
              ${activity.status}
            </span>
          </td>
        </tr>
      `
    )
    .join("");
}
document.addEventListener("DOMContentLoaded", function () {
  // تحميل آخر النشاطات
  loadRecentActivities();

  // باقي الكود...
});
// new
// فتح/إغلاق القائمة الجانبية
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (sidebar) {
    sidebar.classList.toggle("show-sidebar");
  }
}

// إضافة مستمع حدث للزر
const toggleButton = document.querySelector(".toggle-sidebar");
if (toggleButton) {
  toggleButton.addEventListener("click", toggleSidebar);
}

// إغلاق القائمة الجانبية عند النقر خارجها
document.addEventListener("click", function (event) {
  const sidebar = document.getElementById("sidebar");
  const toggleButton = document.querySelector(".toggle-sidebar");

  if (
    sidebar &&
    !sidebar.contains(event.target) &&
    !toggleButton.contains(event.target)
  ) {
    sidebar.classList.remove("show-sidebar");
  }
});
// دالة البحث
function handleSearch() {
  const searchInput = document.querySelector(".search-box input");
  if (searchInput) {
    searchInput.addEventListener("input", function (e) {
      const searchTerm = e.target.value.toLowerCase();
      const workersGrid = document.getElementById("workersGrid");
      const requestsTableBody = document.getElementById("requestsTableBody");
      const reportsTableBody = document.getElementById("reportsTableBody");

      if (workersGrid) {
        const workers = workersGrid.querySelectorAll(".worker-card");
        workers.forEach((worker) => {
          const workerName = worker
            .querySelector("h5")
            .textContent.toLowerCase();
          if (workerName.includes(searchTerm)) {
            worker.style.display = "block";
          } else {
            worker.style.display = "none";
          }
        });
      }

      if (requestsTableBody) {
        const requests = requestsTableBody.querySelectorAll("tr");
        requests.forEach((request) => {
          const requestText = request.textContent.toLowerCase();
          if (requestText.includes(searchTerm)) {
            request.style.display = "table-row";
          } else {
            request.style.display = "none";
          }
        });
      }

      if (reportsTableBody) {
        const reports = reportsTableBody.querySelectorAll("tr");
        reports.forEach((report) => {
          const reportText = report.textContent.toLowerCase();
          if (reportText.includes(searchTerm)) {
            report.style.display = "table-row";
          } else {
            report.style.display = "none";
          }
        });
      }
    });
  }
}

// تفعيل البحث عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", function () {
  // تفعيل العناصر في القائمة الجانبية
  const menuItems = document.querySelectorAll(".sidebar-menu li");
  menuItems.forEach((item) => {
    item.addEventListener("click", () => {
      // إزالة الفئة active من جميع العناصر
      menuItems.forEach((menuItem) => {
        menuItem.classList.remove("active");
      });

      // إضافة الفئة active للعنصر الذي تم النقر عليه
      item.classList.add("active");

      // إخفاء كل الأقسام
      document.querySelectorAll(".content-section").forEach((section) => {
        section.style.display = "none";
      });

      // عرض القسم المحدد
      const targetId = item.getAttribute("data-target");
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.style.display = "block";
      }
    });
  });
});
// دالة فتح/إغلاق القائمة الجانبية
function toggleSidebar() {
  const sidebar = document.querySelector(".dashboard-sidebar");
  if (sidebar) {
    sidebar.classList.toggle("show-sidebar");
  }
}
function logout() {
  // حذف بيانات المستخدم من localStorage
  localStorage.removeItem("userData");

  // توجيه المستخدم إلى صفحة تسجيل الدخول
  window.location.href = "login.html";
}

document.querySelector(".li").addEventListener("click", function (event) {
  event.stopPropagation();

  this.classList.add("active");
});
function showAlert(type, message) {
  const alertDiv = document.createElement("div");
  alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;

  document.querySelector(".dashboard-content").prepend(alertDiv);

  // إخفاء التنبيه تلقائياً بعد 3 ثواني
  setTimeout(() => alertDiv.remove(), 3000);
}

function addRecentActivity(activity) {
  const activitiesTable = document.getElementById("activitiesTable");
  if (!activitiesTable) return;

  // إنشاء صف جديد للنشاط
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td>${activity.activity}</td>
    <td>${activity.details}</td>
    <td>${activity.date}</td>
    <td>
      <span class="badge bg-${
        activity.status === "مكتمل" ? "success" : "danger"
      }">
        ${activity.status}
      </span>
    </td>
  `;

  // إضافة الصف الجديد إلى الجدول
  activitiesTable.appendChild(newRow);
}
function addRecentActivity(activity) {
  const activitiesTable = document.getElementById("activitiesTable");
  if (!activitiesTable) return;

  // إنشاء صف جديد للنشاط
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td>${activity.activity}</td>
    <td>${activity.details}</td>
    <td>${activity.date}</td>
    <td>
      <span class="badge bg-${
        activity.status === "مكتمل" ? "success" : "danger"
      }">
        ${activity.status}
      </span>
    </td>
  `;

  // إضافة الصف الجديد إلى الجدول
  activitiesTable.appendChild(newRow);
}


function updateStats() {
  // تحديث الإحصائيات في الواجهة
  const stats = {
    availableWorkers: 150,
    newRequests: 25,
    completedRequests: 85,
    averageRating: 4.8,
  };

  // تحديث العناصر في الواجهة
  document.querySelector(".stat-card:nth-child(1) h3").textContent = stats.availableWorkers;
  document.querySelector(".stat-card:nth-child(2) h3").textContent = stats.newRequests;
  document.querySelector(".stat-card:nth-child(3) h3").textContent = stats.completedRequests;
  document.querySelector(".stat-card:nth-child(4) h3").textContent = stats.averageRating;
}