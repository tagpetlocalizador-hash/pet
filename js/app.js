/*************************************************
 * PET NFC
 * app.js
 * Versão 2.0.0
 *************************************************/


let petAtual = null;

let enviandoLocalizacao = false;

let localizacaoEnviada = false;

let avisoLocalizacaoExibido = false;


/* ===================================================
   INICIALIZAÇÃO
=================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        configurarEventos();

        iniciarSistema();

    }
);


/* ===================================================
   EVENTOS
=================================================== */

function configurarEventos() {

    const btnCadastrar =
        document.getElementById("btnCadastrar");

    const btnLocalizacao =
        document.getElementById("btnLocalizacao");

    const btnVoltarPerfil =
        document.getElementById("btnVoltarPerfil");

    const btnMostrarSenha =
        document.getElementById("btnMostrarSenha");

    const btnMostrarConfirmarSenha =
        document.getElementById(
            "btnMostrarConfirmarSenha"
        );


    if (btnCadastrar) {

        btnCadastrar.addEventListener(
            "click",
            salvarCadastro
        );

    }


    if (btnLocalizacao) {

        btnLocalizacao.addEventListener(
            "click",
            enviarMinhaLocalizacao
        );

    }


    if (btnVoltarPerfil) {

        btnVoltarPerfil.addEventListener(
            "click",
            function () {

                mostrarPerfil();

            }
        );

    }


    if (btnMostrarSenha) {

        btnMostrarSenha.addEventListener(
            "click",
            function () {

                alternarVisibilidadeSenha(
                    "senha",
                    btnMostrarSenha
                );

            }
        );

    }


    if (btnMostrarConfirmarSenha) {

        btnMostrarConfirmarSenha.addEventListener(
            "click",
            function () {

                alternarVisibilidadeSenha(
                    "confirmarSenha",
                    btnMostrarConfirmarSenha
                );

            }
        );

    }

}
function alternarVisibilidadeSenha(
    campoId,
    botao
) {

    const campo =
        document.getElementById(
            campoId
        );

    if (!campo || !botao) {

        return;

    }

    const estaVisivel =
        campo.type === "text";


    campo.type =
        estaVisivel
            ? "password"
            : "text";


    botao.innerHTML =
        estaVisivel
            ? '<i class="bi bi-eye"></i>'
            : '<i class="bi bi-eye-slash"></i>';


    botao.setAttribute(
        "aria-label",
        estaVisivel
            ? "Mostrar senha"
            : "Ocultar senha"
    );

}


/* ===================================================
   INICIAR SISTEMA
=================================================== */

async function iniciarSistema() {

    mostrarLoading();

    if (!TOKEN) {

        mostrarErro(
            "O token da TAG não foi informado."
        );

        return;

    }

    try {

        const resposta =
            await buscarPet(TOKEN);

        // ==========================
        // DEBUG
        // ==========================

        console.log("Resposta completa da API:", resposta);

        
        // ==========================

        if (!resposta || !resposta.sucesso) {

            mostrarErro(

                resposta?.mensagem ||

                "Não foi possível carregar esta TAG."

            );

            return;

        }

        petAtual = resposta;

        console.log("Status recebido:", resposta.status);

        if (resposta.status === STATUS.LIVRE) {

            console.log("Mostrando tela de cadastro");

            mostrarCadastro();

            return;

        }

        if (resposta.status === STATUS.BLOQUEADO) {

            console.log("TAG bloqueada");

            mostrarErro(
                "Esta TAG está bloqueada."
            );

            return;

        }

        console.log("Mostrando perfil do pet");

        carregarPerfil(resposta);

        mostrarPerfil();

        setTimeout(function () {

            verificarLocalizacaoAutomatica();

        }, 800);

    } catch (erro) {

        console.error("Erro ao iniciar sistema:", erro);

        alert(
            "ERRO:\n\n" +
            erro
        );

        mostrarErro(
            "Erro ao carregar os dados da TAG."
        );

    }

}
/* ===================================================
   TELAS
=================================================== */

function esconderTudo() {

    const ids = [

        "loading",

        "cadastro",

        "perfil",

        "mensagem",

        "erroSistema"

    ];


    ids.forEach(function (id) {

        const elemento =
            document.getElementById(id);

        if (elemento) {

            elemento.style.display =
                "none";

        }

    });

}


function mostrarLoading() {

    esconderTudo();

    const loading =
        document.getElementById("loading");

    if (loading) {

        loading.style.display =
            "block";

    }

}


function mostrarCadastro() {

    esconderTudo();

    const cadastro =
        document.getElementById("cadastro");

    if (cadastro) {

        cadastro.style.display =
            "block";

    }

}


function mostrarPerfil() {

    esconderTudo();

    const perfil =
        document.getElementById("perfil");

    if (perfil) {

        perfil.style.display =
            "block";

    }

    setTimeout(function () {

    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant"
    });

}, 50);
}


function mostrarMensagem() {

    esconderTudo();

    const mensagem =
        document.getElementById("mensagem");

    if (mensagem) {

        mensagem.style.display =
            "block";

    }

}


function mostrarErro(mensagem) {

    esconderTudo();

    const erroSistema =
        document.getElementById(
            "erroSistema"
        );

    const textoErro =
        document.getElementById(
            "textoErroSistema"
        );


    if (textoErro) {

        textoErro.textContent =
            mensagem ||
            "Ocorreu um erro inesperado.";

    }


    if (erroSistema) {

        erroSistema.style.display =
            "block";

    }

}
/* ===================================================
   PERFIL
=================================================== */

function carregarPerfil(dados) {

    const perfilNomePet =
        document.getElementById(
            "perfilNomePet"
        );

    const perfilTutor =
        document.getElementById(
            "perfilTutor"
        );

    const fotoPerfil =
        document.getElementById(
            "fotoPerfil"
        );

    const btnLigar =
        document.getElementById(
            "btnLigar"
        );

    const btnWhatsapp =
        document.getElementById(
            "btnWhatsapp"
        );


    const nomePet =
        dados.nome_pet ||
        dados.nomePet ||
        "Pet";

    const nomeTutor =
        dados.nome_tutor ||
        dados.nomeTutor ||
        "Tutor não informado";

    const telefone =
        limparTelefone(
            dados.whatsapp ||
            dados.telefone ||
            ""
        );


    if (perfilNomePet) {

        perfilNomePet.textContent =
            nomePet;

    }


    if (perfilTutor) {

        perfilTutor.textContent =
            "Tutor: " + nomeTutor;

    }


    configurarFotoPerfil(
        fotoPerfil,
        dados.foto
    );


    configurarBotaoLigar(
        btnLigar,
        telefone
    );


    configurarBotaoWhatsapp(
        btnWhatsapp,
        telefone,
        nomePet
    );

}


function configurarFotoPerfil(
    elemento,
    foto
) {

    if (!elemento) {

        return;

    }


    elemento.onerror =
        function () {

            this.onerror = null;

            this.style.display =
                "none";

        };


    if (foto) {

        elemento.src =
            foto;

        elemento.style.display =
            "inline-block";

    } else {

        elemento.src =
            CONFIG.FOTO_PADRAO;

        elemento.style.display =
            "inline-block";

    }

}


function configurarBotaoLigar(
    botao,
    telefone
) {

    if (!botao) {

        return;

    }


    if (!telefone) {

        botao.href =
            "#";

        botao.classList.add(
            "disabled"
        );

        botao.setAttribute(
            "aria-disabled",
            "true"
        );

        return;

    }


    botao.classList.remove(
        "disabled"
    );

    botao.removeAttribute(
        "aria-disabled"
    );

    botao.href =
        "tel:+" + telefone;

}


function configurarBotaoWhatsapp(
    botao,
    telefone,
    nomePet
) {

    if (!botao) {

        return;

    }


    if (!telefone) {

        botao.href =
            "#";

        botao.classList.add(
            "disabled"
        );

        botao.setAttribute(
            "aria-disabled",
            "true"
        );

        return;

    }


    const mensagem =
        "Olá! Encontrei o pet " +
        nomePet +
        " e acessei a TAG de identificação.";


    botao.classList.remove(
        "disabled"
    );

    botao.removeAttribute(
        "aria-disabled"
    );

    botao.href =
        "https://wa.me/" +
        telefone +
        "?text=" +
        encodeURIComponent(mensagem);

}


/* ===================================================
   TELEFONE
=================================================== */

function limparTelefone(valor) {

    let numero =
        String(valor || "")
            .replace(/\D/g, "");


    if (!numero) {

        return "";

    }


    /*
     * Acrescenta o código do Brasil quando
     * o cliente informou apenas DDD + número.
     */

    if (
        numero.length === 10 ||
        numero.length === 11
    ) {

        numero =
            "55" + numero;

    }


    return numero;

}


/* ===================================================
   CADASTRO
=================================================== */

async function salvarCadastro(evento) {

    if (evento) {

        evento.preventDefault();

    }


    const campoNomePet =
        document.getElementById(
            "nomePet"
        );

    const campoNomeTutor =
        document.getElementById(
            "nomeTutor"
        );

    const campoWhatsapp =
        document.getElementById(
            "whatsapp"
        );

    const campoEmail =
        document.getElementById(
            "email"
        );
   
   const campoCodigoAtivacao =
    document.getElementById(
        "codigoAtivacao"
    );

    const campoSenha =
        document.getElementById(
            "senha"
        );

    const campoConfirmarSenha =
        document.getElementById(
            "confirmarSenha"
        );

    const btnCadastrar =
        document.getElementById(
            "btnCadastrar"
        );


    const nomePet =
        campoNomePet
            ? campoNomePet.value.trim()
            : "";

    const nomeTutor =
        campoNomeTutor
            ? campoNomeTutor.value.trim()
            : "";

    const whatsapp =
        campoWhatsapp
            ? campoWhatsapp.value.trim()
            : "";

    const email =
        campoEmail
            ? campoEmail.value.trim()
            : "";
   
   const codigoAtivacao =
    campoCodigoAtivacao
        ? campoCodigoAtivacao.value.trim()
        : "";

    const senha =
        campoSenha
            ? campoSenha.value
            : "";

    const confirmarSenha =
        campoConfirmarSenha
            ? campoConfirmarSenha.value
            : "";

    const fotoBase64 =
    typeof window.obterFotoCadastroRecortada === "function"
        ? window.obterFotoCadastroRecortada()
        : "";

    if (
    !codigoAtivacao ||
    !nomePet ||
    !nomeTutor ||
    !whatsapp ||
    !email ||
    !senha ||
    !confirmarSenha
) {

        alert(
            "Preencha todos os campos."
        );

        return;

    }


    if (!validarEmail(email)) {

        alert(
            "Informe um e-mail válido."
        );

        campoEmail.focus();

        return;

    }


    if (
        limparTelefone(whatsapp).length < 12
    ) {

        alert(
            "Informe um WhatsApp válido com DDD."
        );

        campoWhatsapp.focus();

        return;

    }


    if (senha.length < 6) {

        alert(
            "A senha deve possuir pelo menos 6 caracteres."
        );

        campoSenha.focus();

        return;

    }


    if (!/[A-Za-zÀ-ÿ]/.test(senha)) {

        alert(
            "A senha deve possuir pelo menos uma letra."
        );

        campoSenha.focus();

        return;

    }


    if (!/[0-9]/.test(senha)) {

        alert(
            "A senha deve possuir pelo menos um número."
        );

        campoSenha.focus();

        return;

    }


    if (senha !== confirmarSenha) {

        alert(
            "As senhas não coincidem.\n\nDigite a mesma senha nos dois campos."
        );

        campoConfirmarSenha.value = "";

        campoConfirmarSenha.focus();

        return;

    }


    alterarBotaoCadastro(
        btnCadastrar,
        true,
        "Ativando..."
    );


    try {

        const respostaCadastro =
    await cadastrarPet({

    token: TOKEN,

    codigo_ativacao: codigoAtivacao,

    nome_pet: nomePet,

    nome_tutor: nomeTutor,

    whatsapp: limparTelefone(whatsapp),

    email: email,

    senha: senha

});


        if (
            !respostaCadastro ||
            !respostaCadastro.sucesso
        ) {

            alert(
                respostaCadastro?.mensagem ||
                "Não foi possível cadastrar o pet."
            );

            return;

        }


        if (fotoBase64) {

    alterarBotaoCadastro(
        btnCadastrar,
        true,
        "Iniciando sessão..."
    );

    const respostaLogin =
        await fazerLoginTutor(
            email,
            senha
        );

    if (
        !respostaLogin ||
        !respostaLogin.sucesso ||
        !respostaLogin.token_login
    ) {

        alert(
            "O cadastro foi realizado, mas não foi possível iniciar a sessão.\n\n" +
            (
                respostaLogin?.mensagem ||
                "Erro desconhecido."
            )
        );

    } else {

        alterarBotaoCadastro(
            btnCadastrar,
            true,
            "Enviando foto..."
        );

        const respostaFoto =
            await atualizarFoto(
                respostaLogin.token_login,
                TOKEN,
                fotoBase64
            );

        if (
            !respostaFoto ||
            !respostaFoto.sucesso
        ) {

            alert(
                "O cadastro foi realizado, mas a foto não foi enviada.\n\n" +
                (
                    respostaFoto?.mensagem ||
                    "Erro desconhecido."
                )
            );

        }

    }

}


        alterarBotaoCadastro(
            btnCadastrar,
            true,
            "Carregando perfil..."
        );


        const respostaPet =
            await buscarPet(
                TOKEN
            );


        if (
            !respostaPet ||
            !respostaPet.sucesso
        ) {

            window.location.reload();

            return;

        }


        petAtual =
            respostaPet;


        carregarPerfil(
            respostaPet
        );


        mostrarPerfil();


    } catch (erro) {

        console.error(
            "Erro no cadastro:",
            erro
        );

        alert(
            "Não foi possível concluir o cadastro."
        );


    } finally {

        alterarBotaoCadastro(
            btnCadastrar,
            false,
            "Ativar identificação"
        );

    }

}


function alterarBotaoCadastro(
    botao,
    desabilitado,
    texto
) {

    if (!botao) {

        return;

    }

    botao.disabled =
        desabilitado;

    botao.innerHTML =
        desabilitado
            ? '<span class="spinner-border spinner-border-sm me-2"></span>' +
              texto
            : '<i class="bi bi-check-circle-fill me-1"></i> ' +
              texto;

}


function validarEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}

/* ===================================================
   MODAL DE AVISO
=================================================== */

function mostrarAvisoLocalizacao(
    titulo,
    mensagem
) {

    const modal =
        document.getElementById(
            "modalAvisoLocalizacao"
        );

    const tituloModal =
        document.getElementById(
            "modalAvisoTitulo"
        );

    const mensagemModal =
        document.getElementById(
            "modalAvisoMensagem"
        );

    if (
        !modal ||
        !tituloModal ||
        !mensagemModal
    ) {

        console.error(
            "Modal de aviso não encontrado."
        );

        return;

    }

    tituloModal.textContent =
        titulo;

    mensagemModal.textContent =
        mensagem;

    modal.classList.add(
        "ativo"
    );

}


function fecharAvisoLocalizacao() {

    const modal =
        document.getElementById(
            "modalAvisoLocalizacao"
        );

    if (!modal) {

        return;

    }

    modal.classList.remove(
        "ativo"
    );
   

}


/* ===================================================
   LOCALIZAÇÃO
=================================================== */

function enviarMinhaLocalizacao() {

    if (enviandoLocalizacao) {
        return;
    }

    if (!navigator.geolocation) {

        mostrarAvisoLocalizacao(

    "Localização indisponível",

    "A localização está desligada ou bloqueada. Ligue a localização do celular e passe a tag novamente para ajudar a encontrar o tutor deste pet."

);

        return;
    }

    const btnLocalizacao =
        document.getElementById(
            "btnLocalizacao"
        );

    enviandoLocalizacao = true;

    alterarBotaoLocalizacao(
        btnLocalizacao,
        true,
        "Obtendo localização..."
    );

    navigator.geolocation.getCurrentPosition(

        async function (posicao) {

            try {

                alterarBotaoLocalizacao(
                    btnLocalizacao,
                    true,
                    "Enviando..."
                );

                const resposta =
                    await enviarLocalizacao(
                        TOKEN,
                        posicao.coords.latitude,
                        posicao.coords.longitude
                    );

                if (
                    resposta &&
                    resposta.sucesso
                ) {

                    localizacaoEnviada = true;

                    mostrarMensagem();

                    return;
                }

                mostrarAvisoLocalizacao(

    "Falha no envio",

    resposta?.mensagem ||
    "Não foi possível enviar a localização."

);
            } catch (erro) {

                console.error(
                    "Erro ao enviar localização:",
                    erro
                );

                mostrarAvisoLocalizacao(

    "Falha no envio",

    "Não foi possível enviar a localização."

);

            } finally {

                enviandoLocalizacao = false;

                alterarBotaoLocalizacao(
                    btnLocalizacao,
                    false,
                    "Encontrei este Pet"
                );

            }

        },

        function (erro) {

            console.error(
                "Erro de localização:",
                erro
            );

            enviandoLocalizacao = false;

            alterarBotaoLocalizacao(
                btnLocalizacao,
                false,
                "Encontrei este Pet"
            );

            tratarErroLocalizacao(
                erro
            );

        },

        {
            enableHighAccuracy: true,
            timeout: 30000,
            maximumAge: 0
        }

    );

}


function alterarBotaoLocalizacao(
    botao,
    desabilitado,
    texto
) {

    if (!botao) {

        return;

    }


    botao.disabled =
        desabilitado;


    if (desabilitado) {

        botao.innerHTML =

            '<span class="spinner-border ' +
            'spinner-border-sm me-2"></span>' +

            texto;

    } else {

        botao.innerHTML =

            '<i class="bi bi-geo-alt-fill me-1"></i> ' +

            texto;

    }

}


function tratarErroLocalizacao(erro) {

    console.error(
        "Não foi possível obter a localização:",
        erro
    );

    let titulo =
        "Localização indisponível";

    let mensagem =
        "A localização está desligada ou bloqueada. Ligue a localização do celular e passe a tag novamente para ajudar a encontrar o tutor deste pet.";

    if (erro && erro.code === 1) {

        titulo =
            "Permissão necessária";

        mensagem =
            "Permita o acesso à localização nas configurações do navegador e passe a tag novamente.";

    }

    if (erro && erro.code === 2) {

        titulo =
            "Localização não encontrada";

        mensagem =
            "Não foi possível obter sua localização. Tente novamente.";

    }

    if (erro && erro.code === 3) {

        titulo =
            "Tempo esgotado";

        mensagem =
            "A localização demorou para responder. Tente novamente.";

    }

    mostrarAvisoLocalizacao(
        titulo,
        mensagem
    );

}
/* ===================================================
   LOCALIZAÇÃO AUTOMÁTICA AO ABRIR A TAG
=================================================== */

function verificarLocalizacaoAutomatica() {

    if (
        localizacaoEnviada ||
        enviandoLocalizacao
    ) {

        return;

    }


    if (!navigator.geolocation) {

        exibirAvisoLocalizacaoAutomatica();

        return;

    }


    enviandoLocalizacao =
        true;


    navigator.geolocation.getCurrentPosition(

        async function (posicao) {

            try {

                const resposta =
                    await enviarLocalizacao(

                        TOKEN,

                        posicao.coords.latitude,

                        posicao.coords.longitude

                    );


                if (
                    resposta &&
                    resposta.sucesso
                ) {

                    localizacaoEnviada =
                        true;

                    console.log(
                        "Localização enviada automaticamente."
                    );

                    return;

                }


                console.error(
                    "A API não confirmou o envio da localização:",
                    resposta
                );


            } catch (erro) {

                console.error(
                    "Erro ao enviar localização automaticamente:",
                    erro
                );


            } finally {

                enviandoLocalizacao =
                    false;

            }

        },


        function (erro) {

            enviandoLocalizacao =
                false;


            console.error(
                "Erro na localização automática:",
                erro
            );


            exibirAvisoLocalizacaoAutomatica();

        },


        {

            enableHighAccuracy:
                true,

            timeout:
                12000,

            maximumAge:
                0

        }

    );

}


/* ===================================================
   AVISO DE LOCALIZAÇÃO
=================================================== */

function exibirAvisoLocalizacaoAutomatica() {

    if (avisoLocalizacaoExibido) {

        return;

    }


    avisoLocalizacaoExibido =
        true;


    mostrarAvisoLocalizacao(

    "Localização indisponível",

    "A localização está desligada ou bloqueada. Ligue a localização do celular e passe a tag novamente para ajudar a encontrar o tutor deste pet."

);
}
