document.addEventListener('DOMContentLoaded', function() {
    loadSettingsContent();
    setupEventListeners();
});

function loadSettingsContent() {
    const hash = window.location.hash || '#account';
    loadSection(hash);
}

function setupEventListeners() {
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('href');
            loadSection(section);
        });
    });
}

function loadSection(sectionId) {
    const content = document.querySelector('.settings-content');
    
    // تحديث القائمة النشطة
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === sectionId) {
            item.classList.add('active');
        }
    });
    
    // تحميل المحتوى المناسب
    switch(sectionId) {
        case '#account':
            content.innerHTML = `
                <h4>إعدادات الحساب</h4>
                <form id="accountForm">
                    <div class="mb-3">
                        <label class="form-label">اسم المستخدم</label>
                        <input type="text" class="form-control" value="اسم المستخدم">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">البريد الإلكتروني</label>
                        <input type="email" class="form-control" value="user@example.com">
                    </div>
                    <button type="submit" class="btn btn-primary">حفظ التغييرات</button>
                </form>
            `;
            break;
            
        case '#notifications':
            content.innerHTML = `
                <h4>إعدادات الإشعارات</h4>
                <div class="notification-settings">
                    <div class="form-check form-switch mb-3">
                        <input class="form-check-input" type="checkbox" id="emailNotif" checked>
                        <label class="form-check-label" for="emailNotif">
                            إشعارات البريد الإلكتروني
                        </label>
                    </div>
                    <div class="form-check form-switch mb-3">
                        <input class="form-check-input" type="checkbox" id="smsNotif">
                        <label class="form-check-label" for="smsNotif">
                            إشعارات الرسائل النصية
                        </label>
                    </div>
                </div>
            `;
            break;
            
        case '#privacy':
            content.innerHTML = `
                <h4>الخصوصية والأمان</h4>
                <form id="privacyForm">
                    <div class="mb-3">
                        <label class="form-label">كلمة المرور الحالية</label>
                        <input type="password" class="form-control">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">كلمة المرور الجديدة</label>
                        <input type="password" class="form-control">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">تأكيد كلمة المرور</label>
                        <input type="password" class="form-control">
                    </div>
                    <button type="submit" class="btn btn-primary">تحديث كلمة المرور</button>
                </form>
            `;
            break;
            
        case '#payment':
            content.innerHTML = `
                <h4>طرق الدفع</h4>
                <div class="payment-methods">
                    <div class="saved-cards">
                        <!-- البطاقات المحفوظة -->
                    </div>
                    <button class="btn btn-outline-primary mt-3">
                        <i class="fas fa-plus"></i> إضافة بطاقة جديدة
                    </button>
                </div>
            `;
            break;
    }
} 