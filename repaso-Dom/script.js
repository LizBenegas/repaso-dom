document.addEventListener('DOMContentLoaded', () => {
    const menuIcon = document.querySelector('.menu-icon');
    const navLinks = document.querySelector('.nav-links');
    const modal = document.getElementById('miModal');
    const imagenAmpliada = document.getElementById('imagenAmpliada');
    const closeButton = document.querySelector('.cerrar');
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const body = document.body;
    const fixedNav = document.querySelector('.fixed-nav');
    let currentIndex = 0;

    // Galería con modal
    const images = document.querySelectorAll('.gallery img');
    images.forEach((img, index) => {
        img.addEventListener('click', e => {
            e.stopPropagation();
            currentIndex = index;
            openModal(img.src);
        });
    });

    function openModal(src) {
        modal.classList.add('active');
        imagenAmpliada.src = src;
    }

    function closeModal() {
        modal.classList.remove('active');
    }

    function showImage(index) {
        if (index >= 0 && index < images.length) {
            imagenAmpliada.src = images[index].src;
            currentIndex = index;
        }
    }

    modal.addEventListener('click', closeModal);

    if (closeButton) {
        closeButton.addEventListener('click', e => {
            e.stopPropagation();
            closeModal();
        });
    }

    document.addEventListener('keydown', (event) => {
        if (modal.classList.contains('active')) {
            if (event.key === 'ArrowRight') {
                event.preventDefault();
                showImage(currentIndex + 1);
            } else if (event.key === 'ArrowLeft') {
                event.preventDefault();
                showImage(currentIndex - 1);
            } else if (event.key === 'Escape') {
                closeModal();
            }
        }
    });

    // Menú hamburguesa
    menuIcon.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuIcon.classList.toggle('open'); // Para animar el ícono
    });

    // Acordeón
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const activeContent = document.querySelector('.accordion-content.active');
            if (activeContent && activeContent !== header.nextElementSibling) {
                activeContent.classList.remove('active');
            }
            header.nextElementSibling.classList.toggle('active');
        });
    });

    // Navegación fija al hacer scroll
    const debounce = (func, wait) => {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    const handleScroll = () => {
        if (window.scrollY > 50) {
            fixedNav.classList.add('scrolled');
        } else {
            fixedNav.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', debounce(handleScroll, 100));

    // Lightbox alternativo (con overlay)
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    document.body.appendChild(lightbox);

    images.forEach(image => {
        image.addEventListener('click', () => {
            lightbox.classList.add('active');
            const img = document.createElement('img');
            img.src = image.src;
            while (lightbox.firstChild) {
                lightbox.removeChild(lightbox.firstChild);
            }
            lightbox.appendChild(img);
        });
    });

    lightbox.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    // Modo oscuro
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        body.classList.add(currentTheme);
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const theme = body.classList.contains('dark-mode') ? 'dark-mode' : '';
            localStorage.setItem('theme', theme);
        });
    }
});