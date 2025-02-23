document.addEventListener('DOMContentLoaded', function() {
    loadFAQs();
    setupSupportForm();
});

function loadFAQs() {
    // تحميل الأسئلة الشائعة
    const faqs = [
        {
            question: "كيف يمكنني حجز عامل؟",
            answer: "يمكنك البحث عن العامل المناسب واختياره ثم اتباع خطوات الحجز"
        },
        // المزيد من الأسئلة...
    ];
    
    const accordion = document.getElementById('faqAccordion');
    accordion.innerHTML = faqs.map((faq, index) => `
        <div class="accordion-item">
            <h3 class="accordion-header">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faq${index}">
                    ${faq.question}
                </button>
            </h3>
            <div id="faq${index}" class="accordion-collapse collapse">
                <div class="accordion-body">
                    ${faq.answer}
                </div>
            </div>
        </div>
    `).join('');
}

function setupSupportForm() {
    const form = document.getElementById('supportForm');
    form.innerHTML = `
        <div class="row g-3">
            <div class="col-md-6">
                <label class="form-label">الاسم</label>
                <input type="text" class="form-control" required>
            </div>
            <div class="col-md-6">
                <label class="form-label">البريد الإلكتروني</label>
                <input type="email" class="form-control" required>
            </div>
            <div class="col-12">
                <label class="form-label">الموضوع</label>
                <select class="form-select" required>
                    <option value="">اختر الموضوع</option>
                    <option value="booking">مشكلة في الحجز</option>
                    <option value="payment">مشكلة في الدفع</option>
                    <option value="technical">مشكلة تقنية</option>
                    <option value="other">أخرى</option>
                </select>
            </div>
            <div class="col-12">
                <label class="form-label">الرسالة</label>
                <textarea class="form-control" rows="5" required></textarea>
            </div>
            <div class="col-12">
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-paper-plane"></i> إرسال
                </button>
            </div>
        </div>
    `;

    form.addEventListener('submit', handleSupportForm);
}

function handleSupportForm(e) {
    e.preventDefault();
    // معالجة النموذج وإرسال البيانات
    showAlert('success', 'تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.');
    e.target.reset();
} 