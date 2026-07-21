/*************************************************
 * PET NFC
 * API
 * assets/js/api.js
 * Versão 1.1.0
 *************************************************/

const API = {

    /**
     * ==========================================
     * VERIFICAR CONFIGURAÇÃO
     * ==========================================
     */
    verificarConfiguracao() {

        if (
            typeof CONFIG === "undefined" ||
            !CONFIG.API_URL
        ) {

            throw new Error(
                "A URL da API não foi configurada."
            );

        }

    },


    /**
     * ==========================================
     * INTERPRETAR RESPOSTA
     * ==========================================
     */
    async interpretarResposta(resposta) {

        const texto = await resposta.text();

        if (!texto) {

            return {

                sucesso: false,

                mensagem:
                    "O servidor retornou uma resposta vazia."

            };

        }


        try {

            return JSON.parse(texto);

        } catch (erro) {

            console.error(
                "Resposta inválida do servidor:",
                texto
            );

            return {

                sucesso: false,

                mensagem:
                    "O servidor retornou uma resposta inválida."

            };

        }

    },


    /**
     * ==========================================
     * ENVIA REQUISIÇÃO POST
     * ==========================================
     */
    async enviar(action, dados = {}) {

        try {

            this.verificarConfiguracao();


            const resposta = await fetch(
                CONFIG.API_URL,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "text/plain;charset=utf-8"

                    },

                    body: JSON.stringify({

                        action,

                        ...dados

                    }),

                    redirect: "follow",

                    cache: "no-store"

                }
            );


            if (!resposta.ok) {

                console.error(
                    "Erro HTTP:",
                    resposta.status,
                    resposta.statusText
                );

                return {

                    sucesso: false,

                    mensagem:
                        "O servidor apresentou um erro. Código: " +
                        resposta.status

                };

            }


            return await this.interpretarResposta(
                resposta
            );

        } catch (erro) {

            console.error(
                "Erro API:",
                erro
            );

            return {

                sucesso: false,

                mensagem:
                    "Erro ao conectar com o servidor."

            };

        }

    },


    /**
     * ==========================================
     * ENVIA REQUISIÇÃO GET
     * ==========================================
     */
    async consultar(action, dados = {}) {

        try {

            this.verificarConfiguracao();


            const parametros =
                new URLSearchParams({

                    action,

                    ...dados

                });


            const url =
                CONFIG.API_URL +
                "?" +
                parametros.toString();


            const resposta = await fetch(
                url,
                {

                    method: "GET",

                    redirect: "follow",

                    cache: "no-store"

                }
            );


            if (!resposta.ok) {

                console.error(
                    "Erro HTTP:",
                    resposta.status,
                    resposta.statusText
                );

                return {

                    sucesso: false,

                    mensagem:
                        "O servidor apresentou um erro. Código: " +
                        resposta.status

                };

            }


            return await this.interpretarResposta(
                resposta
            );

        } catch (erro) {

            console.error(
                "Erro de consulta à API:",
                erro
            );

            return {

                sucesso: false,

                mensagem:
                    "Erro ao conectar com o servidor."

            };

        }

    },


    /**
     * ==========================================
     * LOGIN
     * ==========================================
     */
    async login(email, senha) {

        return await this.enviar(

            "login",

            {

                email:
                    String(email || "")
                        .trim()
                        .toLowerCase(),

                senha:
                    String(senha || "")

            }

        );

    },


    /**
     * ==========================================
     * LOGOUT
     * ==========================================
     */
    async logout(token_login) {

        return await this.enviar(

            "logout",

            {

                token_login:
                    String(token_login || "")

            }

        );

    },


    /**
     * ==========================================
     * ATUALIZAR TUTOR
     * ==========================================
     */
    async atualizarTutor(dados = {}) {

    return await this.enviar(
        "atualizarTutor",
        {
            ...dados,

            token_login:
                String(
                    dados.token_login ||
                    dados.token ||
                    ""
                ).trim()
        }
    );

},


    /**
     * ==========================================
     * ALTERAR SENHA
     * ==========================================
     */
    async alterarSenha(dados = {}) {

    return await this.enviar(
        "alterarSenha",
        {
            ...dados,

            token_login:
                String(
                    dados.token_login ||
                    dados.token ||
                    ""
                ).trim(),

            senha_atual:
                String(
                    dados.senha_atual || ""
                ),

            nova_senha:
                String(
                    dados.nova_senha || ""
                )
        }
    );

},


    /**
     * ==========================================
     * SOLICITAR RECUPERAÇÃO
     * ==========================================
     */
    async solicitarRecuperacao(email) {

        return await this.enviar(

            "solicitarRecuperacao",

            {

                email:
                    String(email || "")
                        .trim()
                        .toLowerCase()

            }

        );

    },


    /**
     * ==========================================
     * REDEFINIR SENHA
     * ==========================================
     */
    async redefinirSenha(
        token,
        nova_senha
    ) {

        return await this.enviar(

            "redefinirSenha",

            {

                token:
                    String(token || ""),

                nova_senha:
                    String(nova_senha || "")

            }

        );

    },


    /**
     * ==========================================
     * VALIDAR LOGIN
     * ==========================================
     */
    async validarLogin(token_login) {

        return await this.consultar(

            "validarLogin",

            {

                token_login:
                    String(token_login || "")

            }

        );

    }

};
