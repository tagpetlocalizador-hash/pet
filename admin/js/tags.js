document.addEventListener("DOMContentLoaded", carregarTags);

async function carregarTags(){

    const resposta = await apiGet(ACTION.LISTAR_TAGS);

    console.log(resposta);

}
