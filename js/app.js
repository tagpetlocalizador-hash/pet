/*************************************************
 * PET NFC
 * app.js
 * Versão 1.0.0
 *************************************************/

let petAtual = null;

/* ===================================================
   INICIALIZAÇÃO
=================================================== */

document.addEventListener("DOMContentLoaded", iniciarSistema);

/* ===================================================
   INICIAR
=================================================== */

async function iniciarSistema() {

    mostrarLoading();

    if (!TOKEN) {

        mostrarErro("Token da TAG não informado.");

        return;

    }

    const resposta = await buscarPet(TOKEN);

    if (!resposta.sucesso) {

        mostrarErro(resposta.mensagem);

        return;

    }

    petAtual = resposta;

    if (resposta.status === STATUS.LIVRE) {

        mostrarCadastro();

    } else {

        carregarPerfil(resposta);

        mostrarPerfil();

    }

}

/* ===================================================
   TELAS
=================================================== */

function esconderTudo() {

    document.getElementById("loading").style.display = "none";
    document.getElementById("cadastro").style.display = "none";
    document.getElementById("perfil").style.display = "none";
    document.getElementById("mensagem").style.display = "none";

}

function mostrarLoading() {

    esconderTudo();

    document.getElementById("loading").style.display = "block";

}

function mostrarCadastro() {

    esconderTudo();

    document.getElementById("cadastro").style.display = "block";

}

function mostrarPerfil() {

    esconderTudo();

    document.getElementById("perfil").style.display = "block";

}

function mostrarMensagem() {

    esconderTudo();

    document.getElementById("mensagem").style.display = "block";

}

/* ===================================================
   PERFIL
=================================================== */

function carregarPerfil(dados) {

    document.getElementById("perfilNomePet").innerText =
        dados.nome_pet || "";

    document.getElementById("perfilTutor").innerText =
        dados.nome_tutor || "";

    document.getElementById("fotoPerfil").src =
        dados.foto || CONFIG.FOTO_PADRAO;

}

/* ===================================================
   FOTO
=================================================== */

const campoFoto = document.getElementById("foto");

if (campoFoto) {

    campoFoto.addEventListener("change", function () {

        const arquivo = this.files[0];

        if (!arquivo) return;

        const reader = new FileReader();

        reader.onload = function (e) {

            document.getElementById("previewFoto").src =
                e.target.result;

        };

        reader.readAsDataURL(arquivo);

    });

}

/* ===================================================
   CADASTRO
=================================================== */

const btnCadastrar = document.getElementById("btnCadastrar");

if (btnCadastrar) {

    btnCadastrar.addEventListener("click", salvarCadastro);

}

async function salvarCadastro() {

    const dados = {

        token: TOKEN,

        nome_pet: document.getElementById("nomePet").value,

        nome_tutor: document.getElementById("nomeTutor").value,

        whatsapp: document.getElementById("whatsapp").value,

        email: document.getElementById("email").value

    };

    const resposta = await cadastrarPet(dados);

    if (!resposta.sucesso) {

        alert(resposta.mensagem);

        return;

    }

    location.reload();

}

/* ===================================================
   LOCALIZAÇÃO
=================================================== */

const btnLocalizacao = document.getElementById("btnLocalizacao");

if (btnLocalizacao) {

    btnLocalizacao.addEventListener("click", enviarMinhaLocalizacao);

}

function enviarMinhaLocalizacao() {

    if (!navigator.geolocation) {

        alert("Seu navegador não suporta localização.");

        return;

    }

    navigator.geolocation.getCurrentPosition(

        async function (posicao) {

            const resposta = await enviarLocalizacao(

                TOKEN,

                posicao.coords.latitude,

                posicao.coords.longitude

            );

            if (resposta.sucesso) {

                mostrarMensagem();

            } else {

                alert(resposta.mensagem);

            }

        },

        function () {

            alert("Não foi possível obter sua localização.");

        }

    );

}

/* ===================================================
   ERROS
=================================================== */

function mostrarErro(msg) {

    esconderTudo();

    document.body.innerHTML = `

        <div class="container mt-5">

            <div class="alert alert-danger text-center">

                <h4>Erro</h4>

                <p>${msg}</p>

            </div>

        </div>

    `;

}
