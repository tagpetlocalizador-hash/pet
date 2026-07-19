/*************************************************
 * PET NFC
 * api.js
 * Versão 1.3.0
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

        Object.keys(params).forEach(function (key) {

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
                "Servidor respondeu com status " +
                response.status
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

                    "Content-Type":
                        "text/plain;charset=utf-8"

                },

                body:
                    JSON.stringify(dados)

            }

        );


        if (!response.ok) {

            throw new Error(
                "Servidor respondeu com status " +
                response.status
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

    return await apiPost({

        ...dados,

        action:
            ACTION.CADASTRAR_PET

    });

}


async function editarPet(dados) {

    return await apiPost({

        ...dados,

        action:
            ACTION.EDITAR_PET

    });

}


async function atualizarFoto(token, foto) {

    return await apiPost({

        action:
            ACTION.ATUALIZAR_FOTO,

        token:
            token,

        foto:
            foto

    });

}


/**
 * Envia localização sem tentar ler a resposta.
 * Isso evita bloqueio CORS no navegador.
 */
async function enviarLocalizacao(
    token,
    latitude,
    longitude
) {

    try {

        await fetch(

            CONFIG.API_URL,

            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "text/plain;charset=utf-8"

                },

                body: JSON.stringify({

                    action:
                        ACTION.LOCALIZACAO,

                    token:
                        token,

                    latitude:
                        latitude,

                    longitude:
                        longitude

                }),

                mode:
                    "no-cors"

            }

        );


        return {

            sucesso: true,

            mensagem:
                "Localização enviada."

        };


    } catch (erro) {

        console.error(
            "Erro ao enviar localização:",
            erro
        );

        return {

            sucesso: false,

            mensagem:
                "Erro ao conectar com o servidor."

        };

    }

}
