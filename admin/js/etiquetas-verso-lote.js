/*************************************************
 * PET NFC
 * etiquetas-verso-lote.js
 *
 * Impressão somente dos versos em lote
 *
 * - Medalhão: 28 x 28 mm
 * - Espaçamento: 5 mm
 * - Cada etiqueta possui QR Code próprio
 *************************************************/


document.addEventListener(
    "DOMContentLoaded",
    carregarVersosDoLote
);


/* ===================================================
   CARREGAR ETIQUETAS
=================================================== */

async function carregarVersosDoLote() {

    const mensagem =
        document.getElementById(
            "mensagem"
        );


    const folha =
        document.getElementById(
            "folha"
        );


    const grade =
        document.getElementById(
            "gradeEtiquetas"
        );


    const quantidadeEtiquetas =
        document.getElementById(
            "quantidadeEtiquetas"
        );


    const parametros =
        new URLSearchParams(
            window.location.search
        );


    const loteInformado =
        String(
            parametros.get("lote") || ""
        ).trim();


    const tokensInformados =
        String(
            parametros.get("tokens") || ""
        ).trim();


    let tagsDoLote = [];


    try {

        /* ==========================================
           SE RECEBEU TOKENS MANUALMENTE
        ========================================== */

        if (tokensInformados) {

            const listaTokens =
                tokensInformados
                    .split(",")
                    .map(
                        token =>
                            token.trim()
                    )
                    .filter(
                        token =>
                            token
                    );


            if (
                listaTokens.length === 0
            ) {

                throw new Error(
                    "Nenhum token informado."
                );

            }


            const resposta =
                await listarTags();


            if (
                !resposta ||
                resposta.sucesso === false
            ) {

                throw new Error(
                    "Não foi possível carregar as TAGs."
                );

            }


            const todas =
                extrairTagsVerso(
                    resposta
                );


            tagsDoLote =
                todas.filter(
                    tag => {

                        const token =
                            obterTokenVerso(
                                tag
                            );


                        return listaTokens.includes(
                            token
                        );

                    }
                );

        }


        /* ==========================================
           SE RECEBEU UM LOTE
        ========================================== */

        else {

            if (!loteInformado) {

                throw new Error(
                    "Código do lote não informado."
                );

            }


            const resposta =
                await buscarLote(
                    loteInformado
                );


            if (
                !resposta ||
                resposta.sucesso === false
            ) {

                throw new Error(

                    resposta &&
                    resposta.mensagem

                        ? resposta.mensagem

                        : "Não foi possível carregar o lote."

                );

            }


            tagsDoLote =
                extrairTagsVerso(
                    resposta
                );

        }


        /* ==========================================
           VERIFICAR RESULTADO
        ========================================== */

        if (
            !Array.isArray(tagsDoLote) ||
            tagsDoLote.length === 0
        ) {

            throw new Error(
                "Nenhuma TAG encontrada."
            );

        }


        /* ==========================================
           LIMPAR GRADE
        ========================================== */

        grade.innerHTML = "";


        /* ==========================================
           CRIAR CADA VERSO
        ========================================== */

        tagsDoLote.forEach(
            (tag, indice) => {

                const etiqueta =
                    criarVersoEtiqueta(
                        tag,
                        indice
                    );


                grade.appendChild(
                    etiqueta
                );


                gerarQrCodeVerso(
                    etiqueta,
                    tag
                );

            }
        );


        /* ==========================================
           QUANTIDADE
        ========================================== */

        if (quantidadeEtiquetas) {

            quantidadeEtiquetas.textContent =
                tagsDoLote.length === 1

                    ? "1 etiqueta"

                    : tagsDoLote.length +
                      " etiquetas";

        }


        /* ==========================================
           MOSTRAR FOLHA
        ========================================== */

        if (mensagem) {

            mensagem.classList.add(
                "oculto"
            );

        }


        if (folha) {

            folha.classList.remove(
                "oculto"
            );

        }


        console.log(
            "Versos carregados:",
            tagsDoLote.length
        );


        console.log(
            "Lote:",
            loteInformado || "Seleção manual"
        );

    }


    catch (erro) {

        console.error(
            "Erro ao carregar versos:",
            erro
        );


        mostrarErroVerso(

            erro.message ||

            "Não foi possível carregar as etiquetas."

        );

    }

}


/* ===================================================
   EXTRAIR TAGS DA RESPOSTA
=================================================== */

function extrairTagsVerso(
    resposta
) {

    if (
        Array.isArray(resposta)
    ) {

        return resposta;

    }


    if (
        resposta &&
        Array.isArray(
            resposta.tags
        )
    ) {

        return resposta.tags;

    }


    if (
        resposta &&
        Array.isArray(
            resposta.dados
        )
    ) {

        return resposta.dados;

    }


    if (
        resposta &&
        resposta.dados &&
        Array.isArray(
            resposta.dados.tags
        )
    ) {

        return resposta.dados.tags;

    }


    if (
        resposta &&
        Array.isArray(
            resposta.resultado
        )
    ) {

        return resposta.resultado;

    }


    return [];

}


/* ===================================================
   CRIAR VERSO
=================================================== */

function criarVersoEtiqueta(
    tag,
    indice
) {

    const token =
        obterTokenVerso(
            tag
        );


    if (!token) {

        throw new Error(
            "Foi encontrada uma TAG sem token."
        );

    }


    const etiqueta =
        document.createElement(
            "article"
        );


    etiqueta.className =
        "etiqueta-verso";


    etiqueta.dataset.token =
        token;


    etiqueta.innerHTML = `

        <img
            src="img/verso.png"
            class="medalhao"
            alt="Verso PET NFC">


        <div class="qrcode">

            <canvas
                class="qrcode-canvas"
                data-indice="${indice}">
            </canvas>

        </div>

    `;


    return etiqueta;

}


/* ===================================================
   GERAR QR CODE
=================================================== */

function gerarQrCodeVerso(
    etiqueta,
    tag
) {

    const canvasQrCode =
        etiqueta.querySelector(
            ".qrcode-canvas"
        );


    if (!canvasQrCode) {

        throw new Error(
            "Canvas do QR Code não encontrado."
        );

    }


    const token =
        obterTokenVerso(
            tag
        );


    const urlPublica =
        criarUrlPublicaVerso(
            token
        );


    console.log(
        "QR:",
        token,
        urlPublica
    );


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

            data:
                urlPublica,

            size:
                520,

            foreground:
                "#000000",

            background:
                "#ffffff"

        });


    const contexto =
        canvasQrCode.getContext(
            "2d"
        );


    canvasQrCode.width =
        qrGerado.width;


    canvasQrCode.height =
        qrGerado.height;


    contexto.imageSmoothingEnabled =
        false;


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

}


/* ===================================================
   OBTER TOKEN
=================================================== */

function obterTokenVerso(
    tag
) {

    return String(

        tag.token ||

        tag.TOKEN ||

        ""

    ).trim();

}


/* ===================================================
   CRIAR URL PÚBLICA
=================================================== */

function criarUrlPublicaVerso(
    token
) {

    const baseConfigurada =

        typeof CONFIG !== "undefined" &&
        CONFIG.URL_SITE

            ? String(
                CONFIG.URL_SITE
            )

            : "https://tagpetlocalizador-hash.github.io/pet";


    const baseLimpa =
        baseConfigurada.replace(
            /\/+$/,
            ""
        );


    return (

        baseLimpa +

        "/?token=" +

        encodeURIComponent(
            token
        )

    );

}


/* ===================================================
   MOSTRAR ERRO
=================================================== */

function mostrarErroVerso(
    texto
) {

    const mensagem =
        document.getElementById(
            "mensagem"
        );


    const folha =
        document.getElementById(
            "folha"
        );


    if (folha) {

        folha.classList.add(
            "oculto"
        );

    }


    if (mensagem) {

        mensagem.textContent =
            texto;


        mensagem.classList.remove(
            "oculto"
        );


        mensagem.classList.add(
            "erro"
        );

    }


    console.error(
        texto
    );

}
