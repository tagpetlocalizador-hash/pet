// ===============================
// PET NFC - Login do Tutor
// assets/js/login.js
// ===============================

const form = document.getElementById("formLogin");
const email = document.getElementById("email");
const senha = document.getElementById("senha");

const btnEntrar = document.getElementById("btnEntrar");
const btnMostrarSenha = document.getElementById("btnMostrarSenha");

const mensagem = document.getElementById("mensagemLogin");
const textoMensagem = mensagem.querySelector("span");


// ===============================
// Mostrar mensagem
// ===============================

function mostrarMensagem(texto, tipo = "erro") {

    mensagem.classList.remove("sucesso", "erro");

    mensagem.classList.add(tipo);

    textoMensagem.textContent = texto;

    mensagem.style.display = "flex";

}


// ===============================
// Esconder mensagem
// ===============================

function esconderMensagem() {

    mensagem.style.display = "none";

}


// ===============================
// Mostrar/Ocultar senha
// ===============================

btnMostrarSenha.addEventListener("click", () => {

    if (senha.type === "password") {

        senha.type = "text";

        btnMostrarSenha.innerHTML =
            '<i class="bi bi-eye-slash"></i>';

    } else {

        senha.type = "password";

        btnMostrarSenha.innerHTML =
            '<i class="bi bi-eye"></i>';

    }

});


// ===============================
// Login
// ===============================

form.addEventListener("submit", async function(e){

    e.preventDefault();

    esconderMensagem();

    if(email.value.trim()===""){

        mostrarMensagem("Informe seu e-mail.");

        email.focus();

        return;

    }

    if(senha.value.trim()===""){

        mostrarMensagem("Informe sua senha.");

        senha.focus();

        return;

    }

    btnEntrar.disabled = true;

    btnEntrar.classList.add("carregando");

    try{

        // ==========================
        // Login no Apps Script
        // ==========================

        const resposta = await API.login(

            email.value.trim(),

            senha.value

        );

        if(resposta.sucesso){

            // Salva sessão

            localStorage.setItem(

                "pet_nfc_token_login",

                resposta.token_login

            );

            localStorage.setItem(

                "pet_nfc_nome_pet",

                resposta.nome_pet || ""

            );

            localStorage.setItem(

                "pet_nfc_nome_tutor",

                resposta.nome_tutor || ""

            );

            mostrarMensagem(

                resposta.mensagem ||

                "Login realizado com sucesso!",

                "sucesso"

            );

            setTimeout(()=>{

                location.href="painel.html";

            },800);

        }else{

            mostrarMensagem(

                resposta.mensagem ||

                "Não foi possível realizar o login."

            );

        }

    }catch(erro){

        console.error(erro);

        mostrarMensagem(

            "Erro ao conectar com o servidor."

        );

    }

    btnEntrar.disabled = false;

    btnEntrar.classList.remove("carregando");

});
