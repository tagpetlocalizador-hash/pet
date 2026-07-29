/*************************************************
 * PET NFC ADMIN
 * admin-auth.js
 *************************************************/

async function protegerPaginaAdmin() {

    const tokenAdmin =
        sessionStorage.getItem(
            "pet_nfc_admin_token"
        );


    if (!tokenAdmin) {

        window.location.href =
            "login.html";

        return;

    }


    const resposta =
        await validarLoginAdmin(
            tokenAdmin
        );


    if (!resposta.sucesso) {

        sessionStorage.removeItem(
            "pet_nfc_admin_token"
        );

        window.location.href =
            "login.html";

        return;

    }

}


protegerPaginaAdmin();
