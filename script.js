// ============ Navigation Scroll Effect ============
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ============ Mobile Menu Toggle ============
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ============ Active Navigation Link on Scroll ============
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ============ Counter Animation ============
const counters = document.querySelectorAll('.counter');
const speed = 200;

const animateCounter = (counter) => {
    const target = +counter.getAttribute('data-target');
    const count = +counter.innerText;
    const inc = target / speed;
    
    if (count < target) {
        counter.innerText = Math.ceil(count + inc);
        setTimeout(() => animateCounter(counter), 10);
    } else {
        counter.innerText = target;
    }
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

counters.forEach(counter => {
    counterObserver.observe(counter);
});

// ============ Gallery Filter ============
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        galleryItems.forEach(item => {
            if (filter === 'all' || item.getAttribute('data-category') === filter) {
                item.classList.remove('hidden');
                item.style.animation = 'fadeIn 0.5s ease';
            } else {
                item.classList.add('hidden');
            }
        });
    });
});

// ============ Hours status (Asia/Damascus) ============
const hoursStatus = document.getElementById('hoursStatus');
if (hoursStatus) {
    const weekday = new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        timeZone: 'Asia/Damascus'
    }).format(new Date());
    const closed = weekday === 'Fri';
    hoursStatus.textContent = closed ? 'مغلق الآن — يوم الجمعة' : 'مفتوح الآن — على مدار الساعة';
    hoursStatus.classList.add(closed ? 'closed' : 'open');
}

// ============ Copy buttons ============
const copyToast = document.getElementById('copyToast');
let toastTimer;

document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
        const value = btn.getAttribute('data-copy');
        try {
            await navigator.clipboard.writeText(value);
        } catch (err) {
            const area = document.createElement('textarea');
            area.value = value;
            document.body.appendChild(area);
            area.select();
            document.execCommand('copy');
            area.remove();
        }
        btn.classList.add('copied');
        const label = btn.querySelector('span');
        const previous = label.textContent;
        label.textContent = 'تم';
        copyToast.textContent = 'تم نسخ ' + value;
        copyToast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            copyToast.classList.remove('show');
            btn.classList.remove('copied');
            label.textContent = previous;
        }, 1600);
    });
});

// ============ WhatsApp number picker ============
const waModal = document.getElementById('waModal');

document.querySelectorAll('.open-whatsapp').forEach(btn => {
    btn.addEventListener('click', () => {
        waModal.hidden = false;
        document.body.style.overflow = 'hidden';
    });
});

waModal.querySelectorAll('[data-close-wa]').forEach(el => {
    el.addEventListener('click', () => {
        waModal.hidden = true;
        document.body.style.overflow = '';
    });
});

waModal.querySelectorAll('.wa-list a').forEach(link => {
    link.addEventListener('click', () => {
        waModal.hidden = true;
        document.body.style.overflow = '';
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !waModal.hidden) {
        waModal.hidden = true;
        document.body.style.overflow = '';
    }
});

// ============ Contact Form ============
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const COMPANY_EMAIL = 'hazmkyaly1980@gmail.com';

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const submitLabel = submitBtn.querySelector('span');
    const selectedText = (field) => {
        const option = field.selectedOptions[0];
        return option && option.value ? option.textContent.trim() : '';
    };

    const payload = new FormData();
    payload.append('الاسم', contactForm.name.value.trim());
    payload.append('الشركة', contactForm.company.value.trim());
    payload.append('البريد', contactForm.email.value.trim());
    payload.append('الجوال', contactForm.phone.value.trim());
    payload.append('الخدمة', selectedText(contactForm.service));
    payload.append('الكمية', contactForm.quantity.value.trim());
    payload.append('المعدن', selectedText(contactForm.material));
    payload.append('التفاصيل', contactForm.message.value.trim());
    payload.append('_subject', 'طلب جديد من موقع الكيالي');
    payload.append('_template', 'table');
    payload.append('_captcha', 'false');
    payload.append('_replyto', contactForm.email.value.trim());

    const file = contactForm.attachment.files[0];
    if (file) payload.append('attachment', file);

    submitBtn.disabled = true;
    submitLabel.textContent = 'جارٍ الإرسال...';
    formStatus.className = 'form-status';
    formStatus.textContent = '';

    try {
        const response = await fetch(`https://formsubmit.co/ajax/${COMPANY_EMAIL}`, {
            method: 'POST',
            headers: { Accept: 'application/json' },
            body: payload
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || result.success === 'false') {
            throw new Error(result.message || 'send failed');
        }
        formStatus.classList.add('success');
        formStatus.textContent = 'تم إرسال طلبك إلى بريد الشركة. سنتواصل معك قريباً.';
        contactForm.reset();
    } catch (err) {
        formStatus.classList.add('error');
        formStatus.textContent = 'تعذر إرسال الرسالة الآن. أعد المحاولة، أو راسلنا مباشرة على البريد.';
    } finally {
        submitBtn.disabled = false;
        submitLabel.textContent = 'إرسال الطلب';
    }
});

// ============ Scroll Animation (Intersection Observer) ============
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .product-card, .gallery-item, .feature, .contact-item, .process-step').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ============ Smooth Scroll ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============ Replay Pouring Animation on Scroll to Top ============
let pouringAnimated = false;
window.addEventListener('scroll', () => {
    if (window.scrollY < 100 && !pouringAnimated) {
        const crucible = document.querySelector('.crucible');
        const pourStream = document.querySelector('.pour-stream');
        const cavityFills = document.querySelectorAll('.cavity-fill');
        
        if (crucible) {
            crucible.style.animation = 'none';
            setTimeout(() => {
                crucible.style.animation = '';
            }, 10);
        }
        
        if (pourStream) {
            pourStream.style.animation = 'none';
            setTimeout(() => {
                pourStream.style.animation = '';
            }, 10);
        }
        
        cavityFills.forEach(fill => {
            fill.style.animation = 'none';
            setTimeout(() => {
                fill.style.animation = '';
            }, 10);
        });
        
        pouringAnimated = true;
        setTimeout(() => {
            pouringAnimated = false;
        }, 7000);
    }
});

// ============ Add glow effect to service icons on hover ============
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.service-icon');
        if (icon) {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
        }
    });
    
    card.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.service-icon');
        if (icon) {
            icon.style.transform = 'scale(1) rotate(0deg)';
        }
    });
});

// ============ Parallax effect for hero particles ============
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const particles = document.querySelectorAll('.particle');
    
    particles.forEach((particle, index) => {
        const speed = 0.5 + (index * 0.1);
        particle.style.transform = `translateY(${scrolled * speed}px)`;
    });
});