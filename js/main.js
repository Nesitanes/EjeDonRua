document.addEventListener('DOMContentLoaded', () => {
    // 1. Menú hamburguesa para dispositivos móviles
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // 2. Actualizar año automático en el footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 3. Carrusel de imágenes en productos (Hover en PC + Swipe/Táctil en móvil)
    const carousels = document.querySelectorAll('.product-carousel');

    carousels.forEach(carousel => {
        const images = carousel.querySelectorAll('.card-img');
        const prevBtn = carousel.querySelector('.prev');
        const nextBtn = carousel.querySelector('.next');
        const dotsContainer = carousel.querySelector('.carousel-dots');

        // Si solo hay 1 imagen, ocultamos flechas y no activamos carrusel
        if (images.length <= 1) {
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            return;
        }

        let currentIndex = 0;
        let hoverInterval = null;

        // Crear puntitos indicadores dinámicamente según la cantidad de fotos
        images.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (index === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Ver imagen ${index + 1}`);
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                showImage(index);
            });
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.carousel-dot');

        function showImage(index) {
            images[currentIndex].classList.remove('active');
            dots[currentIndex].classList.remove('active');

            currentIndex = (index + images.length) % images.length;

            images[currentIndex].classList.add('active');
            dots[currentIndex].classList.add('active');
        }

        // Botones Anterior / Siguiente
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showImage(currentIndex - 1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showImage(currentIndex + 1);
            });
        }

        // Rotación automática al pasar el mouse por encima (Computadora)
        carousel.addEventListener('mouseenter', () => {
            // Cambia a la siguiente foto tras 800ms y sigue rotando cada 1.4 segundos
            hoverInterval = setInterval(() => {
                showImage(currentIndex + 1);
            }, 1400);
        });

        carousel.addEventListener('mouseleave', () => {
            clearInterval(hoverInterval);
            showImage(0); // Regresa a la foto principal al quitar el mouse
        });

        // Soporte para deslizar el dedo (Swipe en Teléfonos)
        let touchStartX = 0;
        let touchEndX = 0;

        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const swipeDistance = touchStartX - touchEndX;

            if (swipeDistance > 40) {
                // Deslizó hacia la izquierda -> siguiente foto
                showImage(currentIndex + 1);
            } else if (swipeDistance < -40) {
                // Deslizó hacia la derecha -> foto anterior
                showImage(currentIndex - 1);
            }
        }, { passive: true });
    });

    // Cambiar texto del logo según el ancho de pantalla
    const logo = document.querySelector('.logo');
    function actualizarLogo() {
        if (!logo) return;
        if (window.innerWidth <= 900) {
            logo.textContent = 'EJE';
        } else {
            logo.textContent = 'Encuentro de Jóvenes con el Espíritu';
        }
    }
    actualizarLogo();
    window.addEventListener('resize', actualizarLogo);
});