/*************************************************
 * PET NFC ADMIN
 * tags.js
 *************************************************/

document.addEventListener("DOMContentLoaded", carregarTags);

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

            <td>${tag.status}</td>

            <td>${tag.nome_pet || "-"}</td>

            <td>

                <button class="btn btn-sm btn-primary">
                    <i class="bi bi-pencil"></i>
                </button>

                <button class="btn btn-sm btn-warning">
                    <i class="bi bi-arrow-clockwise"></i>
                </button>

                <button class="btn btn-sm btn-secondary">
                    <i class="bi bi-lock"></i>
                </button>

                <button class="btn btn-sm btn-danger">
                    <i class="bi bi-trash"></i>
                </button>

            </td>

        </tr>

        `;

    });

}
