// document.addEventListener("DOMContentLoaded", function () {
//   // تحميل البيانات وعرض النتائج الأولية
//   loadAndDisplayWorkers();

//   // إضافة مستمعي الأحداث للفلاتر
//   setupFilterListeners();
// });

// async function loadAndDisplayWorkers() {
//   try {
//     const workersData = await getWorkersData();
//     displayWorkers(workersData.workers);
//   } catch (error) {
//     console.error("خطأ في تحميل البيانات:", error);
//   }
// }

// async function getWorkersData() {
//   // محاولة استرجاع البيانات من localStorage أولاً
//   const cachedData = localStorage.getItem("workersData");
//   if (cachedData) {
//     return JSON.parse(cachedData);
//   }

//   // إذا لم تكن البيانات موجودة، قم بتحميلها من الملف
//   const response = await fetch("../data/workers.json");
//   const data = await response.json();
//   localStorage.setItem("workersData", JSON.stringify(data));
//   return data;
// }

// function displayWorkers(workers) {
//   const resultsContainer = document.getElementById("workersResults");
//   resultsContainer.innerHTML = workers
//     .map(
//       (worker) => `

//         <div class="worker-card">
//             <img src="images/${worker.image}" alt="${
//         worker.name
//       }" class="worker-image">
//             <div class="worker-info">
//                 <h5>${worker.name}</h5>
//                 <div class="worker-rating">
//                     ${getStarRating(worker.rating)}
//                     <span class="rating-number">${worker.rating}</span>
//                 </div>
//                 <div class="worker-meta">
//                     <span><i class="fas fa-flag"></i> ${
//                       worker.nationality
//                     }</span>
//                     <span><i class="fas fa-briefcase"></i> ${
//                       worker.experience
//                     } سنوات</span>
//                 </div>
//                 <div class="worker-meta">
//                     <span><i class="fas fa-map-marker-alt"></i> ${
//                       worker.location
//                     }</span>
//                     <span><i class="fas fa-money-bill-wave"></i> ${
//                       worker.salary
//                     } ريال</span>
//                 </div>
//                 <button class="btn btn-primary w-100 mt-3" onclick="viewWorkerDetails(${
//                   worker.id
//                 })">
//                     عرض التفاصيل
//                 </button>
//             </div>
//         </div>
//     `
//     )
//     .join("");
// }

// function getStarRating(rating) {
//   const fullStars = Math.floor(rating);
//   const hasHalfStar = rating % 1 >= 0.5;
//   let stars = "";

//   for (let i = 0; i < fullStars; i++) {
//     stars += '<i class="fas fa-star"></i>';
//   }

//   if (hasHalfStar) {
//     stars += '<i class="fas fa-star-half-alt"></i>';
//   }

//   return stars;
// }

// function setupFilterListeners() {
//   const applyFiltersBtn = document.getElementById("applyFilters");
//   const sortSelect = document.getElementById("sortResults");

//   applyFiltersBtn.addEventListener("click", applyFilters);
//   sortSelect.addEventListener("change", applyFilters);
// }

// async function applyFilters() {
//   const workersData = await getWorkersData();
//   let filteredWorkers = [...workersData.workers];

//   // تطبيق الفلاتر
//   const nationality = document.getElementById("nationalityFilter").value;
//   const minAge = document.getElementById("minAge").value;
//   const maxAge = document.getElementById("maxAge").value;
//   const experience = document.getElementById("experienceFilter").value;
//   const location = document.getElementById("locationFilter").value;

//   if (nationality) {
//     filteredWorkers = filteredWorkers.filter(
//       (w) => w.nationality === nationality
//     );
//   }

//   if (minAge) {
//     filteredWorkers = filteredWorkers.filter((w) => w.age >= parseInt(minAge));
//   }

//   if (maxAge) {
//     filteredWorkers = filteredWorkers.filter((w) => w.age <= parseInt(maxAge));
//   }

//   if (location) {
//     filteredWorkers = filteredWorkers.filter((w) => w.location === location);
//   }

//   // تطبيق الترتيب
//   const sortBy = document.getElementById("sortResults").value;
//   sortWorkers(filteredWorkers, sortBy);

//   // عرض النتائج
//   displayWorkers(filteredWorkers);
// }

// function sortWorkers(workers, sortBy) {
//   switch (sortBy) {
//     case "rating":
//       workers.sort((a, b) => b.rating - a.rating);
//       break;
//     case "salary-low":
//       workers.sort((a, b) => a.salary - b.salary);
//       break;
//     case "salary-high":
//       workers.sort((a, b) => b.salary - a.salary);
//       break;
//     case "experience":
//       workers.sort((a, b) => b.experience - a.experience);
//       break;
//   }
// }

// function viewWorkerDetails(workerId) {
//   window.location.href = `worker-details.html?id=${workerId}`;
// }

// document.addEventListener("DOMContentLoaded", function () {
//   const workersResults = document.getElementById("workersResults");
//   const applyFiltersButton = document.getElementById("applyFilters");
//   const sortResults = document.getElementById("sortResults");

//   let workersData = [];

//   // تحميل بيانات العمال من ملف JSON
//   fetch("./workers.json")
//     .then((response) => response.json())
//     .then((data) => {
//       workersData = data.workers;
//       displayWorkers(workersData); // عرض جميع العمال عند التحميل
//     })
//     .catch((error) => console.error("Error loading workers data:", error));

//   // تطبيق الفلترة عند النقر على زر "تطبيق الفلترة"
//   applyFiltersButton.addEventListener("click", function () {
//     const filteredWorkers = filterWorkers(workersData);
//     displayWorkers(filteredWorkers);
//   });

//   // تطبيق الفرز عند تغيير خيارات الفرز
//   sortResults.addEventListener("change", function () {
//     const filteredWorkers = filterWorkers(workersData);
//     const sortedWorkers = sortWorkers(filteredWorkers, sortResults.value);
//     displayWorkers(sortedWorkers);
//   });

//   // دالة لتطبيق الفلترة
//   function filterWorkers(workers) {
//     const nationality = document.getElementById("nationalityFilter").value;
//     const minAge = parseInt(document.getElementById("minAge").value) || 0;
//     const maxAge = parseInt(document.getElementById("maxAge").value) || 100;
//     const experience = document.getElementById("experienceFilter").value;
//     const minSalary = parseInt(document.getElementById("minSalary").value) || 0;
//     const maxSalary = parseInt(document.getElementById("maxSalary").value) || 100000;
//     const location = document.getElementById("locationFilter").value;

//     return workers.filter((worker) => {
//       const matchesNationality = nationality ? worker.nationality === nationality : true;
//       const matchesAge = worker.age >= minAge && worker.age <= maxAge;
//       const matchesExperience = experience ? checkExperience(worker.experience, experience) : true;
//       const matchesSalary = worker.salary >= minSalary && worker.salary <= maxSalary;
//       const matchesLocation = location ? worker.location === location : true;

//       return (
//         matchesNationality &&
//         matchesAge &&
//         matchesExperience &&
//         matchesSalary &&
//         matchesLocation
//       );
//     });
//   }

//   // دالة للتحقق من سنوات الخبرة
//   function checkExperience(experience, range) {
//     if (range === "1-3") return experience >= 1 && experience <= 3;
//     if (range === "4-7") return experience >= 4 && experience <= 7;
//     if (range === "8+") return experience >= 8;
//     return true;
//   }

//   // دالة لفرز العمال
//   function sortWorkers(workers, sortBy) {
//     switch (sortBy) {
//       case "rating":
//         return workers.sort((a, b) => b.rating - a.rating);
//       case "salary-low":
//         return workers.sort((a, b) => a.salary - b.salary);
//       case "salary-high":
//         return workers.sort((a, b) => b.salary - a.salary);
//       case "experience":
//         return workers.sort((a, b) => b.experience - a.experience);
//       default:
//         return workers;
//     }
//   }

//   // دالة لعرض العمال في الصفحة
//   function displayWorkers(workers) {
//     workersResults.innerHTML = ""; // مسح المحتوى القديم

//     if (workers.length === 0) {
//       workersResults.innerHTML = "<p>لا توجد نتائج مطابقة للبحث.</p>";
//       return;
//     }

//     workers.forEach((worker) => {
//       const workerCard = `
//         <div class="worker-card card mb-3">
//           <div class="row g-0">
//             <div class="col-md-3">
//               <img src="images/${worker.image}" class="img-fluid rounded-start" alt="${worker.name}">
//             </div>
//             <div class="col-md-9">
//               <div class="card-body">
//                 <h5 class="card-title">${worker.name}</h5>
//                 <p class="card-text">
//                   <strong>الجنسية:</strong> ${worker.nationality}<br>
//                   <strong>العمر:</strong> ${worker.age}<br>
//                   <strong>الخبرة:</strong> ${worker.experience} سنوات<br>
//                   <strong>الراتب:</strong> ${worker.salary} ريال<br>
//                   <strong>المدينة:</strong> ${worker.location}<br>
//                   <strong>التقييم:</strong> ${worker.rating}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       `;
//       workersResults.insertAdjacentHTML("beforeend", workerCard);
//     });
//   }
// });

document.addEventListener("DOMContentLoaded", function () {
  const workersResults = document.getElementById("workersResults");
  const applyFiltersButton = document.getElementById("applyFilters");
  const sortResults = document.getElementById("sortResults");

  let workersData = [];

  // تحميل بيانات العمال من ملف JSON
  fetch("workers.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("تم تحميل البيانات بنجاح:", data);

      if (!data.workers || data.workers.length === 0) {
        console.warn("تحذير: لا توجد بيانات عمال في ملف JSON.");
        workersResults.innerHTML = "<p>لا توجد بيانات متاحة.</p>";
        return;
      }

      workersData = data.workers;
      console.log("بيانات العمال المحملة:", workersData);

      displayWorkers(workersData); // عرض جميع العمال عند التحميل
    })
    .catch((error) => {
      console.error("حدث خطأ أثناء تحميل البيانات:", error);
      workersResults.innerHTML = "<p>حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى لاحقًا.</p>";
    });

  // تطبيق الفلترة عند النقر على زر "تطبيق الفلترة"
  applyFiltersButton.addEventListener("click", function () {
    const filteredWorkers = filterWorkers(workersData);
    displayWorkers(filteredWorkers);
  });

  // تطبيق الفرز عند تغيير خيارات الفرز
  sortResults.addEventListener("change", function () {
    const filteredWorkers = filterWorkers(workersData);
    const sortedWorkers = sortWorkers(filteredWorkers, sortResults.value);
    displayWorkers(sortedWorkers);
  });

  // دالة لتطبيق الفلترة
  function filterWorkers(workers) {
    const nationality = document.getElementById("nationalityFilter").value;
    const minAge = parseInt(document.getElementById("minAge").value) || 0;
    const maxAge = parseInt(document.getElementById("maxAge").value) || 100;
    const experience = document.getElementById("experienceFilter").value;
    const minSalary = parseInt(document.getElementById("minSalary").value) || 0;
    const maxSalary = parseInt(document.getElementById("maxSalary").value) || 100000;
    const location = document.getElementById("locationFilter").value;

    return workers.filter((worker) => {
      const matchesNationality = nationality ? worker.nationality === nationality : true;
      const matchesAge = worker.age >= minAge && worker.age <= maxAge;
      const matchesExperience = experience ? checkExperience(worker.experience, experience) : true;
      const matchesSalary = worker.salary >= minSalary && worker.salary <= maxSalary;
      const matchesLocation = location ? worker.location === location : true;

      return (
        matchesNationality &&
        matchesAge &&
        matchesExperience &&
        matchesSalary &&
        matchesLocation
      );
    });
  }

  // دالة للتحقق من سنوات الخبرة
  function checkExperience(experience, range) {
    if (range === "1-3") return experience >= 1 && experience <= 3;
    if (range === "4-7") return experience >= 4 && experience <= 7;
    if (range === "8+") return experience >= 8;
    return true;
  }

  // دالة لفرز العمال
  function sortWorkers(workers, sortBy) {
    switch (sortBy) {
      case "rating":
        return workers.sort((a, b) => b.rating - a.rating);
      case "salary-low":
        return workers.sort((a, b) => a.salary - b.salary);
      case "salary-high":
        return workers.sort((a, b) => b.salary - a.salary);
      case "experience":
        return workers.sort((a, b) => b.experience - a.experience);
      default:
        return workers;
    }
  }

  // دالة لعرض العمال في الصفحة
  function displayWorkers(workers) {
    workersResults.innerHTML = ""; // مسح المحتوى القديم

    if (workers.length === 0) {
      workersResults.innerHTML = "<p>لا توجد نتائج مطابقة للبحث.</p>";
      return;
    }

    workers.forEach((worker) => {
      const workerCard = `
        <div class="worker-card card mb-3">
          <div class="row g-0" >
            <div class="col-md-3">
              <img src="images/${worker.image}" class="img-fluid rounded-start" alt="${worker.name}">
            </div>
            <div class="col-md-9">
              <div class="card-body">
                <h5 class="card-title">${worker.name}</h5>
                <p class="card-text">
                  <strong>الجنسية:</strong> ${worker.nationality}<br>
                  <strong>العمر:</strong> ${worker.age}<br>
                  <strong>الخبرة:</strong> ${worker.experience} سنوات<br>
                  <strong>الراتب:</strong> ${worker.salary} ريال<br>
                  <strong>المدينة:</strong> ${worker.location}<br>
                  <strong>التقييم:</strong> ${worker.rating}
                </p>
              </div>
            </div>
          </div>
        </div>
      `;
      workersResults.insertAdjacentHTML("beforeend", workerCard);
    });
  }
});