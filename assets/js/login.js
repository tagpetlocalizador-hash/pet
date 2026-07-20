// ==========================================
// PET NFC - Login do Tutor
// assets/js/login.js
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // ======================================
    // ELEMENTOS
    // ======================================

    const form = document.getElementById("formLogin");
    const campoEmail = document.getElementById("email");
    const campoSenha = document.getElementById("senha");
    const lembrar = document.getElementById("lembrar");

    const btnEntrar = document.getElementById("btnEntrar");
    const btnMostrarSenha =
        document.getElementById("btnMostrarSenha");

    const mensagem =
        document.getElementById("mensagemLogin");

    const textoMensagem =
        mensagem?.querySelector("span");

    const iconeMensagem =
        mensagem?.querySelector("i");


    // ======================================
    // VERIFICAR ELEMENTOS
    // ======================================

    if (
        !form ||
        !campoEmail ||
        !campoSenha ||
        !btnEntrar ||
        !mensagem ||
        !textoMensagem
    ) {

        console.error(
            "Erro: elementos obrigatórios do login não foram encontrados."
        );

        return;

    }


    // ======================================
    // MOSTRAR MENSAGEM
    // ======================================

    function mostrarMensagem(
        texto,
        tipo = "erro"
    ) {

        mensagem.classList.remove(
            "sucesso",
            "erro"
        );

        mensagem.classList.add(
            "mostrar",
            tipo
        );

        textoMensagem.textContent = texto;

        mensagem.style.display = "flex";


        if (iconeMensagem) {

            if (tipo === "sucesso") {

                iconeMensagem.className =
                    "bi bi-check-circle-fill";

            } else {

                iconeMensagem.className =
                    "bi bi-exclamation-circle-fill";

            }

        }

    }


    // ======================================
    // ESCONDER MENSAGEM
    // ======================================

    function esconderMensagem() {

        mensagem.classList.remove(
            "mostrar",
            "sucesso",
            "erro"
        );

        mensagem.style.display = "none";

        textoMensagem.textContent = "";

    }


    // ======================================
    // VALIDAR E-MAIL
    // ======================================

    function emailValido(email) {

        const expressao =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return expressao.test(email);

    }


    // ======================================
    // ATIVAR CARREGAMENTO
    // ======================================

    function ativarCarregamento() {

        btnEntrar.disabled = true;

        campoEmail.disabled = true;
        campoSenha.disabled = true;

        if (lembrar) {
            lembrar.disabled = true;
        }

        btnEntrar.classList.add(
            "carregando"
        );

    }


    // ======================================
    // DESATIVAR CARREGAMENTO
    // ======================================

    function desativarCarregamento() {

        btnEntrar.disabled = false;

        campoEmail.disabled = false;
        campoSenha.disabled = false;

        if (lembrar) {
            lembrar.disabled = false;
        }

        btnEntrar.classList.remove(
            "carregando"
        );

    }


    // ======================================
    // MOSTRAR OU OCULTAR SENHA
    // ======================================

    if (btnMostrarSenha) {

        btnMostrarSenha.addEventListener(
            "click",
            function () {

                const senhaVisivel =
                    campoSenha.type === "text";

                campoSenha.type =
                    senhaVisivel
                        ? "password"
                        : "text";

                btnMostrarSenha.innerHTML =
                    senhaVisivel
                        ? '<i class="bi bi-eye"></i>'
                        : '<i class="bi bi-eye-slash"></i>';

                btnMostrarSenha.setAttribute(
                    "aria-label",
                    senhaVisivel
                        ? "Mostrar senha"
                        : "Ocultar senha"
                );

            }
        );

    }


    // ======================================
    // REMOVER ERRO AO DIGITAR
    // ======================================

    campoEmail.addEventListener(
        "input",
        function () {

            campoEmail.classList.remove(
                "campo-erro"
            );

            esconderMensagem();

        }
    );


    campoSenha.addEventListener(
        "input",
        function () {

            campoSenha.classList.remove(
                "campo-erro"
            );

            esconderMensagem();

        }
    );


    // ======================================
    // ENVIAR LOGIN
    // ======================================

    form.addEventListener(
        "submit",
        async function (evento) {

            evento.preventDefault();

            esconderMensagem();

            campoEmail.classList.remove(
                "campo-erro"
            );

            campoSenha.classList.remove(
                "campo-erro"
            );


            const email =
                campoEmail
                    .value
                    .trim()
                    .toLowerCase();

            const senha =
                campoSenha.value;


            // ==================================
            // CAMPO E-MAIL VAZIO
            // ==================================

            if (!email) {

                campoEmail.classList.add(
                    "campo-erro"
                );

                mostrarMensagem(
                    "Informe seu e-mail."
                );

                campoEmail.focus();

                return;

            }


            // ==================================
            // E-MAIL INVÁLIDO
            // ==================================

            if (!emailValido(email)) {

                campoEmail.classList.add(
                    "campo-erro"
                );

                mostrarMensagem(
                    "Informe um endereço de e-mail válido."
                );

                campoEmail.focus();

                return;

            }


            // ==================================
            // SENHA VAZIA
            // ==================================

            if (!senha.trim()) {

                campoSenha.classList.add(
                    "campo-erro"
                );

                mostrarMensagem(
                    "Informe sua senha."
                );

                campoSenha.focus();

                return;

            }


            ativarCarregamento();


            try {

                // ==================================
                // VERIFICAR API
                // ==================================

                if (
                    typeof API === "undefined" ||
                    typeof API.login !== "function"
                ) {

                    throw new Error(
                        "A função API.login não foi carregada."
                    );

                }


                // ==================================
                // LOGIN NO APPS SCRIPT
                // ==================================

                const resposta =
                    await API.login(
                        email,
                        senha
                    );


                // ==================================
                // LOGIN REALIZADO
                // ==================================

                if (
                    resposta &&
                    resposta.sucesso
                ) {

                    const armazenamento =
                        lembrar?.checked
                            ? localStorage
                            : sessionStorage;


                    // Limpa sessões anteriores

                    localStorage.removeItem(
                        "pet_nfc_token_login"
                    );

                    localStorage.removeItem(
                        "pet_nfc_nome_pet"
                    );

                    localStorage.removeItem(
                        "pet_nfc_nome_tutor"
                    );

                    sessionStorage.removeItem(
                        "pet_nfc_token_login"
                    );

                    sessionStorage.removeItem(
                        "pet_nfc_nome_pet"
                    );

                    sessionStorage.removeItem(
                        "pet_nfc_nome_tutor"
                    );


                    // Salva nova sessão

                    armazenamento.setItem(
                        "pet_nfc_token_login",
                        resposta.token_login || ""
                    );

                    armazenamento.setItem(
                        "pet_nfc_nome_pet",
                        resposta.nome_pet || ""
                    );

                    armazenamento.setItem(
                        "pet_nfc_nome_tutor",
                        resposta.nome_tutor || ""
                    );


                    mostrarMensagem(

                        resposta.mensagem ||

                        "Login realizado com sucesso!",

                        "sucesso"

                    );


                    setTimeout(
                        function () {

                            window.location.href =
                                "painel.html";

                        },
                        800
                    );

                    return;

                }


                // ==================================
                // LOGIN RECUSADO
                // ==================================

                campoEmail.classList.add(
                    "campo-erro"
                );

                campoSenha.classList.add(
                    "campo-erro"
                );

                mostrarMensagem(

                    resposta?.mensagem ||

                    "E-mail ou senha incorretos."

                );

            } catch (erro) {

                console.error(
                    "Erro ao realizar login:",
                    erro
                );

                mostrarMensagem(
                    "Erro ao conectar com o servidor."
                );

            } finally {

                desativarCarregamento();

            }

        }
    );


    // ======================================
    // ESCONDER MENSAGEM AO ABRIR
    // ======================================

    esconderMensagem();

});
