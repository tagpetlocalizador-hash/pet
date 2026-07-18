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

        url.searchParams.append("action", action);

        Object.keys(params).forEach(key => {

            url.searchParams.append(
                key,
                params[key]
            );

        });


        const response = await fetch(url.toString(), {

            method: "GET"

        });


        return await response.json();


    } catch (erro) {

        console.error(erro);

        return {

            sucesso: false,

            mensagem:
            "Erro ao conectar com o servidor."

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

                    /*
                    Evita preflight CORS
                    no Google Apps Script
                    */

                    "Content-Type": "text/plain"

                },


                body: JSON.stringify(dados)

            }

        );


        return await response.json();


    } catch (erro) {


        console.error(erro);


        return {

            sucesso: false,

            mensagem:
            "Erro ao conectar com o servidor."

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


    dados.action =
        ACTION.CADASTRAR_PET;


    return await apiPost(dados);


}



async function editarPet(dados) {


    dados.action =
        ACTION.EDITAR_PET;


    return await apiPost(dados);


}



async function atualizarFoto(token, foto) {


    return await apiPost({

        action:
        ACTION.ATUALIZAR_FOTO,


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

        action:
        ACTION.LOCALIZACAO,


        token: token,


        latitude: latitude,


        longitude: longitude


    });


}
