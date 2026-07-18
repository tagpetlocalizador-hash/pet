/*************************************************
 * PET NFC
 * etiqueta.js
 * Versão 1.0.0
 *************************************************/

let token = "";

/* ==========================================
   INICIALIZAÇÃO
========================================== */

document.addEventListener("DOMContentLoaded", iniciar);

/* ==========================================
   INICIAR
========================================== */

async function iniciar() {

    const parametros = new URLSearchParams(window.location.search);

    token = parametros.get("token");

    if (!token) {

        alert("Token não informado.");

        return;

    }

    carregarEtiqueta();

}

/* ==========================================
   CARREGA DADOS
========================================== */

async function carregarEtiqueta() {

    const resposta = await buscarTag(token);

    if (!resposta.sucesso) {

        alert(resposta.mensagem);

        return;

    }

    const tag = resposta.dados;

    document.getElementById("token").innerText =
        tag.token;

    document.getElementById("url").innerText =
        CONFIG.URL_SITE + "?token=" + tag.token;

    gerarQRCode(

        CONFIG.URL_SITE + "?token=" + tag.token

    );

}

/* ==========================================
   QR CODE
========================================== */

function gerarQRCode(url) {

    const div = document.getElementById("qrcode");

    div.innerHTML = "";

    new QRCode(div, {

        text: url,

        width: 170,

        height: 170,

        correctLevel: QRCode.CorrectLevel.H

    });

}
