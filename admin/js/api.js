/*************************************************
 * PET NFC
 * api.js
 * Versão 1.0.0
 *************************************************/

/**
 * Requisição GET
 */
async function apiGet(action, params = {}) {

    try {

        const url = new URL(CONFIG.API_URL);

        url.searchParams.append("action", action);

        Object.keys(params).forEach(key => {
            url.searchParams.append(key, params[key]);
        });

        const response = await fetch(url.toString(), {
            method: "GET"
        });

        return await response.json();

    } catch (erro) {

        console.error(erro);

        return {
            sucesso: false,
            mensagem: "Erro ao conectar com o servidor."
        };

    }

}


/**
 * Requisição POST
 */
async function apiPost(dados = {}) {

    try {

        const response = await fetch(CONFIG.API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(dados)

        });

        return await response.json();

    } catch (erro) {

        console.error(erro);

        return {
            sucesso: false,
            mensagem: "Erro ao conectar com o servidor."
        };

    }

}


/*************************************************
 * PET
 *************************************************/

async function buscarPet(token) {

    return await apiGet(

        ACTION.BUSCAR_PET,

        {
            token: token
        }

    );

}


async function cadastrarPet(dados) {

    dados.action = ACTION.CADASTRAR_PET;

    return await apiPost(dados);

}


async function editarPet(dados) {

    dados.action = ACTION.EDITAR_PET;

    return await apiPost(dados);

}


async function atualizarFoto(token, foto) {

    return await apiPost({

        action: ACTION.ATUALIZAR_FOTO,

        token: token,

        foto: foto

    });

}


async function enviarLocalizacao(token, latitude, longitude) {

    return await apiPost({

        action: ACTION.LOCALIZACAO,

        token: token,

        latitude: latitude,

        longitude: longitude

    });

}


/*************************************************
 * ADMIN
 *************************************************/

async function gerarTag() {

    return await apiGet(

        ACTION.GERAR_TAG

    );

}


async function gerarLote(qtd) {

    return await apiGet(

        ACTION.GERAR_LOTE,

        {
            qtd: qtd
        }

    );

}


async function listarTags() {

    return await apiGet(

        ACTION.LISTAR_TAGS

    );

}


async function buscarTag(token) {

    return await apiGet(

        ACTION.BUSCAR_TAG,

        {
            token: token
        }

    );

}


async function bloquearTag(token) {

    return await apiPost({

        action: ACTION.BLOQUEAR_TAG,

        token: token

    });

}


async function reativarTag(token) {

    return await apiPost({

        action: ACTION.REATIVAR_TAG,

        token: token

    });

}


async function resetarTag(token) {

    alert("AÇÃO = " + ACTION.RESETAR_TAG);

    return await apiGet(
        ACTION.RESETAR_TAG,
        {
            token: token
        }
    );

}
async function excluirTag(token) {

    return await apiPost({

        action: ACTION.EXCLUIR_TAG,

        token: token

    });

}


async function estatisticas() {

    return await apiGet(

        ACTION.ESTATISTICAS

    );

}
