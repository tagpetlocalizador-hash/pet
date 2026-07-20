// =======================================
// PET NFC
// Comunicação com o Apps Script
// assets/js/api.js
// =======================================

const API = {

    /**
     * Envia uma solicitação POST ao Apps Script.
     */
    async enviar(action, dados = {}) {

        try {

            if (
                typeof CONFIG === "undefined" ||
                !CONFIG.API_URL
            ) {

                throw new Error(
                    "A URL da API não foi configurada."
                );

            }

            const resposta = await fetch(
                CONFIG.API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "text/plain;charset=utf-8"
                    },

                    body: JSON.stringify({
                        action: action,
                        ...dados
                    })
                }
            );

            const texto = await resposta.text();

            let resultado;

            try {

                resultado = JSON.parse(texto);

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

            return resultado;

        } catch (erro) {

            console.error(
                "Erro na comunicação com a API:",
                erro
            );

            return {
                sucesso: false,
                mensagem:
                    "Não foi possível conectar ao servidor."
            };

        }

    },


    /**
     * Login do tutor.
     */
    async login(email, senha) {

        return await this.enviar(
            "login",
            {
                email: String(email || "").trim(),
                senha: String(senha || "")
            }
        );

    },


    /**
     * Logout do tutor.
     */
    async logout(tokenLogin) {

        return await this.enviar(
            "logout",
            {
                token_login: tokenLogin
            }
        );

    },


    /**
     * Atualiza os dados do tutor.
     */
    async atualizarTutor(tokenLogin, dados) {

        return await this.enviar(
            "atualizarTutor",
            {
                token_login: tokenLogin,
                ...dados
            }
        );

    },


    /**
     * Altera a senha do tutor.
     */
    async alterarSenha(
        tokenLogin,
        senhaAtual,
        novaSenha
    ) {

        return await this.enviar(
            "alterarSenha",
            {
                token_login: tokenLogin,
                senha_atual: senhaAtual,
                nova_senha: novaSenha
            }
        );

    },


    /**
     * Solicita recuperação de senha.
     */
    async solicitarRecuperacao(email) {

        return await this.enviar(
            "solicitarRecuperacao",
            {
                email: String(email || "").trim()
            }
        );

    },


    /**
     * Redefine a senha usando o token recebido.
     */
    async redefinirSenha(
        tokenRecuperacao,
        novaSenha
    ) {

        return await this.enviar(
            "redefinirSenha",
            {
                token_recuperacao: tokenRecuperacao,
                nova_senha: novaSenha
            }
        );

    },


    /**
     * Valida o token de login usando GET.
     */
    async validarLogin(tokenLogin) {

        try {

            const url = new URL(
                CONFIG.API_URL
            );

            url.searchParams.set(
                "action",
                "validarLogin"
            );

            url.searchParams.set(
                "token_login",
                tokenLogin
            );

            const resposta = await fetch(
                url.toString(),
                {
                    method: "GET"
                }
            );

            return await resposta.json();

        } catch (erro) {

            console.error(
                "Erro ao validar login:",
                erro
            );

            return {
                sucesso: false,
                mensagem:
                    "Não foi possível validar o acesso."
            };

        }

    }

};
