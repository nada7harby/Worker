document.addEventListener('DOMContentLoaded', function() {
    // التعامل مع نموذج تسجيل الدخول
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // زر إظهار/إخفاء كلمة المرور
    const togglePassword = document.getElementById('togglePassword');
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const passwordInput = this.parentElement.querySelector('input[type="password"], input[type="text"]');
            const icon = this.querySelector('i');
            
            if (passwordInput && icon) {
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    passwordInput.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            }
        });
    }
});

async function handleLogin(e) {
    e.preventDefault();
    
    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('input[type="password"]').value;
    const rememberMe = e.target.querySelector('#rememberMe').checked;

    // التحقق من صحة البريد الإلكتروني وكلمة المرور
    if (!validateEmail(email)) {
        alert('يرجى إدخال بريد إلكتروني صحيح.');
        return;
    }
    if (!validatePassword(password)) {
        alert('يجب أن تكون كلمة المرور على الأقل 8 أحرف، تحتوي على حرف كبير، حرف صغير ورقم.');
        return;
    }
    
    try {
        const userData = {
            email,
            password,
            rememberMe
        };
        
        // تخزين بيانات المستخدم في sessionStorage بدلاً من localStorage
        sessionStorage.setItem('userData', JSON.stringify(userData));
        
        // توجيه المستخدم إلى لوحة التحكم
        window.location.href = 'dashboard.html';
        
    } catch (error) {
        console.error('خطأ في تسجيل الدخول:', error);
        alert('حدث خطأ في تسجيل الدخول. يرجى المحاولة مرة أخرى.');
    }
}

// التحقق من حالة تسجيل الدخول
function checkAuthStatus() {
    const userData = sessionStorage.getItem('userData');
    if (!userData) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// تسجيل الخروج
function logout() {
    sessionStorage.removeItem('userData');
    window.location.href = 'login.html';
}

// التعامل مع نموذج التسجيل
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
}

async function handleRegister(e) {
    e.preventDefault();
    
    // جمع بيانات النموذج
    const formData = {
        accountType: e.target.querySelector('input[name="accountType"]:checked').value,
        firstName: e.target.querySelector('input[type="text"]').value,
        lastName: e.target.querySelectorAll('input[type="text"]')[1].value,
        email: e.target.querySelector('input[type="email"]').value,
        phone: e.target.querySelector('input[type="tel"]').value,
        password: e.target.querySelector('input[type="password"]').value,
        confirmPassword: e.target.querySelectorAll('input[type="password"]')[1].value
    };

    // التحقق من صحة البريد الإلكتروني وكلمة المرور
    if (!validateEmail(formData.email)) {
        alert('يرجى إدخال بريد إلكتروني صحيح.');
        return;
    }
    if (!validatePassword(formData.password)) {
        alert('يجب أن تكون كلمة المرور على الأقل 8 أحرف، تحتوي على حرف كبير، حرف صغير ورقم.');
        return;
    }
    
    try {
        // التحقق من تطابق كلمتي المرور
        if (formData.password !== formData.confirmPassword) {
            throw new Error('كلمتا المرور غير متطابقتين');
        }
        
        // تخزين بيانات المستخدم في localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        users.push(formData);
        localStorage.setItem('users', JSON.stringify(users));
        
        // تسجيل الدخول تلقائياً
        sessionStorage.setItem('userData', JSON.stringify({
            email: formData.email,
            accountType: formData.accountType
        }));
        
        // توجيه المستخدم إلى لوحة التحكم المناسبة
        if (formData.accountType === 'client') {
            window.location.href = 'client-dashboard.html';
        } else {
            window.location.href = 'provider-dashboard.html';
        }
        
    } catch (error) {
        console.error('خطأ في التسجيل:', error);
        alert(error.message || 'حدث خطأ في التسجيل. يرجى المحاولة مرة أخرى.');
    }
}

// التحقق من صحة البريد الإلكتروني
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// التحقق من قوة كلمة المرور
function validatePassword(password) {
    // على الأقل 8 أحرف، حرف كبير، حرف صغير، رقم
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return re.test(password);
}