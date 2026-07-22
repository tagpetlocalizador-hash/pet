/*************************************************
 * PET NFC ADMIN
 * tags.js
 * Versão 1.1.0
 *************************************************/

let modalNovaTag;


/* ===================================================
   INICIALIZAÇÃO
=================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const elementoModal =
        document.getElementById("modalNovaTag");

    if (elementoModal) {

        modalNovaTag =
            new bootstrap.Modal(elementoModal);

    }


    const btnNovaTag =
        document.getElementById("btnNovaTag");

    if (btnNovaTag) {

        btnNovaTag.addEventListener(
            "click",
            criarNovaTag
        );

    }


    const btnCopiar =
        document.getElementById("btnCopiar");

    if (btnCopiar) {

        btnCopiar.addEventListener(
            "click",
            copiarLink
        );

    }


    const btnEtiqueta =
        document.getElementById("btnEtiqueta");

    if (btnEtiqueta) {

        btnEtiqueta.addEventListener(
            "click",
            abrirEtiqueta
        );

    }


    carregarTags();

});


/* ===================================================
   CARREGA TAGS
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

            <td colspan="5" class="text-center">

                Carregando TAGs...

            </td>

        </tr>

    `;


    const resposta =
        await listarTags();


    if (!resposta.sucesso) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="text-center text-danger">

                    ${resposta.mensagem}

                </td>

            </tr>

        `;

        return;

    }


    tbody.innerHTML = "";


    if (
        !Array.isArray(resposta.dados) ||
        resposta.dados.length === 0
    ) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="text-center">

                    Nenhuma TAG cadastrada.

                </td>

            </tr>

        `;

        return;

    }


    resposta.dados.forEach(tag => {

        const token =
            String(tag.token || "");

        const status =
            String(tag.status || "");

        const nomePet =
            String(tag.nome_pet || "-");


        let corStatus = "secondary";

        if (status === "ATIVO") {

            corStatus = "success";

        } else if (status === "BLOQUEADO") {

            corStatus = "danger";

        }


        const botaoStatus =
            status === "BLOQUEADO"

            ? `

                <button
                    type="button"
                    class="btn btn-sm btn-success"
                    title="Reativar"
                    onclick="reativarTagConfirm('${token}')">

                    <i class="bi bi-unlock"></i>

                </button>

            `

            : `

                <button
                    type="button"
                    class="btn btn-sm btn-secondary"
                    title="Bloquear"
                    onclick="bloquearTagConfirm('${token}')">

                    <i class="bi bi-lock"></i>

                </button>

            `;


        tbody.insertAdjacentHTML(

            "beforeend",

            `

            <tr>

                <td>${tag.id || "-"}</td>

                <td>${token}</td>

                <td>

                    <span class="badge bg-${corStatus}">

                        ${status || "-"}

                    </span>

                </td>

                <td>${nomePet}</td>

                <td>

                    <button
                        type="button"
                        class="btn btn-sm btn-primary"
                        title="Editar"
                        onclick="editarTag('${token}')">

                        <i class="bi bi-pencil"></i>

                    </button>


                    <button
                        type="button"
                        class="btn btn-sm btn-warning"
                        title="Resetar"
                        onclick="resetarTagConfirm('${token}')">

                        <i class="bi bi-arrow-clockwise"></i>

                    </button>


                    ${botaoStatus}


                    <button
                        type="button"
                        class="btn btn-sm btn-danger"
                        title="Excluir"
                        onclick="excluirTagConfirm('${token}')">

                        <i class="bi bi-trash"></i>

                    </button>

                </td>

            </tr>

            `

        );

    });

}


/* ===================================================
   EDITAR TAG
=================================================== */

function editarTag(token) {

    if (!token) {

        alert("Token da TAG não encontrado.");

        return;

    }

    /*
     * Direciona para a página pública da TAG.
     * Nela o pet poderá ser cadastrado ou editado.
     */

    const url =
        CONFIG.URL_SITE +
        "/?token=" +
        encodeURIComponent(token);

    window.open(
        url,
        "_blank"
    );

}


/* ===================================================
   RESETAR TAG
=================================================== */

async function resetarTagConfirm(token) {

    const confirmar = confirm(

        "Deseja realmente resetar esta TAG?\n\n" +
        "O vínculo com o pet será removido."

    );

    if (!confirmar) return;


    const resposta =
        await resetarTag(token);


    if (!resposta.sucesso) {

        alert(resposta.mensagem);

        return;

    }


    alert(
        resposta.mensagem ||
        "TAG resetada com sucesso."
    );

    await carregarTags();

}


/* ===================================================
   BLOQUEAR TAG
=================================================== */

async function bloquearTagConfirm(token) {

    const confirmar = confirm(

        "Deseja realmente bloquear esta TAG?\n\n" +
        "O perfil não poderá ser utilizado enquanto estiver bloqueado."

    );

    if (!confirmar) return;


    const resposta =
        await bloquearTag(token);


    if (!resposta.sucesso) {

        alert(resposta.mensagem);

        return;

    }


    alert(
        resposta.mensagem ||
        "TAG bloqueada com sucesso."
    );

    await carregarTags();

}


/* ===================================================
   REATIVAR TAG
=================================================== */

async function reativarTagConfirm(token) {

    const confirmar = confirm(

        "Deseja reativar esta TAG?"

    );

    if (!confirmar) return;


    const resposta =
        await reativarTag(token);


    if (!resposta.sucesso) {

        alert(resposta.mensagem);

        return;

    }


    alert(
        resposta.mensagem ||
        "TAG reativada com sucesso."
    );

    await carregarTags();

}


/* ===================================================
   EXCLUIR TAG
=================================================== */

async function excluirTagConfirm(token) {

    const confirmar = confirm(

        "ATENÇÃO!\n\n" +
        "Deseja realmente excluir esta TAG?\n\n" +
        "Esta ação pode não ser reversível."

    );

    if (!confirmar) return;


    const resposta =
        await excluirTag(token);


    if (!resposta.sucesso) {

        alert(resposta.mensagem);

        return;

    }


    alert(
        resposta.mensagem ||
        "TAG excluída com sucesso."
    );

    await carregarTags();

}


/* ===================================================
   NOVA TAG
=================================================== */

async function criarNovaTag() {

    const resposta =
        await gerarTag();


    if (!resposta.sucesso) {

        alert(resposta.mensagem);

        return;

    }


    document
        .getElementById("novoId")
        .innerText =
        resposta.id;


    document
    .getElementById("novoToken")
    .innerText =
    resposta.token;

    document
    .getElementById("novoCodigoAtivacao")
    .innerText =
    resposta.codigo_ativacao || "-";

    document
    .getElementById("novaUrl")
    .value =
    resposta.url;


    document
        .getElementById("btnEtiqueta")
        .dataset.token =
        resposta.token;


    if (modalNovaTag) {

        modalNovaTag.show();

    }


    await carregarTags();

}


/* ===================================================
   VISUALIZAR ETIQUETA
=================================================== */

function abrirEtiqueta() {

    const botao =
        document.getElementById("btnEtiqueta");

    const token =
        botao
        ? botao.dataset.token
        : "";


    if (!token) {

        alert("Token não encontrado.");

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
        document.getElementById("novaUrl");


    if (!campo || !campo.value) {

        alert("Link não encontrado.");

        return;

    }


    try {

        await navigator.clipboard.writeText(
            campo.value
        );

        alert("Link copiado.");

    } catch (erro) {

        campo.select();

        campo.setSelectionRange(
            0,
            99999
        );

        document.execCommand("copy");

        alert("Link copiado.");

    }

}
