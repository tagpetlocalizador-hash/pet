/*************************************************
 * PET NFC
 * etiqueta.js
 * Versão 3.0.0
 *************************************************/

let token = "";

/* ===================================================
   INICIALIZAÇÃO
=================================================== */

document.addEventListener("DOMContentLoaded", iniciar);

/* ===================================================
   INICIAR
=================================================== */

async function iniciar() {

    const parametros = new URLSearchParams(window.location.search);

    token = parametros.get("token");

    if (!token) {

        alert("Token não informado.");

        return;

    }

    console.log(Object.keys(tag));

    await carregarEtiqueta();

}

/* ===================================================
   CARREGAR ETIQUETA
=================================================== */

async function carregarEtiqueta() {

    try {

        const resposta = await buscarTag(token);

        console.log("Resposta API:", resposta);

        if (!resposta.sucesso) {

            alert(resposta.mensagem);

            return;

        }

        const tag = resposta.dados;

        console.log("TAG:", tag);

        // TESTE VISUAL
        document.getElementById("token").style.background = "yellow";
        document.getElementById("url").style.background = "lime";
        document.getElementById("qrcode").style.border = "4px solid red";

        const url = CONFIG.URL_SITE + "?token=" + tag.token;

document.getElementById("token").innerHTML = tag.token;

document.getElementById("url").innerHTML = url;

gerarQRCode(url);

    }

    catch (erro) {

        console.error(erro);

        alert("Erro ao carregar etiqueta.");

    }

}

/* ===================================================
   GERAR QR CODE
=================================================== */

function gerarQRCode(url) {

    const div = document.getElementById("qrcode");

    div.innerHTML = "";

    new QRCode(div, {

        text: url,

        width: 170,

        height: 170,

        colorDark: "#000000",

        colorLight: "#ffffff",

        correctLevel: QRCode.CorrectLevel.H

    });

}
