// frontend_web/public/js/scripts.js

window.addEventListener('DOMContentLoaded', event => {

    // Procura pelo botão de alternar o menu (ID: sidebarToggle)
    // Se você adicionar esse botão no header no futuro, isso vai funcionar.
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
        });
    }

});