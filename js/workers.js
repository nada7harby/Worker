document.addEventListener("DOMContentLoaded", function () {
  // تحميل جميع العمال من ملف workers.json
  fetch("./workers.json")
    .then((response) => response.json())
    .then((data) => {
      const workers = data.workers;
      localStorage.setItem("searchResults", JSON.stringify(workers));
      displayWorkers(workers);
    });
  setupFilters();
});

function loadSearchResults() {
  let results = JSON.parse(localStorage.getItem("searchResults")) || [];

  // إذا لم تكن هناك بيانات، قم بإضافة بيانات افتراضية للاختبار
  if (results.length === 0) {
    results = [
      {
        id: 1,
        name: "أحمد محمد",
        nationality: "مصري",
        age: 35,
        category: "سائق خاص",
        experience: 8,
        rating: 4.8,
        salary: 2500,
        location: "الرياض",
        image: "worker1.jpg",
        skills: ["رخصة قيادة دولية", "خبرة في السيارات الفارهة"],
        languages: ["العربية", "الإنجليزية"],
        availability: true,
        status: "متاح",
        reviews: 10,
      },
      {
        id: 2,
        name: "ماري جون",
        nationality: "فلبينية",
        age: 28,
        category: "عمالة منزلية",
        experience: 5,
        rating: 4.9,
        salary: 2000,
        location: "جدة",
        image: "worker2.jpg",
        skills: ["طبخ", "تنظيف", "رعاية أطفال"],
        languages: ["الإنجليزية", "العربية البسيطة"],
        availability: true,
        status: "متاح",
        reviews: 15,
      },
    ];
    localStorage.setItem("searchResults", JSON.stringify(results));
  }

  const params = JSON.parse(localStorage.getItem("searchParams")) || {};

  // تحديث قيم الفلاتر
  if (params.serviceType) {
    document.getElementById("serviceFilter").value = params.serviceType;
  }
  if (params.nationality) {
    document.getElementById("nationalityFilter").value = params.nationality;
  }

  displayWorkers(results);
}

function displayWorkers(workers) {
  const container = document.getElementById("workersContainer");
  const loadingSpinner = document.getElementById("loadingSpinner");
  const noResults = document.getElementById("noResults");

  // إظهار مؤشر التحميل
  container.style.display = "none";
  loadingSpinner.style.display = "block";
  noResults.style.display = "none";

  setTimeout(() => {
    if (workers.length === 0) {
      loadingSpinner.style.display = "none";
      noResults.style.display = "block";
      return;
    }

    container.innerHTML = workers
      .map(
        (worker) => `
            <div class="col-md-6 col-lg-4">
                <div class="worker-card">
                    <div class="worker-image">
                        <img src="images/${worker.image}" alt="${worker.name}">
                        <span class="worker-status ${
                          worker.availability ? "available" : "busy"
                        }">
                            ${worker.availability ? "متاح" : "مشغول"}
                        </span>
                    </div>
                    <div class="worker-info">
                        <h3 class="worker-name">${worker.name}</h3>
                        <div class="worker-meta">
                            <span><i class="fas fa-flag"></i> ${
                              worker.nationality
                            }</span>
                            <span><i class="fas fa-briefcase"></i> ${
                              worker.experience
                            } سنوات خبرة</span>
                        </div>
                        <div class="worker-rating">
                            <div class="rating-stars">
                                ${generateStars(worker.rating)}
                            </div>
                            <span class="rating-count">(${
                              worker.reviews
                            } تقييم)</span>
                        </div>
                        <div class="worker-skills">
                            ${worker.skills
                              .slice(0, 3)
                              .map(
                                (skill) =>
                                  `<span class="skill-tag">${skill}</span>`
                              )
                              .join("")}
                        </div>
                    </div>
                    <div class="worker-footer">
                        <span class="worker-salary">${worker.salary} ريال</span>
                      
                        <button class="btn btn-primary" onclick="showWorkerDetails(${
                          worker.id
                        })">
                            عرض التفاصيل
                        </button>
             
             

                    </div>
                </div>
            </div>
        `
      )
      .join("");

    container.style.display = "block";
    loadingSpinner.style.display = "none";
  }, 500);
}

// إنشاء نجوم التقييم
function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - Math.ceil(rating);

  return `
        ${'<i class="fas fa-star"></i>'.repeat(fullStars)}
        ${hasHalfStar ? '<i class="fas fa-star-half-alt"></i>' : ""}
        ${'<i class="far fa-star"></i>'.repeat(emptyStars)}
    `;
}

// إعداد الفلاتر
function setupFilters() {
  const filters = document.querySelectorAll(".search-filters select");
  filters.forEach((filter) => {
    filter.addEventListener("change", applyFilters);
  });
}
function applyFilters() {
  const serviceType = document.getElementById("serviceFilter").value;
  const nationality = document.getElementById("nationalityFilter").value;
  const experience = document.getElementById("experienceFilter").value;
  const salary = document.getElementById("salaryFilter").value;

  // في الواقع، سيتم إرسال طلب للخادم مع معايير التصفية
  getDummyWorkers(serviceType, nationality, experience, salary).then(
    (workers) => displayWorkers(workers)
  );
}

function getDummyWorkers(serviceType, nationality, experience, salary) {
  let results = JSON.parse(localStorage.getItem("searchResults")) || [];

  // تطبيق الفلاتر
  if (serviceType !== "الكل") {
    results = results.filter((worker) => worker.category === serviceType);
  }
  if (nationality !== "الكل") {
    results = results.filter((worker) => worker.nationality === nationality);
  }
  if (experience !== "الكل") {
    const [minExp, maxExp] = experience.split("-");
    results = results.filter((worker) => {
      const exp = worker.experience;
      if (maxExp) {
        return exp >= minExp && exp <= maxExp;
      } else {
        return exp >= minExp;
      }
    });
  }
  if (salary !== "الكل") {
    const [minSalary, maxSalary] = salary.split("-");
    results = results.filter((worker) => {
      const sal = worker.salary;
      if (maxSalary) {
        return sal >= minSalary && sal <= maxSalary;
      } else {
        return sal >= minSalary;
      }
    });
  }

  return Promise.resolve(results);
}
function checkExperience(workerExperience, filter) {
  const [min, max] = filter.split("-").map(Number);
  if (filter.endsWith("+")) {
    return workerExperience >= min;
  }
  return workerExperience >= min && workerExperience <= max;
}

function checkSalary(workerSalary, filter) {
  const [min, max] = filter.split("-").map(Number);
  if (filter.endsWith("-")) {
    return workerSalary <= min;
  }
  if (filter.endsWith("+")) {
    return workerSalary >= min;
  }
  return workerSalary >= min && workerSalary <= max;
}

function showWorkerDetails(workerId) {
  const workers = JSON.parse(localStorage.getItem("searchResults")) || [];
  const worker = workers.find((w) => w.id === workerId);

  if (!worker) return;

  const modalBody = document.querySelector("#workerModal .modal-body");
  modalBody.innerHTML = `
        <div class="worker-modal-header">
            <img src="${worker.image}" alt="${worker.name}">
        </div>
        <div class="worker-modal-info">
            <h3 class="mb-4">${worker.name}</h3>
            <div class="worker-modal-meta">
                <div class="meta-item">
                    <i class="fas fa-flag"></i>
                    <div class="meta-item-content">
                        <span>الجنسية</span>
                        <strong>${worker.nationality}</strong>
                    </div>
                </div>
                <div class="meta-item">
                    <i class="fas fa-briefcase"></i>
                    <div class="meta-item-content">
                        <span>الخبرة</span>
                        <strong>${worker.experience} سنوات</strong>
                    </div>
                </div>
                <div class="meta-item">
                    <i class="fas fa-user"></i>
                    <div class="meta-item-content">
                        <span>العمر</span>
                        <strong>${worker.age} سنة</strong>
                    </div>
                </div>
                <div class="meta-item">
                    <i class="fas fa-money-bill-wave"></i>
                    <div class="meta-item-content">
                        <span>الراتب</span>
                        <strong>${worker.salary} ريال</strong>
                    </div>
                </div>
            </div>
            
            <div class="worker-modal-section">
                <h6>اللغات</h6>
                <div class="language-list">
                    ${worker.languages
                      .map(
                        (lang) => `<span class="language-item">${lang}</span>`
                      )
                      .join("")}
                </div>
            </div>
            
            <div class="worker-modal-section">
                <h6>المهارات</h6>
                <div class="skill-list">
                    ${worker.skills
                      .map(
                        (skill) => `<span class="skill-item">${skill}</span>`
                      )
                      .join("")}
                </div>
            </div>
            
            <div class="booking-section">
                <button class="btn btn-primary w-100" onclick="bookWorker(${
                  worker.id
                })">
                    احجز الآن
                </button>
            </div>
        </div>
    `;

  const modal = new bootstrap.Modal(document.getElementById("workerModal"));
  modal.show();
}

// حجز العامل
// حجز العامل
function bookWorker(workerId) {
  // جلب بيانات العامل المحدد
  const workers = JSON.parse(localStorage.getItem("searchResults")) || [];
  const worker = workers.find((w) => w.id === workerId);

  if (!worker) return;

  // جلب الطلبات الحالية من localStorage أو إنشاء مصفوفة جديدة إذا لم تكن موجودة
  const bookings = JSON.parse(localStorage.getItem("bookings")) || [];

  // التحقق من عدم وجود العامل بالفعل في الطلبات
  const isAlreadyBooked = bookings.some((booking) => booking.id === workerId);
  if (isAlreadyBooked) {
    alert("تم حجز هذا العامل مسبقًا!");
    return;
  }

  // إضافة العامل إلى مصفوفة الطلبات مع تاريخ الحجز
  const booking = {
    ...worker, // نسخ جميع خصائص العامل
    orderDate: new Date().toISOString().split('T')[0], // تاريخ الحجز (بتنسيق YYYY-MM-DD)
    status: "قيد التنفيذ", // حالة الطلب الافتراضية
    additionalDetails: "تفاصيل إضافية هنا" // يمكن تعديلها لاحقًا
  };

  bookings.push(booking);

  // حفظ الطلبات المحدثة في localStorage
  localStorage.setItem("bookings", JSON.stringify(bookings));

  // إظهار رسالة نجاح
  alert("تم حجز العامل بنجاح!");

  // إغلاق النموذج (Modal)
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("workerModal")
  );
  modal.hide();
}
// تعديل وظيفة showWorkerDetails لإضافة زر "احجز الآن"
function showWorkerDetails(workerId) {
  const workers = JSON.parse(localStorage.getItem("searchResults")) || [];
  const worker = workers.find((w) => w.id === workerId);

  if (!worker) return;

  const modalBody = document.querySelector("#workerModal .modal-body");
  modalBody.innerHTML = `
        <div class="worker-modal-header">
            <img src="images/${worker.image}" alt="${worker.name}">
        </div>
        <div class="worker-modal-info">
            <h3 class="mb-4">${worker.name}</h3>
            <div class="worker-modal-meta">
                <div class="meta-item">
                    <i class="fas fa-flag"></i>
                    <div class="meta-item-content">
                        <span>الجنسية</span>
                        <strong>${worker.nationality}</strong>
                    </div>
                </div>
                <div class="meta-item">
                    <i class="fas fa-briefcase"></i>
                    <div class="meta-item-content">
                        <span>الخبرة</span>
                        <strong>${worker.experience} سنوات</strong>
                    </div>
                </div>
                <div class="meta-item">
                    <i class="fas fa-user"></i>
                    <div class="meta-item-content">
                        <span>العمر</span>
                        <strong>${worker.age} سنة</strong>
                    </div>
                </div>
                <div class="meta-item">
                    <i class="fas fa-money-bill-wave"></i>
                    <div class="meta-item-content">
                        <span>الراتب</span>
                        <strong>${worker.salary} ريال</strong>
                    </div>
                </div>
            </div>
            
            <div class="worker-modal-section">
                <h6>اللغات</h6>
                <div class="language-list">
                    ${worker.languages
                      .map(
                        (lang) => `<span class="language-item">${lang}</span>`
                      )
                      .join("")}
                </div>
            </div>
            
            <div class="worker-modal-section">
                <h6>المهارات</h6>
                <div class="skill-list">
                    ${worker.skills
                      .map(
                        (skill) => `<span class="skill-item">${skill}</span>`
                      )
                      .join("")}
                </div>
            </div>
            
            <div class="booking-section">
                <button class="btn btn-primary w-100" onclick="bookWorker(${workerId})">
                    احجز الآن
                </button>
            </div>
        </div>
    `;

  const modal = new bootstrap.Modal(document.getElementById("workerModal"));
  modal.show();
}
