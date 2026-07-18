/*************************************************
 * PET NFC ADMIN
 * dashboard.js
 *************************************************/

document.addEventListener("DOMContentLoaded", carregarDashboard);

async function carregarDashboard(){

    const dados = await apiGet(ACTION.ESTATISTICAS);

    if(!dados.sucesso){

        alert(dados.mensagem);

        return;

    }

    document.getElementById("totalTags").innerText = dados.total;

    document.getElementById("livres").innerText = dados.livres;

    document.getElementById("ativos").innerText = dados.ativos;

    document.getElementById("bloqueados").innerText = dados.bloqueados;

}
