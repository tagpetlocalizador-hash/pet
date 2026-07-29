const email = document.getElementById("email");
const senha = document.getElementById("senha");
const btnEntrar = document.getElementById("btnEntrar");
const mensagem = document.getElementById("mensagem");

function mostrarErro(texto){

    mensagem.style.display = "block";
    mensagem.innerHTML = texto;

}

function esconderErro(){

    mensagem.style.display = "none";
    mensagem.innerHTML = "";

}

btnEntrar.addEventListener("click", async ()=>{

    esconderErro();

    btnEntrar.disabled = true;
    btnEntrar.innerHTML =
        '<span class="spinner-border spinner-border-sm"></span> Entrando...';

    try{

        const resposta = await API.loginAdmin(

            email.value.trim(),

            senha.value

        );

        if(!resposta.sucesso){

            mostrarErro(

                resposta.mensagem ||

                "E-mail ou senha inválidos."

            );

            btnEntrar.disabled = false;
            btnEntrar.innerHTML =
                '<i class="bi bi-box-arrow-in-right"></i> Entrar';

            return;

        }

        sessionStorage.setItem(

            "pet_nfc_admin_token",

            resposta.token_admin

        );

        window.location.href =
            "index.html";

    }catch(e){

        mostrarErro(

            "Erro ao conectar com o servidor."

        );

        btnEntrar.disabled = false;
        btnEntrar.innerHTML =
            '<i class="bi bi-box-arrow-in-right"></i> Entrar';

    }

});

senha.addEventListener("keydown",function(e){

    if(e.key==="Enter"){

        btnEntrar.click();

    }

});
