/*************************************************
 * PET NFC
 * etiquetas-lote.js
 * Etiquetas em lote
 *************************************************/


document.addEventListener(
    "DOMContentLoaded",
    carregarEtiquetasDoLote
);


/* ===================================================
   CARREGAR LOTE
=================================================== */

async function carregarEtiquetasDoLote() {

    const mensagem =
        document.getElementById("mensagem");

    const folha =
        document.getElementById("folha");

    const grade =
        document.getElementById("gradeEtiquetas");

    const identificacaoLote =
        document.getElementById(
            "identificacaoLote"
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

    if (identificacaoLote) {

        identificacaoLote.textContent =
            loteInformado
                ? loteInformado
                : "Seleção manual";

    }

    try {

        if (tokensInformados) {

            const listaTokens =
                tokensInformados
                    .split(",")
                    .map(t => t.trim())
                    .filter(t => t);

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
                Array.isArray(resposta.dados)
                    ? resposta.dados
                    : [];

            tagsDoLote =
                todas.filter(tag =>
                    listaTokens.includes(
                        String(tag.token).trim()
                    )
                );

        } else {

            if (!loteInformado) {

                mostrarErroLote(
                    "Código do lote não informado."
                );

                return;

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
                Array.isArray(resposta.tags)
                    ? resposta.tags
                    : [];

        }

        if (tagsDoLote.length === 0) {

            throw new Error(
                "Nenhuma TAG encontrada."
            );

        }


    grade.innerHTML = "";


tagsDoLote.forEach(
    (tag, indice) => {

        const etiqueta =
            criarEtiquetaDoLote(
                tag,
                indice
            );

        grade.appendChild(
            etiqueta
        );

        gerarQrCodeDoLote(
            etiqueta,
            tag
        );

    }
);


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
    "Origem das etiquetas:",
    loteInformado
        ? "Lote: " + loteInformado
        : "Seleção manual"
);
        
        console.log(
            "Quantidade de etiquetas:",
            tagsDoLote.length
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar etiquetas:",
            erro
        );

        mostrarErroLote(
            erro.message ||
            "Não foi possível carregar o lote."
        );

    }

}


/* ===================================================
   EXTRAIR TAGS DA RESPOSTA
=================================================== */

function extrairListaDeTags(
    resposta
) {

    if (Array.isArray(resposta)) {

        return resposta;

    }


    if (
        Array.isArray(
            resposta.tags
        )
    ) {

        return resposta.tags;

    }


    if (
        Array.isArray(
            resposta.dados
        )
    ) {

        return resposta.dados;

    }


    if (
        resposta.dados &&
        Array.isArray(
            resposta.dados.tags
        )
    ) {

        return resposta.dados.tags;

    }


    if (
        Array.isArray(
            resposta.resultado
        )
    ) {

        return resposta.resultado;

    }


    return [];

}


/* ===================================================
   OBTER LOTE DA TAG
=================================================== */

function obterLoteDaTag(tag) {

    return String(

        tag.lote ||

        tag.codigo_lote ||

        tag.codigoLote ||

        tag.LOTE ||

        tag.lote_id ||

        ""

    ).trim();

}


/* ===================================================
   CRIAR ETIQUETA
=================================================== */

function criarEtiquetaDoLote(
    tag,
    indice
) {

    const token =
        obterTokenDaTag(tag);

    const codigoAtivacao =
        obterCodigoAtivacao(tag);


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
        "etiqueta";


    etiqueta.innerHTML = `

        <div class="titulo-token">
            TOKEN
        </div>

        <div class="valor-token">
            ${escaparHtmlLote(token)}
        </div>


        <div class="artes">

            <div class="medalhao-container">

                <img
                    src="img/frente.png"
                    class="medalhao"
                    alt="Frente da medalha PET NFC">

            </div>


            <div
                class="medalhao-container verso-container">

                <img
                    src="img/verso.png"
                    class="medalhao"
                    alt="Verso da medalha PET NFC">

                <div class="qrcode">

                    <canvas
                        class="qrcode-canvas"
                        data-indice="${indice}">
                    </canvas>

                </div>

            </div>

        </div>


        <div class="titulo-codigo">

            CÓDIGO DE ATIVAÇÃO

        </div>

        <div class="valor-codigo">

            ${escaparHtmlLote(
                codigoAtivacao
            )}

        </div>

    `;


    return etiqueta;

}


/* ===================================================
   GERAR QR CODE
=================================================== */

function gerarQrCodeDoLote(
    etiqueta,
    tag
) {

    const canvasQrCode =
        etiqueta.querySelector(
            ".qrcode-canvas"
        );


    const token =
        obterTokenDaTag(tag);


    const urlPublica =
        criarUrlPublicaLote(
            token
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

            data: urlPublica,

            size: 520,

            foreground: "#000000",

            background: "#ffffff"

        });


    const contexto =
        canvasQrCode.getContext("2d");


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
   TOKEN
=================================================== */

function obterTokenDaTag(tag) {

    return String(

        tag.token ||

        tag.TOKEN ||

        ""

    ).trim();

}


/* ===================================================
   CÓDIGO DE ATIVAÇÃO
=================================================== */

function obterCodigoAtivacao(tag) {

    return String(

        tag.codigo_ativacao ||

        tag.CODIGO_ATIVACAO ||

        tag.codigoAtivacao ||

        "-"

    ).trim();

}


/* ===================================================
   URL PÚBLICA
=================================================== */

function criarUrlPublicaLote(
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
        encodeURIComponent(token)
    );

}


/* ===================================================
   NORMALIZAR TEXTO
=================================================== */

function normalizarTexto(
    valor
) {

    return String(
        valor || ""
    )
        .trim()
        .toUpperCase();

}


/* ===================================================
   ESCAPAR HTML
=================================================== */

function escaparHtmlLote(
    valor
) {

    return String(
        valor || ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


/* ===================================================
   MOSTRAR ERRO
=================================================== */

function mostrarErroLote(
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


    console.error(texto);

}
