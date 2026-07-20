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

    btnEntrar.disabled=true;

    btnEntrar.classList.add("carregando");

    try{

        // ==========================
        // Aqui será ligado ao Apps Script
        // ==========================

        const resposta={
            sucesso:false,
            mensagem:"Login ainda não conectado ao servidor."
        };


        if(resposta.sucesso){

            mostrarMensagem(
                "Login realizado com sucesso!",
                "sucesso"
            );

            setTimeout(()=>{

                location.href="painel.html";

            },800);

        }else{

            mostrarMensagem(resposta.mensagem);

        }

    }catch(erro){

        mostrarMensagem(
            "Erro ao conectar com o servidor."
        );

        console.error(erro);

    }

    btnEntrar.disabled=false;

    btnEntrar.classList.remove("carregando");

});
