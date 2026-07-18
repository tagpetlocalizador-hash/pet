/*************************************************
 * PET NFC
 * api.js
 * Versão 1.1.0
 *************************************************/


/**
 * Requisição GET
 */
async function apiGet(action, params = {}) {

    try {

        const url = new URL(CONFIG.API_URL);

        url.searchParams.set(
            "action",
            action
        );

        Object.keys(params).forEach(key => {

            if (
                params[key] !== undefined &&
                params[key] !== null
            ) {

                url.searchParams.set(
                    key,
                    params[key]
                );

            }

        });


        const response = await fetch(
            url.toString(),
            {
                method: "GET",
                cache: "no-store"
            }
        );


        if (!response.ok) {

            throw new Error(
                "Erro HTTP: " + response.status
            );

        }


        return await response.json();


    } catch (erro) {

        console.error(
            "Erro na requisição GET:",
            erro
        );

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

        const response = await fetch(
            CONFIG.API_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                },

                body: JSON.stringify(dados)
            }
        );


        if (!response.ok) {

            throw new Error(
                "Erro HTTP: " + response.status
            );

        }


        return await response.json();


    } catch (erro) {

        console.error(
            "Erro na requisição POST:",
            erro
        );

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

    return await apiPost({
        ...dados,
        action: ACTION.CADASTRAR_PET
    });

}


async function editarPet(dados) {

    return await apiPost({
        ...dados,
        action: ACTION.EDITAR_PET
    });

}


async function atualizarFoto(token, foto) {

    return await apiPost({
        action: ACTION.ATUALIZAR_FOTO,
        token: token,
        foto: foto
    });

}


async function enviarLocalizacao(
    token,
    latitude,
    longitude
) {

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


/**
 * Reseta a TAG usando POST
 */
async function resetarTag(token) {

    return await apiPost({
        action: ACTION.RESETAR_TAG,
        token: token
    });

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
