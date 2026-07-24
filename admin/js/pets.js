let pets = [];
let petsFiltrados = [];
let modalPet;

//==================================================
// INICIAR
//==================================================

document.addEventListener("DOMContentLoaded", async () => {

    modalPet = new bootstrap.Modal(
        document.getElementById("modalPet")
    );

    await carregarPets();

    document
        .getElementById("pesquisa")
        .addEventListener(
            "input",
            pesquisarPets
        );

});

//==================================================
// CARREGAR PETS
//==================================================

async function carregarPets() {

    const tbody =
        document.getElementById("listaPets");

    tbody.innerHTML = `
        <tr>
            <td colspan="6" class="text-center py-5">
                Carregando...
            </td>
        </tr>
    `;

    try{

        const resposta =
            await listarPets();

        if(!resposta.sucesso){

            throw new Error(
                resposta.mensagem
            );

        }

        pets = resposta.dados || [];

        petsFiltrados = [...pets];

        document.getElementById(
            "totalPets"
        ).innerText = pets.length;

        desenharTabela();

    }

    catch(erro){

        tbody.innerHTML = `
        <tr>
            <td colspan="6"
                class="text-center text-danger">

                ${erro}

            </td>
        </tr>
        `;

    }

}

//==================================================
// PESQUISA
//==================================================

function pesquisarPets(){

    const texto =
        document
        .getElementById("pesquisa")
        .value
        .toLowerCase()
        .trim();

    petsFiltrados = pets.filter(p=>{

        return (

            String(p.nome_pet)
            .toLowerCase()
            .includes(texto)

            ||

            String(p.nome_tutor)
            .toLowerCase()
            .includes(texto)

            ||

            String(p.whatsapp)
            .includes(texto)

            ||

            String(p.email)
            .toLowerCase()
            .includes(texto)

            ||

            String(p.token)
            .toLowerCase()
            .includes(texto)

        );

    });

    desenharTabela();

}

//==================================================
// TABELA
//==================================================

function desenharTabela(){

    const tbody =
        document.getElementById(
            "listaPets"
        );

    if(petsFiltrados.length==0){

        tbody.innerHTML=`
        <tr>

        <td colspan="6"
            class="text-center py-5">

            Nenhum pet encontrado.

        </td>

        </tr>
        `;

        return;

    }

    tbody.innerHTML="";

    petsFiltrados.forEach(pet=>{

        let foto =
            pet.foto
            ?
            pet.foto
            :
            "https://placehold.co/80x80?text=PET";

        let badge = `
            <span
            class="badge bg-success">
            ${pet.status}
            </span>
        `;

        if(pet.status=="BLOQUEADO"){

            badge=`
            <span
            class="badge bg-danger">
            BLOQUEADO
            </span>
            `;

        }

        if(pet.status=="LIVRE"){

            badge=`
            <span
            class="badge bg-secondary">
            LIVRE
            </span>
            `;

        }

        tbody.innerHTML += `

<tr>

<td>

<img
src="${foto}"

style="
width:60px;
height:60px;
border-radius:50%;
object-fit:cover;
">

</td>

<td>

<strong>

${pet.nome_pet}

</strong>

</td>

<td>

${pet.nome_tutor}

</td>

<td>

${pet.whatsapp}

</td>

<td>

${badge}

</td>

<td>

<button

class="btn btn-sm btn-primary"

onclick="abrirPet('${pet.token}')">

<i class="bi bi-eye"></i>

</button>

<button
class="btn btn-sm btn-warning"
onclick="editarPetAdmin('${pet.token}')"
title="Editar pet">

<i class="bi bi-pencil"></i>

</button>

<button
class="btn btn-sm btn-danger"
onclick="excluirPetAdmin('${pet.token}')"
title="Excluir pet">

<i class="bi bi-trash"></i>

</button>

</td>

</tr>

`;

    });

}

//==================================================
// MODAL
//==================================================

function abrirPet(token){

    const pet =
        pets.find(
            p=>p.token==token
        );

    if(!pet){

        return;

    }

    document.getElementById(
        "modalFotoPet"
    ).src =
        pet.foto
        ?
        pet.foto
        :
        "https://placehold.co/200x200?text=PET";

    document.getElementById(
        "modalNomePet"
    ).innerText =
        pet.nome_pet;

    document.getElementById(
        "modalTutor"
    ).innerText =
        pet.nome_tutor;

    document.getElementById(
        "modalStatus"
    ).innerText =
        pet.status;

    document.getElementById(
        "modalWhatsapp"
    ).innerText =
        pet.whatsapp;

    document.getElementById(
        "modalEmail"
    ).innerText =
        pet.email;

    document.getElementById(
        "modalToken"
    ).innerText =
        pet.token;

    document.getElementById(
        "modalDataCadastro"
    ).innerText =
        pet.data_cadastro;

    document.getElementById(
        "modalLocalizacao"
    ).innerText =
        pet.ultima_localizacao ||
        "-";

    document.getElementById(
        "btnAbrirWhatsapp"
    ).href =
        "https://wa.me/" +
        pet.whatsapp;

    document.getElementById(
        "btnAbrirPaginaPet"
    ).href =
        CONFIG.URL_SITE +
        "/?token=" +
        pet.token;

    modalPet.show();

}

//==================================================
// EDITAR PET
//==================================================
function editarPetAdmin(token){

    window.location.href =
        "perfil-pet.html?token=" +
        encodeURIComponent(token);

}

//==================================================
// EXCLUIR PET
//==================================================

async function excluirPetAdmin(token) {

    const pet = pets.find(
        item => item.token === token
    );

    if (!pet) {

        alert("Pet não encontrado.");

        return;

    }

    const confirmar = confirm(
        "Deseja realmente excluir o pet " +
        pet.nome_pet +
        "?\n\n" +
        "A TAG será resetada e ficará disponível para outro cadastro."
    );

    if (!confirmar) {

        return;

    }

    try {

        /*
         * Usa a função resetarTag já existente
         * no arquivo api.js.
         */
        const resposta =
            await resetarTag(token);

        if (!resposta.sucesso) {

            throw new Error(
                resposta.mensagem ||
                "Não foi possível excluir o pet."
            );

        }

        alert(
            "Pet excluído com sucesso.\n" +
            "A TAG agora está LIVRE."
        );

        await carregarPets();

    } catch (erro) {

        alert(
            "Erro ao excluir pet:\n" +
            erro.message
        );

    }

}
