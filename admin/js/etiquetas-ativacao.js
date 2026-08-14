/*************************************************
 * PET NFC
 * etiquetas-ativacao.js
 *
 * Etiquetas 80 x 130mm
 * Código de ativação automático
 *************************************************/


document.addEventListener(
    "DOMContentLoaded",
    carregarEtiquetasAtivacao
);


/* ===================================================
   CARREGAR ETIQUETAS
=================================================== */

async function carregarEtiquetasAtivacao() {

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


    const quantidade =
        document.getElementById(
            "quantidadeEtiquetas"
        );


    const parametros =
        new URLSearchParams(
            window.location.search
        );


    const tokensInformados =
        String(
            parametros.get("tokens") || ""
        ).trim();


    if (!tokensInformados) {

        mostrarErroAtivacao(
            "Nenhuma TAG foi selecionada."
        );

        return;

    }


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

        mostrarErroAtivacao(
            "Nenhuma TAG foi selecionada."
        );

        return;

    }


    try {

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
            Array.isArray(
                resposta.dados
            )

                ? resposta.dados

                : [];


        /*
         * Mantém exatamente a ordem
         * escolhida no administrador.
         */
        const tagsSelecionadas =
            listaTokens
                .map(
                    token =>

                        todas.find(
                            tag =>

                                String(
                                    tag.token || ""
                                ).trim() === token

                        )

                )
                .filter(
                    tag =>
                        tag
                );


        if (
            tagsSelecionadas.length === 0
        ) {

            throw new Error(
                "Nenhuma TAG encontrada."
            );

        }


        grade.innerHTML = "";


        tagsSelecionadas.forEach(
            tag => {

                const etiqueta =
                    criarEtiquetaAtivacao(
                        tag
                    );


                grade.appendChild(
                    etiqueta
                );

            }
        );


        if (quantidade) {

            quantidade.textContent =

                tagsSelecionadas.length === 1

                    ? "1 etiqueta"

                    : tagsSelecionadas.length +
                      " etiquetas";

        }


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


    } catch (erro) {

        console.error(
            "Erro ao gerar etiquetas:",
            erro
        );


        mostrarErroAtivacao(

            erro.message ||

            "Não foi possível gerar as etiquetas."

        );

    }

}


/* ===================================================
   CRIAR ETIQUETA
=================================================== */

function criarEtiquetaAtivacao(
    tag
) {

    const codigo =
        obterCodigoAtivacaoEtiqueta(
            tag
        );


    const etiqueta =
        document.createElement(
            "article"
        );


    etiqueta.className =
        "etiqueta-ativacao";


    etiqueta.innerHTML = `

        <img
            src="img/etiqueta-ativacao.png"
            alt="Etiqueta PET NFC">


        <div class="area-codigo">

            <span class="codigo-ativacao">

                ${escaparHtmlAtivacao(
                    codigo
                )}

            </span>

        </div>

    `;


    return etiqueta;

}


/* ===================================================
   OBTER CÓDIGO
=================================================== */

function obterCodigoAtivacaoEtiqueta(
    tag
) {

    return String(

        tag.codigo_ativacao ||

        tag.CODIGO_ATIVACAO ||

        tag.codigoAtivacao ||

        "-"

    ).trim();

}


/* ===================================================
   ESCAPAR HTML
=================================================== */

function escaparHtmlAtivacao(
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
   ERRO
=================================================== */

function mostrarErroAtivacao(
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
