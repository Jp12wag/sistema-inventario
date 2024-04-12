import React from "react";
import '../stylesheet/Footer.css'

function Footer() {
    console.log("Footer Iniciado");

    return (
        <div class="contenedor-footer">
            <footer class="footer">
                <p class="texto-footer"><i class="fa-regular fa-copyright" />© Todos los derechos reservados a los creadores de LogiVault</p>
            </footer>
        </div>
    );


}

export default Footer;