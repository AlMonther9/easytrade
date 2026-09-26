/**
 * EasyTrade — سكربت مشترك لكل الصفحات
 * كل دالة بتشتغل بس لو عناصرها موجودة في الصفحة، فالملف آمن على أي صفحة.
 */
document.addEventListener('DOMContentLoaded', () => {
    initRolePicker();
    initPasswordToggles();
    initStubForms();
});

/** اختيار الدور: كليك + كيبورد (Enter / Space) + تحديث aria-checked */
function initRolePicker() {
    const options = Array.from(document.querySelectorAll('.role-option'));
    if (!options.length) return;

    const select = (chosen) => {
        options.forEach((option) => {
            const on = option === chosen;
            option.classList.toggle('selected', on);
            option.setAttribute('aria-checked', String(on));
        });
    };

    options.forEach((option) => {
        option.addEventListener('click', () => select(option));
        option.addEventListener('keydown', (e) => {
            if (e.key !== 'Enter' && e.key !== ' ') return;
            e.preventDefault();
            select(option);
        });
    });
}

/** إظهار/إخفاء كلمة السر — الزرار بيشير لـ id الحقل في data-toggle-password */
function initPasswordToggles() {
    document.querySelectorAll('[data-toggle-password]').forEach((btn) => {
        const input = document.getElementById(btn.dataset.togglePassword);
        if (!input) return;

        btn.addEventListener('click', () => {
            const revealing = input.type === 'password';
            input.type = revealing ? 'text' : 'password';
            btn.classList.toggle('is-visible', revealing);
            btn.setAttribute('aria-pressed', String(revealing));
            btn.setAttribute('aria-label', revealing ? 'Hide password' : 'Show password');
        });
    });
}

/**
 * الفورمات لسه موصولة بسيرفر.
 * data-stub  : بمانع إعادة التحميل. لو فيه قيمة بتظهر كرسالة رجوع.
 * data-redirect: بعد الإرسال يروح على الصفحة دي.
 */
function initStubForms() {
    document.querySelectorAll('form[data-stub]').forEach((form) => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const redirect = form.getAttribute('data-redirect');
            if (redirect) {
                window.location.href = redirect;
                return;
            }

            const message = form.getAttribute('data-stub');
            if (!message) return;

            let feedback = form.parentElement.querySelector('.form-feedback');
            if (!feedback) {
                feedback = document.createElement('p');
                feedback.className = 'form-feedback';
                feedback.setAttribute('role', 'status');
                form.insertAdjacentElement('afterend', feedback);
            }

            feedback.textContent = message;
            form.reset();
        });
    });
}
