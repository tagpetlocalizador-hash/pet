// =======================================
// PET NFC
// Comunicação com o Apps Script
// =======================================

const API = {

    async enviar(acao, dados = {}) {

        try {

            const resposta = await fetch(CONFIG.API_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    acao,
                    ...dados
                })

            });

            return await resposta.json();

        } catch (erro) {

            console.error("Erro API:", erro);

            return {

                sucesso: false,

                mensagem: "Não foi possível conectar ao servidor."

            };

        }

    },



    // ===========================
    // LOGIN
    // ===========================

    async login(email, senha) {

        return await this.enviar("login", {

            email,
            senha

        });

    },



    // ===========================
    // DADOS DO TUTOR
    // ===========================

    async dadosTutor(token) {

        return await this.enviar("dadosTutor", {

            token

        });

    },



    // ===========================
    // SALVAR ALTERAÇÕES
    // ===========================

    async salvarTutor(token, dados) {

        return await this.enviar("salvarTutor", {

            token,

            ...dados

        });

    },



    // ===========================
    // RECUPERAR SENHA
    // ===========================

    async recuperarSenha(email) {

        return await this.enviar("recuperarSenha", {

            email

        });

    },



    // ===========================
    // VALIDAR TOKEN
    // ===========================

    async validarToken(token) {

        return await this.enviar("validarToken", {

            token

        });

    }

};
