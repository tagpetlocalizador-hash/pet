/*************************************************
 * LINKA GIFT
 * etiqueta.js
 *************************************************/

document.addEventListener("DOMContentLoaded", iniciar);

async function iniciar() {

    // Token recebido na URL
    const params = new URLSearchParams(window.location.search);

    const token = params.get("token");

    if (!token) {

        alert("Token não informado.");

        return;

    }

    // Busca os dados da TAG

    const resposta = await apiGet(

        ACTION.BUSCAR_TAG,

        {

            token: token

        }

    );

    if (!resposta.sucesso) {

        alert(resposta.mensagem);

        return;

    }

    // Monta a URL pública

    const url =

        "https://tagpetlocalizador-hash.github.io/pet/?token="

        + token;

    // TOKEN

    document.getElementById("token").innerHTML = token;

    // LINK

    document.getElementById("url").innerHTML = url;

    // QR CODE

    new QRCode(

        document.getElementById("qrcode"),

        {

            text: url,

            width: 230,

            height: 230,

            correctLevel: QRCode.CorrectLevel.H

        }

    );

}
