/*************************************************
 * PET NFC
 * API
 * assets/js/api.js
 * Versão 1.0.0
 *************************************************/

const API = {

    /**
     * ==========================================
     * ENVIA REQUISIÇÃO POST
     * ==========================================
     */
    async enviar(action, dados = {}) {

        try {

            const resposta = await fetch(CONFIG.API_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                },

                body: JSON.stringify({

                    action: action,

                    ...dados

                })

            });

            return await resposta.json();

        } catch (erro) {

            console.error("Erro API:", erro);

            return {

                sucesso: false,

                mensagem: "Erro ao conectar ao servidor."

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

                email,

                senha

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

                token_login

            }

        );

    },



    /**
     * ==========================================
     * ATUALIZAR TUTOR
     * ==========================================
     */
    async atualizarTutor(token_login, dados) {

        return await this.enviar(

            "atualizarTutor",

            {

                token_login,

                ...dados

            }

        );

    },



    /**
     * ==========================================
     * ALTERAR SENHA
     * ==========================================
     */
    async alterarSenha(

        token_login,

        senha_atual,

        nova_senha

    ) {

        return await this.enviar(

            "alterarSenha",

            {

                token_login,

                senha_atual,

                nova_senha

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

                email

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

                token,

                nova_senha

            }

        );

    },



    /**
     * ==========================================
     * VALIDAR LOGIN
     * ==========================================
     */
    async validarLogin(token_login) {

        try {

            const url =

                CONFIG.API_URL +

                "?action=validarLogin" +

                "&token_login=" +

                encodeURIComponent(token_login);

            const resposta =

                await fetch(url);

            return await resposta.json();

        } catch (erro) {

            console.error(

                "Erro validarLogin:",

                erro

            );

            return {

                sucesso: false,

                mensagem:

                    "Erro ao validar sessão."

            };

        }

    }

};
