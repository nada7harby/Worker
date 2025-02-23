document.addEventListener("DOMContentLoaded", function () {
  // تحميل جميع العمال من ملف workers.json
  fetch("./workers.json")
    .then((response) => response.json())
    .then((data) => {
      var  workers = data.workers;
      localStorage.setItem("searchResults", JSON.stringify(workers));
    });
  setupFilters();
});
