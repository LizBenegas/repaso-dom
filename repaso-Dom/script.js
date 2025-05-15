document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM necesarios
    const menuIcon = document.querySelector('.menu-icon');              // Ícono del menú hamburguesa
    const navLinks = document.querySelector('.nav-links');              // Enlaces de navegación
    const modal = document.getElementById('miModal');                   // Modal para galería
    const imagenAmpliada = document.getElementById('imagenAmpliada');  // Imagen dentro del modal
    const closeButton = document.querySelector('.cerrar');             // Botón para cerrar modal
    const darkModeToggle = document.querySelector('.dark-mode-toggle');// Botón para modo oscuro
    const body = document.body;                                        // Cuerpo del documento
    const fixedNav = document.querySelector('.navbar');                // Barra de navegación fija
    let currentIndex = 0;                                              // Índice actual para galería

    // Galería con modal - permite abrir imágenes en modal
    const images = document.querySelectorAll('.gallery img');
    images.forEach((img, index) => {
        img.addEventListener('click', e => {
            e.stopPropagation(); // Evita que se propague el evento
            currentIndex = index;
            openModal(img.src); // Abre el modal con la imagen seleccionada
        });
    });

    // Función para abrir el modal con la imagen dada
    function openModal(src) {
        modal.classList.add('active');
        imagenAmpliada.src = src;
    }

    // Función para cerrar el modal
    function closeModal() {
        modal.classList.remove('active');
    }

    // Muestra imagen siguiente o anterior según el índice
    function showImage(index) {
        if (index >= 0 && index < images.length) {
            imagenAmpliada.src = images[index].src;
            currentIndex = index;
        }
    }

    // Cierra el modal al hacer clic fuera de la imagen
    modal.addEventListener('click', closeModal);

    // Botón de cerrar modal (evita que se cierre si se hace clic sobre el botón solamente)
    if (closeButton) {
        closeButton.addEventListener('click', e => {
            e.stopPropagation(); // Evita cerrar el modal si haces clic en el botón
            closeModal();
        });
    }

    // Navegación con teclas (izquierda/derecha para cambiar imagen, ESC para cerrar)
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

    // Menú hamburguesa - alterna la visibilidad del menú
    menuIcon.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuIcon.classList.toggle('open'); // Cambia apariencia del ícono
    });

    // Acordeón - permite expandir/colapsar secciones
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const activeContent = document.querySelector('.accordion-content.active');
            // Cierra otro acordeón si está abierto
            if (activeContent && activeContent !== header.nextElementSibling) {
                activeContent.classList.remove('active');
            }
            // Abre o cierra el contenido correspondiente
            header.nextElementSibling.classList.toggle('active');
        });
    });

    // Función debounce
    const debounce = (func, wait) => {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    // Añade clase cuando se hace scroll hacia abajo
    const handleScroll = () => {
        if (window.scrollY > 50) {
            fixedNav.classList.add('scrolled');
        } else {
            fixedNav.classList.remove('scrolled');
        }
    };

    // Cambia color mientras se hace scroll (por ejemplo, añadiendo una clase)
    const handleScrollActive = () => {
        fixedNav.classList.add('scrolling');
        // Opcional: quitar clase después de que se detiene el scroll
        debounceRemoveScrolling();
    };

    // Quitar la clase "scrolling" después de detenerse
    const debounceRemoveScrolling = debounce(() => {
        fixedNav.classList.remove('scrolling');
    }, 150); // tiempo en milisegundos tras detenerse

    // Escuchar el scroll
    window.addEventListener('scroll', () => {
        handleScroll(); // aplica clase fija con scroll
        handleScrollActive(); // cambia color mientras se hace scroll
    });

    // Lightbox alternativo - crea un overlay para mostrar la imagen ampliada
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    document.body.appendChild(lightbox);

    images.forEach(image => {
        image.addEventListener('click', () => {
            lightbox.classList.add('active');
            const img = document.createElement('img');
            img.src = image.src;
            // Elimina cualquier imagen anterior en el lightbox
            while (lightbox.firstChild) {
                lightbox.removeChild(lightbox.firstChild);
            }
            lightbox.appendChild(img);
        });
    });

    // Cierra el lightbox al hacer clic sobre él
    lightbox.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    // Modo oscuro - recuerda el estado con localStorage
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        body.classList.add(currentTheme); // Aplica el tema guardado
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode'); // Cambia el tema
            const theme = body.classList.contains('dark-mode') ? 'dark-mode' : '';
            localStorage.setItem('theme', theme); // Guarda la preferencia
        });
    }
});