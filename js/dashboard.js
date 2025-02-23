document.addEventListener("DOMContentLoaded", function () {
  // التحقق من حالة تسجيل الدخول
  //if (!checkAuthStatus()) return;

  // تهيئة البيانات
  loadDashboardData();

  // إضافة مستمعي الأحداث
  setupEventListeners();

  // تحميل الطلبات الأخيرة
  loadRecentRequests();
});

// إعداد مستمعي الأحداث
function setupEventListeners() {
  // زر إظهار/إخفاء القائمة الجانبية
  const toggleBtn = document.querySelector(".toggle-sidebar");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", toggleSidebar);
  }

  // التنقل بين الأقسام
  const menuLinks = document.querySelectorAll(".sidebar-menu a");
  menuLinks.forEach((link) => {
    link.addEventListener("click", handleNavigation);
  });

  // قائمة الإشعارات
  const notificationsBtn = document.querySelector(".notifications");
  if (notificationsBtn) {
    notificationsBtn.addEventListener("click", toggleNotifications);
  }

  // قائمة المستخدم
  const userMenu = document.querySelector(".user-menu");
  if (userMenu) {
    userMenu.addEventListener("click", toggleUserMenu);
  }
}

// تبديل حالة القائمة الجانبية
function toggleSidebar() {
  const sidebar = document.querySelector(".dashboard-sidebar");
  sidebar.classList.toggle("sidebar-open");
}

// التعامل مع التنقل
function handleNavigation(e) {
  e.preventDefault();

  // إزالة الكلاس active من جميع العناصر
  document.querySelectorAll(".sidebar-menu li").forEach((item) => {
    item.classList.remove("active");
  });

  // إضافة الكلاس active للعنصر المحدد
  this.parentElement.classList.add("active");

  // إخفاء جميع الأقسام
  document.querySelectorAll(".content-section").forEach((section) => {
    section.style.display = "none";
  });

  // إظهار القسم المطلوب
  const targetId = this.getAttribute("href").substring(1);
  const targetSection = document.getElementById(targetId);
  if (targetSection) {
    targetSection.style.display = "block";
  }
}

// تحميل بيانات لوحة التحكم
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

// تحديث الإحصائيات
function updateStats() {
  // هنا يمكن إضافة منطق لتحديث الإحصائيات من البيانات المخزنة
  const dummyStats = {
    activeRequests: 5,
    completedRequests: 12,
    favorites: 8,
  };

  // تحديث العناصر في الواجهة
  document.querySelector(".stat-card:nth-child(1) h3").textContent =
    dummyStats.activeRequests;
  document.querySelector(".stat-card:nth-child(2) h3").textContent =
    dummyStats.completedRequests;
  document.querySelector(".stat-card:nth-child(3) h3").textContent =
    dummyStats.favorites;
}

// تحميل الطلبات الأخيرة
function loadRecentRequests() {
  const dummyRequests = [
    {
      id: "REQ001",
      type: "عمالة منزلية",
      date: "2024-02-20",
      status: "قيد المعالجة",
      statusClass: "warning",
    },
    {
      id: "REQ002",
      type: "سائق خاص",
      date: "2024-02-18",
      status: "مكتمل",
      statusClass: "success",
    },
    {
      id: "REQ003",
      type: "طباخ",
      date: "2024-02-15",
      status: "ملغي",
      statusClass: "danger",
    },
  ];

  const tbody = document.querySelector(".recent-requests table tbody");
  if (tbody) {
    tbody.innerHTML = dummyRequests
      .map(
        (request) => `
            <tr>
                <td>${request.id}</td>
                <td>${request.type}</td>
                <td>${formatDate(request.date)}</td>
                <td><span class="badge bg-${request.statusClass}">${
          request.status
        }</span></td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="viewRequest('${
                      request.id
                    }')">
                        <i class="fas fa-eye"></i>
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
}

// عرض الإشعارات
function toggleNotifications() {
  // هنا يمكن إضافة منطق لعرض قائمة الإشعارات
  alert("سيتم عرض الإشعارات هنا");
}

// عرض قائمة المستخدم
function toggleUserMenu() {
  // هنا يمكن إضافة منطق لعرض قائمة المستخدم
  const userMenuDropdown = document.createElement("div");
  userMenuDropdown.className = "user-menu-dropdown";
  // إضافة خيارات القائمة
}

// عرض تفاصيل الطلب
function viewRequest(requestId) {
  // هنا يمكن إضافة منطق لعرض تفاصيل الطلب
  alert(`عرض تفاصيل الطلب رقم ${requestId}`);
}

// إلغاء الطلب
function cancelRequest(requestId) {
  if (confirm("هل أنت متأكد من إلغاء هذا الطلب؟")) {
    // هنا يمكن إضافة منطق إلغاء الطلب
    alert(`تم إلغاء الطلب رقم ${requestId}`);
    loadRecentRequests(); // إعادة تحميل الطلبات
  }
}

// تنسيق التاريخ
function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("ar-SA", options);
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
