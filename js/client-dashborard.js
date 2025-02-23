function logout() {
  Swal.fire({
    title: "تسجيل الخروج",
    text: "هل أنت متأكد أنك تريد تسجيل الخروج؟",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "نعم، سجل الخروج",
    cancelButtonText: "إلغاء",
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
  }).then((result) => {
    if (result.isConfirmed) {
      // إزالة بيانات الجلسة (إذا كنت تستخدم localStorage أو sessionStorage)
      //   localStorage.removeItem("userToken");
      //   localStorage.removeItem("userData");

      // عرض رسالة نجاح
      Swal.fire({
        title: "تم تسجيل الخروج!",
        text: "تم تسجيل خروجك بنجاح.",
        icon: "success",
        confirmButtonText: "حسنًا",
      }).then(() => {
        // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول
        window.location.href = "login.html";
      });
    }
  });
}

function showDetails(workerName, serviceType, workerRating, additionalDetails) {
  // ملء البيانات في الـ Modal
  document.getElementById("workerName").textContent = workerName;
  document.getElementById("serviceType").textContent = serviceType;
  document.getElementById("workerRating").textContent = workerRating;
  document.getElementById("additionalDetails").textContent = additionalDetails;

  // عرض الـ Modal
  const detailsModal = new bootstrap.Modal(
    document.getElementById("detailsModal")
  );
  detailsModal.show();
}

// دالة إزالة من المفضلة
// دالة إزالة من المفضلة
function removeFromFavorites(event, workerId) {
  event.preventDefault(); // منع السلوك الافتراضي

  Swal.fire({
    title: "هل أنت متأكد؟",
    text: "هل تريد إزالة هذا العامل من المفضلة؟",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "نعم، أزلة من المفضلة",
    cancelButtonText: "إلغاء",
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
  }).then((result) => {
    if (result.isConfirmed) {
      // إزالة الصف من الجدول
      const workerRow = document.querySelector(
        `tr[data-worker-id="${workerId}"]`
      );
      if (workerRow) {
        workerRow.remove(); // إزالة الصف من DOM
      }

      // عرض رسالة نجاح
      Swal.fire(
        "تمت الإزالة!",
        "تمت إزالة العامل من المفضلة بنجاح.",
        "success"
      );
    }
  });
}

function updateOrderStatus(workerId, newStatus) {
  const workerRow = document.querySelector(`tr[data-worker-id="${workerId}"]`);
  if (workerRow) {
    const statusCell = workerRow.querySelector(".worker-status");
    if (statusCell) {
      // تحديث الحالة إلى "ملغي"
      statusCell.innerHTML = `<span class="badge bg-danger">${newStatus}</span>`;
    }

    // إخفاء زر "إزالة من المفضلة" بعد الإلغاء
    const removeButton = workerRow.querySelector(".btn-danger");
    if (removeButton) {
      removeButton.style.display = "none";
    }
  }
}
console.log("kkkkk");
function cancelOrder(event, orderId) {
  event.preventDefault(); // منع السلوك الافتراضي

  Swal.fire({
    title: "هل أنت متأكد؟",
    text: "هل تريد إلغاء هذا الطلب؟",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "نعم، ألغِاء الطلب",
    cancelButtonText: "إلغاء",
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
  }).then((result) => {
    if (result.isConfirmed) {
      // تحديث حالة الطلب إلى "ملغي"
      updateOrderStatus(orderId, "ملغي");

      // عرض رسالة نجاح
      Swal.fire("تم الإلغاء!", "تم إلغاء الطلب بنجاح.", "success");
    }
  });
} // دالة لتحديث حالة الطلب
function updateOrderStatus(orderId, newStatus) {
  // هنا يمكنك إرسال طلب إلى الخادم لتحديث حالة الطلب
  // في هذا المثال، سنقوم بتحديث الحالة محليًا فقط
  const orderRow = document.querySelector(`tr[data-order-id="${orderId}"]`);
  if (orderRow) {
    const statusCell = orderRow.querySelector(".order-status");
    if (statusCell) {
      statusCell.innerHTML = `<span class="badge bg-danger">${newStatus}</span>`;
    }
  }
}

function showDetails(
  orderId,
  serviceType,
  orderDate,
  orderStatus,
  additionalDetails
) {
  // ملء البيانات في الـ Modal
  document.getElementById("orderId").textContent = orderId;
  document.getElementById("serviceType").textContent = serviceType;
  document.getElementById("orderDate").textContent = orderDate;

  // تحديث الحالة مع الـ Badge
  const statusElement = document.getElementById("orderStatus");
  statusElement.innerHTML =
    orderStatus === "قيد التنفيذ"
      ? '<span class="badge bg-warning">قيد التنفيذ</span>'
      : '<span class="badge bg-success">مكتمل</span>';

  document.getElementById("additionalDetails").textContent = additionalDetails;

  // عرض الـ Modal
  const detailsModal = new bootstrap.Modal(
    document.getElementById("detailsModal")
  );
  detailsModal.show();
}

function loadBookings() {
  // الحصول على البيانات من localStorage
  const bookings = JSON.parse(localStorage.getItem("bookings")) || [];

  // الحصول على عنصر tbody في جدول الطلبات
  const tbody = document.querySelector("#requests tbody");

  // مسح المحتوى الحالي للجدول
  tbody.innerHTML = "";

  // إضافة كل طلب إلى الجدول
  bookings.forEach((booking) => {
    const row = document.createElement("tr");
    row.setAttribute("data-order-id", booking.id);

    row.innerHTML = `
                   <td>#${booking.id}</td>
                   <td>${booking.serviceType || booking.category}</td>
                   <td>${booking.orderDate}</td>
                   <td class="order-status">
                     <span class="badge ${
                       booking.status === "قيد التنفيذ"
                         ? "bg-warning"
                         : "bg-success"
                     }">${booking.status}</span>
                   </td>
                   <td>
                     <button class="btn btn-primary btn-sm" onclick="showDetails('${
                       booking.id
                     }', '${booking.serviceType || booking.category}', '${
      booking.orderDate
    }', '${booking.status}', '${booking.additionalDetails}')">
                       عرض التفاصيل
                     </button>
                     <button class="btn btn-danger btn-sm" onclick="cancelOrder(event, '${
                       booking.id
                     }')">
                       إلغاء الطلب
                     </button>
                   </td>
                 `;

    tbody.appendChild(row);
  });
}
// تحميل الطلبات عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", loadBookings);
// const sampleBookings =JSON.parse(localStorage.getItem("bookings")) || [];;

// localStorage.setItem("bookings", JSON.stringify(sampleBookings));

document.addEventListener("DOMContentLoaded", loadBookings);
