/*************************************************
 * PET NFC
 * api.js
 * Versão 1.3.0
 *************************************************/


/**
 * Requisição GET com novas tentativas automáticas
 */
async function apiGet(
    action,
    params = {},
    tentativa = 1
) {

    const MAX_TENTATIVAS = 2;

    let limiteTempo;

    try {

        const url =
            new URL(
                CONFIG.API_URL
            );

        url.searchParams.set(
            "action",
            action
        );

        /*
         * Evita resposta antiga armazenada
         * pelo navegador.
         */
        url.searchParams.set(
            "_t",
            Date.now()
        );

        Object.keys(params).forEach(
            function (key) {

                if (
                    params[key] !== undefined &&
                    params[key] !== null
                ) {

                    url.searchParams.set(
                        key,
                        String(params[key])
                    );

                }

            }
        );


        const controlador =
            new AbortController();


        limiteTempo =
            setTimeout(
                function () {

                    controlador.abort();

                },
                8000
            );


        const response =
            await fetch(
                url.toString(),
                {

                    method:
                        "GET",

                    cache:
                        "no-store",

                    redirect:
                        "follow",

                    signal:
                        controlador.signal

                }
            );


        clearTimeout(
            limiteTempo
        );


        if (!response.ok) {

            throw new Error(
                "Servidor respondeu com status " +
                response.status
            );

        }


        const resposta =
            await response.json();


        return resposta;


    } catch (erro) {

        if (limiteTempo) {

            clearTimeout(
                limiteTempo
            );

        }


        console.warn(
            "Falha na tentativa " +
            tentativa +
            " da ação " +
            action +
            ":",
            erro
        );


        if (
            tentativa <
            MAX_TENTATIVAS
        ) {

            await new Promise(
                function (resolver) {

                    setTimeout(
                        resolver,
                        tentativa * 1000
                    );

                }
            );


            return apiGet(
                action,
                params,
                tentativa + 1
            );

        }


        console.error(
            "Erro na requisição GET após " +
            MAX_TENTATIVAS +
            " tentativas:",
            erro
        );


        return {

            sucesso:
                false,

            codigo:
                "ERRO_CONEXAO",

            mensagem:
                "Erro ao conectar com o servidor. Tente novamente em alguns instantes."

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

/**
 * Login automático do tutor
 */
async function fazerLoginTutor(
    email,
    senha
) {

    return await apiPost({

        action:
            ACTION.LOGIN_TUTOR,

        email:
            email,

        senha:
            senha

    });

}

/**
 * Solicita recuperação de senha durante
 * o cadastro de um novo pet.
 */
async function solicitarRecuperacaoCadastro(email) {

    return await apiPost({

        action:
            "solicitarRecuperacao",

        email:
            String(email || "")
                .trim()
                .toLowerCase()

    });

}

async function atualizarFoto(
    tokenLogin,
    tokenPet,
    foto
) {

    return await apiPost({

        action:
            ACTION.ATUALIZAR_FOTO,

        token_login:
            tokenLogin,

        token:
            tokenPet,

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
