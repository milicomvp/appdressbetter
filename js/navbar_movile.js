document.addEventListener('DOMContentLoaded', function () {
    // Selecciona todos los enlaces en el navbar
    var navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            // Cierra el navbar después de hacer clic en un enlace
            var navbarToggler = document.querySelector('.navbar-toggler');
            if (navbarToggler.classList.contains('collapsed')) {
                return; // El navbar ya está cerrado, no hacemos nada
            }
            navbarToggler.click();
        });
    });
});