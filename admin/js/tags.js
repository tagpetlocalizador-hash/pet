/*************************************************
 * PET NFC ADMIN
 * tags.js
 * Versão 1.2.0
 *************************************************/

let modalNovaTag;
let modalGerarLote;
let modalResultadoLote;

let ultimoLoteGerado = null;

/*
 * Guarda todas as TAGs recebidas da API.
 */
let todasAsTags = [];

/*
 * Guarda os tokens selecionados.
 */
let tagsSelecionadas = new Set();


/* ===================================================
   INICIALIZAÇÃO
=================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /*
     * Modal de nova TAG e visualização.
     */
    const elementoModal =
        document.getElementById("modalNovaTag");

    if (elementoModal) {

        modalNovaTag =
            new bootstrap.Modal(elementoModal);

    }


    /*
     * Modal para gerar lote.
     */
    const elementoModalGerarLote =
        document.getElementById("modalGerarLote");

    if (elementoModalGerarLote) {

        modalGerarLote =
            new bootstrap.Modal(
                elementoModalGerarLote
            );

    }


    /*
     * Modal do resultado do lote.
     */
    const elementoResultadoLote =
        document.getElementById(
            "modalResultadoLote"
        );

    if (elementoResultadoLote) {

        modalResultadoLote =
            new bootstrap.Modal(
                elementoResultadoLote
            );

    }


    /*
     * Botão Nova TAG.
     */
    const btnNovaTag =
        document.getElementById("btnNovaTag");

    if (btnNovaTag) {

        btnNovaTag.addEventListener(
            "click",
            criarNovaTag
        );

    }


    /*
     * Botão copiar link.
     */
    const btnCopiar =
        document.getElementById("btnCopiar");

    if (btnCopiar) {

        btnCopiar.addEventListener(
            "click",
            copiarLink
        );

    }


    /*
     * Botão visualizar etiqueta individual.
     */
    const btnEtiqueta =
        document.getElementById("btnEtiqueta");

    if (btnEtiqueta) {

        btnEtiqueta.addEventListener(
            "click",
            abrirEtiqueta
        );

    }


    /*
     * Botão abrir geração em lote.
     */
    const btnGerarLote =
        document.getElementById("btnGerarLote");

    if (btnGerarLote) {

        btnGerarLote.addEventListener(
            "click",
            abrirModalGerarLote
        );

    }


    /*
     * Botão confirmar geração em lote.
     */
    const btnConfirmarLote =
        document.getElementById(
            "btnConfirmarLote"
        );

    if (btnConfirmarLote) {

        btnConfirmarLote.addEventListener(
            "click",
            criarLoteTags
        );

    }


    /*
     * Botão gerar etiquetas do último lote.
     */
    const btnEtiquetasLote =
        document.getElementById(
            "btnEtiquetasLote"
        );

    if (btnEtiquetasLote) {

        btnEtiquetasLote.addEventListener(
            "click",
            abrirEtiquetasLote
        );

    }


    /*
     * Campo de pesquisa.
     */
    const campoPesquisa =
        document.getElementById("pesquisa");

    if (campoPesquisa) {

        campoPesquisa.addEventListener(
            "input",
            aplicarPesquisa
        );

    }


    /*
     * Checkbox Selecionar todas.
     */
    const selecionarTodas =
        document.getElementById(
            "selecionarTodas"
        );

    if (selecionarTodas) {

        selecionarTodas.addEventListener(
            "change",
            selecionarTodasVisiveis
        );

    }


    /*
     * Botão limpar seleção.
     */
    const btnLimparSelecao =
        document.getElementById(
            "btnLimparSelecao"
        );

    if (btnLimparSelecao) {

        btnLimparSelecao.addEventListener(
            "click",
            limparSelecao
        );

    }


    /*
     * Botão imprimir selecionadas.
     */
    const btnImprimirSelecionadas =
        document.getElementById(
            "btnImprimirSelecionadas"
        );

    if (btnImprimirSelecionadas) {

        btnImprimirSelecionadas.addEventListener(
            "click",
            imprimirTagsSelecionadas
        );

    }


    /*
     * Carrega as TAGs.
     */
    carregarTags();

});


/* ===================================================
   ATUALIZAR BARRA DE SELEÇÃO
=================================================== */

function atualizarBarraSelecao() {

    const contador =
        document.getElementById(
            "contadorSelecionadas"
        );

    const btnImprimir =
        document.getElementById(
            "btnImprimirSelecionadas"
        );

    const btnLimpar =
        document.getElementById(
            "btnLimparSelecao"
        );

    const total =
        tagsSelecionadas.size;


    if (contador) {

        if (total === 1) {

            contador.innerText =
                "1 TAG selecionada";

        } else {

            contador.innerText =
                total + " TAGs selecionadas";

        }

    }


    if (btnImprimir) {

        btnImprimir.disabled =
            total === 0;

    }


    if (btnLimpar) {

        btnLimpar.disabled =
            total === 0;

    }


    atualizarCheckboxSelecionarTodas();

}


/* ===================================================
   ATUALIZAR CHECKBOX SELECIONAR TODAS
=================================================== */

function atualizarCheckboxSelecionarTodas() {

    const selecionarTodas =
        document.getElementById(
            "selecionarTodas"
        );

    if (!selecionarTodas) {

        return;

    }


    const checkboxesVisiveis =
        Array.from(
            document.querySelectorAll(
                ".check-tag"
            )
        );


    if (checkboxesVisiveis.length === 0) {

        selecionarTodas.checked = false;
        selecionarTodas.indeterminate = false;
        selecionarTodas.disabled = true;

        return;

    }


    selecionarTodas.disabled = false;


    const quantidadeMarcada =
        checkboxesVisiveis.filter(
            checkbox => checkbox.checked
        ).length;


    selecionarTodas.checked =
        quantidadeMarcada ===
        checkboxesVisiveis.length;


    selecionarTodas.indeterminate =
        quantidadeMarcada > 0 &&
        quantidadeMarcada <
        checkboxesVisiveis.length;

}


/* ===================================================
   ALTERAR SELEÇÃO DE UMA TAG
=================================================== */

function alterarSelecaoTag(checkbox) {

    if (!checkbox) {

        return;

    }


    const token =
        String(
            checkbox.dataset.token || ""
        ).trim();


    if (!token) {

        return;

    }


    if (checkbox.checked) {

        tagsSelecionadas.add(token);

    } else {

        tagsSelecionadas.delete(token);

    }


    atualizarBarraSelecao();

}


/* ===================================================
   SELECIONAR TODAS AS TAGS VISÍVEIS
=================================================== */

function selecionarTodasVisiveis(evento) {

    const marcado =
        Boolean(evento.target.checked);


    const checkboxesVisiveis =
        document.querySelectorAll(
            ".check-tag"
        );


    checkboxesVisiveis.forEach(
        function (checkbox) {

            const token =
                String(
                    checkbox.dataset.token || ""
                ).trim();


            checkbox.checked = marcado;


            if (!token) {

                return;

            }


            if (marcado) {

                tagsSelecionadas.add(token);

            } else {

                tagsSelecionadas.delete(token);

            }

        }
    );


    atualizarBarraSelecao();

}


/* ===================================================
   LIMPAR TODA A SELEÇÃO
=================================================== */

function limparSelecao() {

    tagsSelecionadas.clear();


    document
        .querySelectorAll(".check-tag")
        .forEach(
            function (checkbox) {

                checkbox.checked = false;

            }
        );


    atualizarBarraSelecao();

}


/* ===================================================
   IMPRIMIR TAGS SELECIONADAS
=================================================== */

function imprimirTagsSelecionadas() {

    const tokens =
        Array.from(tagsSelecionadas);


    if (tokens.length === 0) {

        alert(
            "Selecione pelo menos uma TAG."
        );

        return;

    }


    window.open(

        "etiquetas-lote.html?tokens=" +
        encodeURIComponent(
            tokens.join(",")
        ),

        "_blank"

    );

}


/* ===================================================
   APLICAR PESQUISA
=================================================== */

function aplicarPesquisa() {

    const campoPesquisa =
        document.getElementById("pesquisa");


    const termo =
        campoPesquisa
            ? String(campoPesquisa.value || "")
                .trim()
                .toLowerCase()
            : "";


    if (!termo) {

        renderizarTags(todasAsTags);

        return;

    }


    const tagsFiltradas =
        todasAsTags.filter(
            function (tag) {

                const id =
                    String(tag.id || "")
                        .toLowerCase();

                const token =
                    String(tag.token || "")
                        .toLowerCase();

                const status =
                    String(tag.status || "")
                        .toLowerCase();

                const nomePet =
                    String(tag.nome_pet || "")
                        .toLowerCase();

                const codigo =
                    String(
                        tag.codigo_ativacao ||
                        tag.CODIGO_ATIVACAO ||
                        tag.codigoAtivacao ||
                        ""
                    ).toLowerCase();


                return (
                    id.includes(termo) ||
                    token.includes(termo) ||
                    status.includes(termo) ||
                    nomePet.includes(termo) ||
                    codigo.includes(termo)
                );

            }
        );


    renderizarTags(tagsFiltradas);

}
/* ===================================================
   CARREGAR TAGS
=================================================== */

async function carregarTags() {

    const tbody =
        document.getElementById("listaTags");


    if (!tbody) {

        console.error(
            "Elemento listaTags não encontrado."
        );

        return;

    }


    tbody.innerHTML = `

        <tr>

            <td
                colspan="6"
                class="text-center py-4">

                <span
                    class="spinner-border
                    spinner-border-sm me-2">
                </span>

                Carregando TAGs...

            </td>

        </tr>

    `;


    try {

        const resposta =
            await listarTags();


        if (
            !resposta ||
            resposta.sucesso === false
        ) {

            tbody.innerHTML = `

                <tr>

                    <td
                        colspan="6"
                        class="text-center
                        text-danger py-4">

                        ${
                            resposta &&
                            resposta.mensagem
                                ? resposta.mensagem
                                : "Não foi possível carregar as TAGs."
                        }

                    </td>

                </tr>

            `;

            todasAsTags = [];

            atualizarBarraSelecao();

            return;

        }


        todasAsTags =
            Array.isArray(resposta.dados)
                ? resposta.dados
                : [];


        /*
         * Remove da seleção qualquer token
         * que não existe mais na listagem.
         */
        const tokensExistentes =
            new Set(

                todasAsTags.map(
                    function (tag) {

                        return String(
                            tag.token || ""
                        ).trim();

                    }
                )

            );


        Array.from(tagsSelecionadas)
            .forEach(
                function (token) {

                    if (
                        !tokensExistentes.has(token)
                    ) {

                        tagsSelecionadas.delete(
                            token
                        );

                    }

                }
            );


        aplicarPesquisa();

    } catch (erro) {

        console.error(
            "Erro ao carregar TAGs:",
            erro
        );


        tbody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="text-center
                    text-danger py-4">

                    Ocorreu um erro ao carregar as TAGs.

                </td>

            </tr>

        `;


        todasAsTags = [];

        atualizarBarraSelecao();

    }

}


/* ===================================================
   RENDERIZAR TAGS
=================================================== */

function renderizarTags(lista) {

    const tbody =
        document.getElementById("listaTags");


    if (!tbody) {

        return;

    }


    tbody.innerHTML = "";


    const tags =
        Array.isArray(lista)
            ? lista
            : [];


    if (tags.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="text-center
                    text-muted py-4">

                    Nenhuma TAG encontrada.

                </td>

            </tr>

        `;


        atualizarBarraSelecao();

        return;

    }


    tags.forEach(
        function (tag) {

            const id =
                String(tag.id || "-");


            const token =
                String(tag.token || "")
                    .trim();


            const status =
                String(tag.status || "")
                    .trim()
                    .toUpperCase();


            const nomePet =
                String(
                    tag.nome_pet ||
                    tag.nomePet ||
                    "-"
                );


            const estaSelecionada =
                tagsSelecionadas.has(token);


            let corStatus =
                "secondary";


            if (status === "ATIVO") {

                corStatus = "success";

            } else if (
                status === "BLOQUEADO"
            ) {

                corStatus = "danger";

            } else if (
                status === "LIVRE"
            ) {

                corStatus = "primary";

            } else if (
                status === "INATIVO"
            ) {

                corStatus = "warning";

            }


            const botaoStatus =
                status === "BLOQUEADO"

                    ? `

                        <button
                            type="button"
                            class="btn
                            btn-sm
                            btn-success"
                            title="Reativar TAG"
                            onclick="reativarTagConfirm(
                                '${escaparTextoJavaScript(token)}'
                            )">

                            <i class="bi bi-unlock"></i>

                        </button>

                    `

                    : `

                        <button
                            type="button"
                            class="btn
                            btn-sm
                            btn-secondary"
                            title="Bloquear TAG"
                            onclick="bloquearTagConfirm(
                                '${escaparTextoJavaScript(token)}'
                            )">

                            <i class="bi bi-lock"></i>

                        </button>

                    `;


            tbody.insertAdjacentHTML(

                "beforeend",

                `

                <tr>

                    <td>

                        <input
                            type="checkbox"
                            class="form-check-input check-tag"
                            data-token="${escaparHtml(token)}"
                            onchange="alterarSelecaoTag(this)"
                            ${estaSelecionada ? "checked" : ""}
                            aria-label="Selecionar TAG ${escaparHtml(token)}">

                    </td>


                    <td>

                        ${escaparHtml(id)}

                    </td>


                    <td>

                        ${escaparHtml(token || "-")}

                    </td>


                    <td>

                        <span
                            class="badge bg-${corStatus}">

                            ${escaparHtml(status || "-")}

                        </span>

                    </td>


                    <td>

                        ${escaparHtml(nomePet)}

                    </td>


                    <td>

                        <div
                            class="d-flex
                            flex-wrap
                            gap-1">

                            <button
                                type="button"
                                class="btn
                                btn-sm
                                btn-primary"
                                title="Visualizar dados e etiqueta"
                                onclick="editarTag(
                                    '${escaparTextoJavaScript(token)}'
                                )">

                                <i class="bi bi-pencil"></i>

                            </button>


                            <button
                                type="button"
                                class="btn
                                btn-sm
                                btn-warning"
                                title="Resetar TAG"
                                onclick="resetarTagConfirm(
                                    '${escaparTextoJavaScript(token)}'
                                )">

                                <i class="bi bi-arrow-clockwise"></i>

                            </button>


                            ${botaoStatus}


                            <button
                                type="button"
                                class="btn
                                btn-sm
                                btn-danger"
                                title="Excluir TAG"
                                onclick="excluirTagConfirm(
                                    '${escaparTextoJavaScript(token)}'
                                )">

                                <i class="bi bi-trash"></i>

                            </button>

                        </div>

                    </td>

                </tr>

                `

            );

        }
    );


    atualizarBarraSelecao();

}


/* ===================================================
   ESCAPAR TEXTO PARA HTML
=================================================== */

function escaparHtml(valor) {

    return String(valor ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* ===================================================
   ESCAPAR TEXTO PARA JAVASCRIPT
=================================================== */

function escaparTextoJavaScript(valor) {

    return String(valor ?? "")
        .replaceAll("\\", "\\\\")
        .replaceAll("'", "\\'")
        .replaceAll("\r", "\\r")
        .replaceAll("\n", "\\n");

}


/* ===================================================
   EDITAR / VISUALIZAR TAG
=================================================== */

async function editarTag(token) {

    if (!token) {

        alert(
            "Token da TAG não encontrado."
        );

        return;

    }


    try {

        const resposta =
            await buscarTag(token);


        if (
            !resposta ||
            resposta.sucesso === false
        ) {

            alert(

                resposta &&
                resposta.mensagem

                    ? resposta.mensagem

                    : "Não foi possível buscar os dados da TAG."

            );

            return;

        }


        const tag =
            resposta.dados ||
            resposta.tag ||
            resposta;


        const tokenEncontrado =
            tag.token || token;


        const campoId =
            document.getElementById(
                "novoId"
            );

        const campoToken =
            document.getElementById(
                "novoToken"
            );

        const campoCodigo =
            document.getElementById(
                "novoCodigoAtivacao"
            );

        const campoUrl =
            document.getElementById(
                "novaUrl"
            );

        const btnEtiqueta =
            document.getElementById(
                "btnEtiqueta"
            );


        if (campoId) {

            campoId.innerText =
                tag.id || "-";

        }


        if (campoToken) {

            campoToken.innerText =
                tokenEncontrado;

        }


        if (campoCodigo) {

            campoCodigo.innerText =

                tag.codigo_ativacao ||
                tag.CODIGO_ATIVACAO ||
                tag.codigoAtivacao ||
                "-";

        }


        const urlPublica =

            tag.url ||

            (
                String(CONFIG.URL_SITE || "")
                    .replace(/\/+$/, "") +

                "/?token=" +

                encodeURIComponent(
                    tokenEncontrado
                )
            );


        if (campoUrl) {

            campoUrl.value =
                urlPublica;

        }


        if (btnEtiqueta) {

            btnEtiqueta.dataset.token =
                tokenEncontrado;

        }


        if (modalNovaTag) {

            modalNovaTag.show();

        }

    } catch (erro) {

        console.error(
            "Erro ao visualizar TAG:",
            erro
        );


        alert(
            "Não foi possível carregar os dados da TAG."
        );

    }

}


/* ===================================================
   RESETAR TAG
=================================================== */

async function resetarTagConfirm(token) {

    const confirmar =
        confirm(

            "Deseja realmente resetar esta TAG?\n\n" +
            "O vínculo com o pet será removido."

        );


    if (!confirmar) {

        return;

    }


    try {

        const resposta =
            await resetarTag(token);


        if (
            !resposta ||
            resposta.sucesso === false
        ) {

            alert(

                resposta &&
                resposta.mensagem

                    ? resposta.mensagem

                    : "Não foi possível resetar a TAG."

            );

            return;

        }


        tagsSelecionadas.delete(token);


        alert(

            resposta.mensagem ||
            "TAG resetada com sucesso."

        );


        await carregarTags();

    } catch (erro) {

        console.error(
            "Erro ao resetar TAG:",
            erro
        );


        alert(
            "Ocorreu um erro ao resetar a TAG."
        );

    }

}


/* ===================================================
   BLOQUEAR TAG
=================================================== */

async function bloquearTagConfirm(token) {

    const confirmar =
        confirm(

            "Deseja realmente bloquear esta TAG?\n\n" +
            "O perfil não poderá ser utilizado " +
            "enquanto estiver bloqueado."

        );


    if (!confirmar) {

        return;

    }


    try {

        const resposta =
            await bloquearTag(token);


        if (
            !resposta ||
            resposta.sucesso === false
        ) {

            alert(

                resposta &&
                resposta.mensagem

                    ? resposta.mensagem

                    : "Não foi possível bloquear a TAG."

            );

            return;

        }


        alert(

            resposta.mensagem ||
            "TAG bloqueada com sucesso."

        );


        await carregarTags();

    } catch (erro) {

        console.error(
            "Erro ao bloquear TAG:",
            erro
        );


        alert(
            "Ocorreu um erro ao bloquear a TAG."
        );

    }

}


/* ===================================================
   REATIVAR TAG
=================================================== */

async function reativarTagConfirm(token) {

    const confirmar =
        confirm(
            "Deseja reativar esta TAG?"
        );


    if (!confirmar) {

        return;

    }


    try {

        const resposta =
            await reativarTag(token);


        if (
            !resposta ||
            resposta.sucesso === false
        ) {

            alert(

                resposta &&
                resposta.mensagem

                    ? resposta.mensagem

                    : "Não foi possível reativar a TAG."

            );

            return;

        }


        alert(

            resposta.mensagem ||
            "TAG reativada com sucesso."

        );


        await carregarTags();

    } catch (erro) {

        console.error(
            "Erro ao reativar TAG:",
            erro
        );


        alert(
            "Ocorreu um erro ao reativar a TAG."
        );

    }

}


/* ===================================================
   EXCLUIR TAG
=================================================== */

async function excluirTagConfirm(token) {

    const confirmar =
        confirm(

            "ATENÇÃO!\n\n" +
            "Deseja realmente excluir esta TAG?\n\n" +
            "Esta ação pode não ser reversível."

        );


    if (!confirmar) {

        return;

    }


    try {

        const resposta =
            await excluirTag(token);


        if (
            !resposta ||
            resposta.sucesso === false
        ) {

            alert(

                resposta &&
                resposta.mensagem

                    ? resposta.mensagem

                    : "Não foi possível excluir a TAG."

            );

            return;

        }


        tagsSelecionadas.delete(token);


        alert(

            resposta.mensagem ||
            "TAG excluída com sucesso."

        );


        await carregarTags();

    } catch (erro) {

        console.error(
            "Erro ao excluir TAG:",
            erro
        );


        alert(
            "Ocorreu um erro ao excluir a TAG."
        );

    }

}
/* ===================================================
   NOVA TAG
=================================================== */

async function criarNovaTag() {

    try {

        const resposta =
            await gerarTag();


        if (
            !resposta ||
            resposta.sucesso === false
        ) {

            alert(

                resposta &&
                resposta.mensagem

                    ? resposta.mensagem

                    : "Não foi possível gerar a TAG."

            );

            return;

        }


        const campoId =
            document.getElementById(
                "novoId"
            );

        const campoToken =
            document.getElementById(
                "novoToken"
            );

        const campoCodigo =
            document.getElementById(
                "novoCodigoAtivacao"
            );

        const campoUrl =
            document.getElementById(
                "novaUrl"
            );

        const btnEtiqueta =
            document.getElementById(
                "btnEtiqueta"
            );


        if (campoId) {

            campoId.innerText =
                resposta.id || "-";

        }


        if (campoToken) {

            campoToken.innerText =
                resposta.token || "-";

        }


        if (campoCodigo) {

            campoCodigo.innerText =
                resposta.codigo_ativacao ||
                resposta.codigoAtivacao ||
                resposta.CODIGO_ATIVACAO ||
                "-";

        }


        if (campoUrl) {

            campoUrl.value =
                resposta.url || "";

        }


        if (btnEtiqueta) {

            btnEtiqueta.dataset.token =
                resposta.token || "";

        }


        if (modalNovaTag) {

            modalNovaTag.show();

        }


        await carregarTags();

    } catch (erro) {

        console.error(
            "Erro ao gerar nova TAG:",
            erro
        );


        alert(
            "Ocorreu um erro ao gerar a TAG."
        );

    }

}


/* ===================================================
   VISUALIZAR ETIQUETA INDIVIDUAL
=================================================== */

function abrirEtiqueta() {

    const botao =
        document.getElementById(
            "btnEtiqueta"
        );


    const token =
        botao
            ? String(
                botao.dataset.token || ""
            ).trim()
            : "";


    if (!token) {

        alert(
            "Token não encontrado."
        );

        return;

    }


    const url =
        "etiqueta.html?token=" +
        encodeURIComponent(token);


    window.location.href = url;

}


/* ===================================================
   COPIAR LINK
=================================================== */

async function copiarLink() {

    const campo =
        document.getElementById(
            "novaUrl"
        );


    if (
        !campo ||
        !campo.value
    ) {

        alert(
            "Link não encontrado."
        );

        return;

    }


    try {

        if (
            navigator.clipboard &&
            window.isSecureContext
        ) {

            await navigator.clipboard.writeText(
                campo.value
            );

        } else {

            campo.focus();
            campo.select();

            campo.setSelectionRange(
                0,
                99999
            );

            document.execCommand(
                "copy"
            );

        }


        alert(
            "Link copiado."
        );

    } catch (erro) {

        console.error(
            "Erro ao copiar link:",
            erro
        );


        try {

            campo.focus();
            campo.select();

            campo.setSelectionRange(
                0,
                99999
            );

            document.execCommand(
                "copy"
            );


            alert(
                "Link copiado."
            );

        } catch (erroAlternativo) {

            console.error(
                "Erro no método alternativo:",
                erroAlternativo
            );


            alert(
                "Não foi possível copiar o link."
            );

        }

    }

}


/* ===================================================
   ABRIR MODAL PARA GERAR LOTE
=================================================== */

function abrirModalGerarLote() {

    const campoQuantidade =
        document.getElementById(
            "quantidadeLote"
        );


    if (campoQuantidade) {

        campoQuantidade.value = 10;

    }


    if (modalGerarLote) {

        modalGerarLote.show();

    }

}


/* ===================================================
   GERAR TAGS EM LOTE
=================================================== */

async function criarLoteTags() {

    const campoQuantidade =
        document.getElementById(
            "quantidadeLote"
        );


    const botao =
        document.getElementById(
            "btnConfirmarLote"
        );


    const quantidade =
        Number(

            campoQuantidade
                ? campoQuantidade.value
                : 0

        );


    if (
        !Number.isInteger(quantidade) ||
        quantidade < 2 ||
        quantidade > 500
    ) {

        alert(
            "Informe uma quantidade entre " +
            "2 e 500 TAGs."
        );

        return;

    }


    const confirmar =
        confirm(

            "Deseja gerar " +
            quantidade +
            " TAGs?\n\n" +
            "Todas serão criadas com o status LIVRE."

        );


    if (!confirmar) {

        return;

    }


    if (botao) {

        botao.disabled = true;

        botao.innerHTML = `

            <span
                class="spinner-border
                spinner-border-sm
                me-2">
            </span>

            Gerando...

        `;

    }


    try {

        const resposta =
            await gerarLote(
                quantidade
            );


        if (
            !resposta ||
            resposta.sucesso === false
        ) {

            alert(

                resposta &&
                resposta.mensagem

                    ? resposta.mensagem

                    : "Não foi possível gerar o lote."

            );

            return;

        }


        ultimoLoteGerado =
            resposta;


        const listaCodigosLote =
            document.getElementById(
                "listaCodigosLote"
            );


        if (listaCodigosLote) {

            listaCodigosLote.innerHTML = "";


            if (
                Array.isArray(resposta.tags) &&
                resposta.tags.length > 0
            ) {

                resposta.tags.forEach(
                    function (tag) {

                        listaCodigosLote
                            .insertAdjacentHTML(

                                "beforeend",

                                `

                                <tr>

                                    <td>

                                        ${escaparHtml(
                                            tag.id || "-"
                                        )}

                                    </td>

                                    <td>

                                        ${escaparHtml(
                                            tag.token || "-"
                                        )}

                                    </td>

                                    <td>

                                        <strong
                                            class="text-danger">

                                            ${escaparHtml(
                                                tag.codigo_ativacao ||
                                                tag.codigoAtivacao ||
                                                tag.CODIGO_ATIVACAO ||
                                                "-"
                                            )}

                                        </strong>

                                    </td>

                                </tr>

                                `

                            );

                    }
                );

            } else {

                listaCodigosLote.innerHTML = `

                    <tr>

                        <td
                            colspan="3"
                            class="text-center
                            text-muted">

                            Nenhum código encontrado.

                        </td>

                    </tr>

                `;

            }

        }


        const resultadoLote =
            document.getElementById(
                "resultadoLote"
            );

        const resultadoQuantidade =
            document.getElementById(
                "resultadoQuantidade"
            );

        const resultadoPrimeiroId =
            document.getElementById(
                "resultadoPrimeiroId"
            );

        const resultadoUltimoId =
            document.getElementById(
                "resultadoUltimoId"
            );

        const resultadoDataLote =
            document.getElementById(
                "resultadoDataLote"
            );


        if (resultadoLote) {

            resultadoLote.innerText =
                resposta.lote || "-";

        }


        if (resultadoQuantidade) {

            resultadoQuantidade.innerText =
                resposta.quantidade || 0;

        }


        if (resultadoPrimeiroId) {

            resultadoPrimeiroId.innerText =
                resposta.primeiro_id ||
                resposta.primeiroId ||
                "-";

        }


        if (resultadoUltimoId) {

            resultadoUltimoId.innerText =
                resposta.ultimo_id ||
                resposta.ultimoId ||
                "-";

        }


        if (resultadoDataLote) {

            resultadoDataLote.innerText =
                resposta.data_geracao ||
                resposta.dataGeracao ||
                "-";

        }


        if (modalGerarLote) {

            modalGerarLote.hide();

        }


        await carregarTags();


        setTimeout(
            function () {

                if (modalResultadoLote) {

                    modalResultadoLote.show();

                }

            },
            300
        );

    } catch (erro) {

        console.error(
            "Erro ao gerar lote:",
            erro
        );


        alert(
            "Ocorreu um erro ao gerar o lote."
        );

    } finally {

        if (botao) {

            botao.disabled = false;

            botao.innerHTML = `

                <i class="bi bi-stack"></i>

                Gerar lote

            `;

        }

    }

}
/* ===================================================
   ABRIR ETIQUETAS DO LOTE
=================================================== */

function abrirEtiquetasLote() {

    if (
        !ultimoLoteGerado ||
        !ultimoLoteGerado.lote
    ) {

        alert(
            "Nenhum lote foi selecionado."
        );

        return;

    }


    window.open(

        "etiquetas-lote.html?lote=" +
        encodeURIComponent(
            ultimoLoteGerado.lote
        ),

        "_blank"

    );

}
