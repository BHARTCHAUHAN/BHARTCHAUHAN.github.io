// ========== GLOBAL VARIABLES ==========
let typed;
let charts = {};

// ========== DOM CONTENT LOADED EVENT ==========
document.addEventListener('DOMContentLoaded', function() {
    initializeTypedJS();
    initializeAOS();
    initializeSkillBars();
    initializeNavigation();
    initializeScrollEffects();
    initializeFormHandling();
});

// ========== TYPED.JS INITIALIZATION ==========
function initializeTypedJS() {
    const typedElement = document.getElementById('typed-element');
    if (typedElement) {
        typed = new Typed('#typed-element', {
            strings: [
                "Data Analyst",
                "BI Specialist",
                "Python Developer",
                "SQL Expert",
                "Power BI Developer"
            ],
            typeSpeed: 70,
            backSpeed: 40,
            backDelay: 2000,
            startDelay: 500,
            loop: true,
            showCursor: true,
            cursorChar: '|',
            smartBackspace: true
        });
    }
}

// ========== AOS (ANIMATE ON SCROLL) INITIALIZATION ==========
function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100,
            easing: 'ease-out-cubic',
            delay: 100
        });
    }
}

// ========== SKILL BARS ANIMATION ==========
function initializeSkillBars() {
    const skillProgressBars = document.querySelectorAll('.skill-progress');
    
    const skillObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.getAttribute('data-width');
                
                setTimeout(() => {
                    bar.style.width = width;
                }, 300);
                
                observer.unobserve(bar);
            }
        });
    }, {
        threshold: 0.5
    });
    
    skillProgressBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

// ========== NAVIGATION FUNCTIONALITY ==========
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navbar = document.querySelector('.navbar');
    const navbarLinks = document.querySelectorAll('.navbar a');
    
    if (hamburger && navbar) {
        hamburger.addEventListener('click', () => {
            navbar.classList.toggle('active');
            const isExpanded = navbar.classList.contains('active');
            hamburger.setAttribute('aria-expanded', isExpanded);
            
            const icon = hamburger.querySelector('i');
            if (isExpanded) {
                icon.classList.replace('bx-menu', 'bx-x');
            } else {
                icon.classList.replace('bx-x', 'bx-menu');
            }
        });
    }
    
    navbarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                if (navbar.classList.contains('active')) {
                    navbar.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                    const hamburgerIcon = document.querySelector('.hamburger i');
                    if (hamburgerIcon) {
                        hamburgerIcon.classList.replace('bx-x', 'bx-menu');
                    }
                }
                
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                updateActiveNavLink(this);
            }
        });
    });
    
    window.addEventListener('scroll', throttle(updateNavOnScroll, 100));
}

// ========== SCROLL EFFECTS ==========
function initializeScrollEffects() {
    const backToTop = document.querySelector('.back-to-top');
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', throttle(() => {
        const scrollY = window.scrollY;
        
        if (backToTop) {
            if (scrollY > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        }
        
        if (header) {
            if (scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        
    }, 10));
    
    if (backToTop) {
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ========== FORM HANDLING (UPDATED) ==========
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');

    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
        const response = await fetch(form.action, {
            method: form.method,
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            submitBtn.textContent = 'Message Sent!';
            submitBtn.style.background = '#22c55e';
            form.reset();
            showNotification('Message sent successfully!', 'success');
        } else {
            throw new Error('Network response was not ok.');
        }

    } catch (error) {
        submitBtn.textContent = 'Try Again';
        submitBtn.style.background = '#ef4444';
        showNotification('Oops! There was a problem submitting your form.', 'error');
        console.error('Form submission error:', error);
    } finally {
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
        }, 3000);
    }
}

function initializeFormHandling() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
}

// ========== UTILITY FUNCTIONS ==========
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

function updateActiveNavLink(activeLink) {
    const navLinks = document.querySelectorAll('.navbar a');
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

function updateNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar a[href^="#"]');
    
    let current = '';
    const headerHeight = document.querySelector('.header').offsetHeight;
    const scrollPosition = window.scrollY + headerHeight;
    
    sections.forEach(section => {
        if (scrollPosition >= section.offsetTop) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: type === 'success' ? '#22c55e' : (type === 'error' ? '#ef4444' : '#3b82f6'),
        color: 'white',
        padding: '15px 20px',
        borderRadius: '8px',
        zIndex: '10000',
        animation: 'slideInUp 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutDown 0.3s ease forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

const additionalStyles = `
    @keyframes slideInUp {
        from { transform: translateY(100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    @keyframes slideOutDown {
        from { transform: translateY(0); opacity: 1; }
        to { transform: translateY(100%); opacity: 0; }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);