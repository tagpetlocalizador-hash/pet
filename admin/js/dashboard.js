/*************************************************
 * PET NFC ADMIN
 * dashboard.js
 *************************************************/

document.addEventListener(
    "DOMContentLoaded",
    carregarDashboard
);

async function carregarDashboard(){

    const resposta =
        await apiGet(ACTION.ESTATISTICAS);

    if(!resposta.sucesso){

        alert(resposta.mensagem);

        return;

    }

    const dados = resposta.dados;

    document.getElementById("totalTags").innerText =
        dados.total_tags;

    document.getElementById("livres").innerText =
        dados.tags_livres;

    document.getElementById("ativos").innerText =
        dados.pets_ativos;

    document.getElementById("bloqueados").innerText =
        dados.bloqueados;

}
