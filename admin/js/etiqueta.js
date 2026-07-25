/*************************************************
 * PET NFC
 * etiqueta.js
 * Etiqueta individual
 *************************************************/


document.addEventListener(
    "DOMContentLoaded",
    carregarEtiqueta
);


/* ===================================================
   CARREGAR ETIQUETA
=================================================== */

async function carregarEtiqueta() {

    const mensagem =
        document.getElementById("mensagem");

    const folha =
        document.getElementById("folha");


    const parametros =
        new URLSearchParams(
            window.location.search
        );


    const token =
        String(
            parametros.get("token") || ""
        ).trim();


    if (!token) {

        mostrarErro(
            "Token da TAG não informado."
        );

        return;

    }


    /*
     * Primeiro tenta buscar os dados completos
     * da TAG no Apps Script.
     */

    const resposta =
        await buscarTag(token);


    if (
        !resposta ||
        resposta.sucesso === false
    ) {

        mostrarErro(

            resposta && resposta.mensagem
                ? resposta.mensagem
                : "Não foi possível carregar a TAG."

        );

        return;

    }


    /*
     * Compatibilidade com diferentes formatos
     * de resposta do Apps Script:
     *
     * resposta.token
     * resposta.dados.token
     * resposta.tag.token
     */

    const dados =
        resposta.dados ||
        resposta.tag ||
        resposta;


    const tokenTag =
        String(
            dados.token ||
            dados.TOKEN ||
            token
        ).trim();


    const codigoAtivacao =
        String(

            dados.codigo_ativacao ||

            dados.CODIGO_ATIVACAO ||

            dados.codigoAtivacao ||

            "-"

        ).trim();


    /*
     * URL pública da TAG.
     *
     * Exemplo:
     * https://tagpetlocalizador-hash.github.io/pet/?token=...
     */

    const urlPublica =
        criarUrlPublica(tokenTag);


    try {

    await preencherEtiqueta(
        tokenTag,
        codigoAtivacao,
        urlPublica
    );

} catch (erro) {

    mostrarErro(
        erro.message ||
        "Não foi possível gerar a etiqueta."
    );

    return;

}


    if (mensagem) {

        mensagem.classList.add("oculto");

    }


    if (folha) {

        folha.classList.remove("oculto");

    }

}


/* ===================================================
   CRIAR URL PÚBLICA
=================================================== */

function criarUrlPublica(token) {

    /*
     * Preferência:
     * usar CONFIG.URL_SITE,
     * caso essa propriedade já exista.
     */

    const baseConfigurada =
        typeof CONFIG !== "undefined" &&
        CONFIG.URL_SITE

            ? String(CONFIG.URL_SITE)

            : "https://tagpetlocalizador-hash.github.io/pet";


    const baseLimpa =
        baseConfigurada.replace(
            /\/+$/,
            ""
        );


    return (
        baseLimpa +
        "/?token=" +
        encodeURIComponent(token)
    );

}


/* ===================================================
   PREENCHER ETIQUETA
=================================================== */

async function preencherEtiqueta(
    token,
    codigoAtivacao,
    urlPublica
) {

    const elementoToken =
        document.getElementById("token");

    const elementoCodigo =
        document.getElementById(
            "codigoAtivacao"
        );

    const elementoQrCode =
        document.getElementById("qrcode");

    const canvasQrCode =
        document.getElementById(
            "qrcodeCanvas"
        );


    if (elementoToken) {

        elementoToken.textContent =
            token || "-";

    }


    if (elementoCodigo) {

        elementoCodigo.textContent =
            codigoAtivacao || "-";

    }


    if (
        !elementoQrCode ||
        !canvasQrCode
    ) {

        throw new Error(
            "Área do QR Code não encontrada."
        );

    }


    console.log(
        "URL gravada no QR Code:",
        urlPublica
    );


    try {

    if (
        typeof qrcanvas === "undefined" ||
        typeof qrcanvas.qrcanvas !== "function"
    ) {

        throw new Error(
            "A biblioteca do QR Code não foi carregada."
        );

    }


    const qrGerado =
        qrcanvas.qrcanvas({

            data: urlPublica,

            size: 512,

            correctLevel: "L",

            cellSize: 16,

            foreground: "#000000",

            background: "#ffffff"

        });


    const contexto =
        canvasQrCode.getContext("2d");


    canvasQrCode.width =
        qrGerado.width;

    canvasQrCode.height =
        qrGerado.height;


    contexto.clearRect(
        0,
        0,
        canvasQrCode.width,
        canvasQrCode.height
    );


    contexto.drawImage(
        qrGerado,
        0,
        0
    );


    console.log(
        "QR Code gerado com sucesso."
    );


} catch (erro) {

    console.error(
        "Erro ao gerar QR Code:",
        erro
    );

    throw new Error(
        erro.message ||
        "Não foi possível gerar o QR Code."
    );

}

}


/* ===================================================
   MOSTRAR ERRO
=================================================== */

function mostrarErro(texto) {

    const mensagem =
        document.getElementById("mensagem");

    const folha =
        document.getElementById("folha");


    if (folha) {

        folha.classList.add("oculto");

    }


    if (mensagem) {

        mensagem.textContent =
            texto;

        mensagem.classList.remove("oculto");

        mensagem.classList.add("erro");

    }


    console.error(texto);

}
