const email = document.getElementById("email");
const senha = document.getElementById("senha");
const btnEntrar = document.getElementById("btnEntrar");
const mensagem = document.getElementById("mensagem");


function mostrarErro(texto) {

    mensagem.style.display = "block";
    mensagem.textContent = texto;

}


function esconderErro() {

    mensagem.style.display = "none";
    mensagem.textContent = "";

}


async function executarLogin() {

    esconderErro();

    const emailInformado =
        email.value.trim();

    const senhaInformada =
        senha.value;


    if (!emailInformado || !senhaInformada) {

        mostrarErro(
            "Informe o e-mail e a senha."
        );

        return;

    }


    btnEntrar.disabled = true;

    btnEntrar.innerHTML =
        '<span class="spinner-border spinner-border-sm me-2"></span>Entrando...';


    try {

        const resposta =
            await loginAdmin(

                emailInformado,

                senhaInformada

            );


        console.log(
            "Resposta do login:",
            resposta
        );


        if (!resposta.sucesso) {

            mostrarErro(

                resposta.mensagem ||

                "E-mail ou senha inválidos."

            );

            return;

        }


        if (!resposta.token_admin) {

            mostrarErro(
                "O servidor não retornou o token administrativo."
            );

            return;

        }


        sessionStorage.setItem(

            "pet_nfc_admin_token",

            resposta.token_admin

        );


        window.location.href =
            "index.html";


    } catch (erro) {

        console.error(
            "Erro no login administrativo:",
            erro
        );

        mostrarErro(

            erro.message ||

            "Erro ao conectar com o servidor."

        );


    } finally {

        btnEntrar.disabled = false;

        btnEntrar.innerHTML =
            '<i class="bi bi-box-arrow-in-right"></i> Entrar';

    }

}


btnEntrar.addEventListener(
    "click",
    executarLogin
);


senha.addEventListener(
    "keydown",
    function(evento) {

        if (evento.key === "Enter") {

            executarLogin();

        }

    }
);
