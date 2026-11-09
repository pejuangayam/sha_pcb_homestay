/* ===================================================================
   Sha PCB Homestay - JavaScript
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ---------------------------------------------------------------
    // 1. Hero Slider
    // ---------------------------------------------------------------
    const slides = document.querySelectorAll('.slides img');
    const dots = document.querySelectorAll('.slider-dot');
    const sliderContainer = document.querySelector('.slider');
    let slideIndex = 0;
    let autoSlideTimer = null;

    function showSlide(index) {
        if (!slides.length) return;
        slideIndex = (index + slides.length) % slides.length;

        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === slideIndex);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === slideIndex);
        });
    }

    window.nextSlide = function () {
        showSlide(slideIndex + 1);
    };

    window.prevSlide = function () {
        showSlide(slideIndex - 1);
    };

    window.goToSlide = function (index) {
        showSlide(index);
    };

    function startAutoSlide() {
        stopAutoSlide();
        autoSlideTimer = setInterval(() => {
            window.nextSlide();
        }, 5000);
    }

    function stopAutoSlide() {
        if (autoSlideTimer) {
            clearInterval(autoSlideTimer);
            autoSlideTimer = null;
        }
    }

    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', stopAutoSlide);
        sliderContainer.addEventListener('mouseleave', startAutoSlide);
        startAutoSlide();
    }

    // ---------------------------------------------------------------
    // 2. Tetingkap Penuh (Lightbox Modal)
    // ---------------------------------------------------------------
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    let galleryImages = [];
    let currentLightboxIndex = 0;

    function refreshGalleryImageList() {
        galleryImages = [];
        // Kumpul semua gambar homestay dan gambar kemudahan sekitar untuk paparan lightbox
        const elements = document.querySelectorAll('.gallery-item img, .room-card img, .feature img, .nearby-img-box img');
        elements.forEach(img => {
            const src = img.getAttribute('src');
            if (src && !galleryImages.includes(src)) {
                galleryImages.push(src);
            }
        });
    }

    refreshGalleryImageList();

    window.openLightbox = function (imageSrc) {
        if (!lightbox || !lightboxImg) return;
        refreshGalleryImageList();

        lightboxImg.src = imageSrc;
        currentLightboxIndex = galleryImages.indexOf(imageSrc);
        if (currentLightboxIndex === -1) {
            currentLightboxIndex = 0;
        }

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeLightbox = function () {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    window.lightboxNext = function () {
        if (!galleryImages.length) return;
        currentLightboxIndex = (currentLightboxIndex + 1) % galleryImages.length;
        lightboxImg.src = galleryImages[currentLightboxIndex];
    };

    window.lightboxPrev = function () {
        if (!galleryImages.length) return;
        currentLightboxIndex = (currentLightboxIndex - 1 + galleryImages.length) % galleryImages.length;
        lightboxImg.src = galleryImages[currentLightboxIndex];
    };

    document.addEventListener('keydown', (e) => {
        if (lightbox && lightbox.classList.contains('active')) {
            if (e.key === 'Escape') window.closeLightbox();
            if (e.key === 'ArrowRight') window.lightboxNext();
            if (e.key === 'ArrowLeft') window.lightboxPrev();
        }
    });

    // ---------------------------------------------------------------
    // 3. Animasi Muncul Semasa Tatal (Intersection Observer)
    // ---------------------------------------------------------------
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // ---------------------------------------------------------------
    // 4. Navigasi Aktif & Klik Lancar
    // ---------------------------------------------------------------
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                targetEl.classList.add('visible');
                targetEl.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
            }
        });
    });

    function highlightNavOnScroll() {
        const scrollPosition = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavOnScroll);
    highlightNavOnScroll();
});
