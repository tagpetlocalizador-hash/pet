/*************************************************
 * PET NFC ADMIN
 * tags.js
 *************************************************/

let modalNovaTag;

/* ===================================================
   INICIALIZAÇÃO
=================================================== */

document.addEventListener("DOMContentLoaded", () => {

    modalNovaTag = new bootstrap.Modal(
        document.getElementById("modalNovaTag")
    );

    document
        .getElementById("btnNovaTag")
        .addEventListener("click", criarNovaTag);

    document
        .getElementById("btnCopiar")
        .addEventListener("click", copiarLink);

    document
        .getElementById("btnEtiqueta")
        .addEventListener("click", abrirEtiqueta);

    carregarTags();

});

/* ===================================================
   CARREGA TAGS
=================================================== */

async function carregarTags() {

    const resposta = await apiGet(ACTION.LISTAR_TAGS);

    if (!resposta.sucesso) {

        alert(resposta.mensagem);

        return;

    }

    const tbody = document.getElementById("listaTags");

    tbody.innerHTML = "";

    resposta.dados.forEach(tag => {

        tbody.innerHTML += `

        <tr>

            <td>${tag.id}</td>

            <td>${tag.token}</td>

            <td>

                <span class="badge bg-${
                    tag.status==="ATIVO"
                    ? "success"
                    : tag.status==="BLOQUEADO"
                    ? "danger"
                    : "secondary"
                }">

                    ${tag.status}

                </span>

            </td>

            <td>${tag.nome_pet || "-"}</td>

            <td>

                <button
                    class="btn btn-sm btn-primary"
                    title="Editar">

                    <i class="bi bi-pencil"></i>

                </button>

                

                <button
    class="btn btn-sm btn-warning"
    title="Resetar"
    onclick="resetarTagConfirm('${tag.token}')">

    <i class="bi bi-arrow-clockwise"></i>

</button>
<button
    class="btn btn-sm btn-secondary"
    title="Bloquear">

    <i class="bi bi-lock"></i>

</button>

                <button
                    class="btn btn-sm btn-danger"
                    title="Excluir">

                    <i class="bi bi-trash"></i>

                </button>

            </td>

        </tr>

        `;

    });

}
/* ===================================================
   RESETAR TAG
=================================================== */

async function resetarTagConfirm(token) {

    const confirmar = confirm(
        "Deseja realmente resetar esta TAG?\n\nO vínculo com o pet será removido."
    );

    if (!confirmar) return;

    const resposta = await resetarTag(token);

    if (!resposta.sucesso) {

        alert(resposta.mensagem);

        return;

    }

    alert(resposta.mensagem);

    carregarTags();

}
/* ===================================================
   NOVA TAG
=================================================== */

async function criarNovaTag() {

    const resposta = await apiGet(
        ACTION.GERAR_TAG
    );

    if (!resposta.sucesso) {

        alert(resposta.mensagem);

        return;

    }

    document.getElementById("novoId").innerText =
        resposta.id;

    document.getElementById("novoToken").innerText =
        resposta.token;

    document.getElementById("novaUrl").value =
        resposta.url;

    document
        .getElementById("btnEtiqueta")
        .dataset.token = resposta.token;

    modalNovaTag.show();

    carregarTags();

}

/* ===================================================
   VISUALIZAR ETIQUETA
=================================================== */

function abrirEtiqueta() {

    const token = document
        .getElementById("btnEtiqueta")
        .dataset.token;

    if (!token) {

        alert("Token não encontrado.");

        return;

    }

    const url = "etiqueta.html?token=" + token;

    console.log("Abrindo:", url);

    window.location.href = url;

}

/* ===================================================
   COPIAR LINK
=================================================== */

function copiarLink() {

    const campo =
        document.getElementById("novaUrl");

    campo.select();

    campo.setSelectionRange(0,99999);

    navigator.clipboard.writeText(
        campo.value
    );

    alert("Link copiado.");

}
