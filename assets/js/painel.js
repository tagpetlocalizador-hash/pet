"use strict";

/* =========================================================
   PET NFC - PAINEL DO TUTOR
   Arquivo: assets/js/painel.js
========================================================= */

document.addEventListener("DOMContentLoaded", iniciarPainel);


/* =========================================================
   CONFIGURAÇÕES
========================================================= */

const STORAGE = {
    TOKEN: "pet_nfc_token_login",
    NOME_PET: "pet_nfc_nome_pet",
    NOME_TUTOR: "pet_nfc_nome_tutor"
};

const LIMITE_FOTO_BYTES = 5 * 1024 * 1024;

const TIPOS_FOTO_PERMITIDOS = [
    "image/jpeg",
    "image/png",
    "image/webp"
];


/* =========================================================
   ESTADO DO PAINEL
========================================================= */

const estadoPainel = {
    tokenLogin: "",
    fotoAtual: "",
    fotoSelecionada: "",
    nomeArquivoFoto: "",
    dadosCarregados: false,
    salvandoDados: false,
    alterandoSenha: false,
    saindo: false
};


/* =========================================================
   ELEMENTOS DA PÁGINA
========================================================= */

let elementos = {};
let cropper = null;

let imagemTemporaria = "";

let arquivoTemporario = "";

/* =========================================================
   INICIALIZAÇÃO
========================================================= */

async function iniciarPainel() {

    mapearElementos();

    configurarEventos();

    const tokenLogin =
    localStorage.getItem(STORAGE.TOKEN) ||
    sessionStorage.getItem(STORAGE.TOKEN);

if (!tokenLogin) {
    redirecionarLogin();
    return;
}

    estadoPainel.tokenLogin = tokenLogin;

    mostrarTelaCarregamento(true);

    try {

        const resposta = await validarSessao();

        if (!resposta || resposta.sucesso !== true) {

            limparSessao();

            redirecionarLogin();

            return;
        }

        preencherPainel(resposta);

        estadoPainel.dadosCarregados = true;

        mostrarPaginaPainel();

    } catch (erro) {

        console.error("Erro ao carregar o painel:", erro);

        mostrarPaginaPainel();

        mostrarMensagemGeral(
            erro.message ||
            "Não foi possível carregar seus dados. Tente novamente.",
            "erro"
        );

    } finally {

        mostrarTelaCarregamento(false);

    }

}


/* =========================================================
   MAPEAR ELEMENTOS
========================================================= */

function mapearElementos() {

    elementos = {

        telaCarregamento:
            document.getElementById("telaCarregamento"),

        paginaPainel:
            document.getElementById("paginaPainel"),

        mensagemPainel:
            document.getElementById("mensagemPainel"),

        mensagemSenha:
            document.getElementById("mensagemSenha"),

        nomeTutorCabecalho:
            document.getElementById("nomeTutorCabecalho"),

        fotoPet:
            document.getElementById("fotoPet"),

        indicadorFoto:
            document.getElementById("indicadorFoto"),

        nomePetFoto:
            document.getElementById("nomePetFoto"),

        inputFoto:
            document.getElementById("inputFoto"),

        btnRemoverFoto:
            document.getElementById("btnRemoverFoto"),

        nomeArquivoFoto:
            document.getElementById("nomeArquivoFoto"),

        formDadosTutor:
            document.getElementById("formDadosTutor"),

        nomePet:
            document.getElementById("nomePet"),

        nomeTutor:
            document.getElementById("nomeTutor"),

        whatsapp:
            document.getElementById("whatsapp"),

        emailTutor:
            document.getElementById("emailTutor"),

        tokenTag:
            document.getElementById("tokenTag"),

        btnSalvarDados:
            document.getElementById("btnSalvarDados"),

        resumoNomePet:
            document.getElementById("resumoNomePet"),

        resumoNomeTutor:
            document.getElementById("resumoNomeTutor"),

        resumoWhatsapp:
            document.getElementById("resumoWhatsapp"),

        resumoEmail:
            document.getElementById("resumoEmail"),

        formAlterarSenha:
            document.getElementById("formAlterarSenha"),

        senhaAtual:
            document.getElementById("senhaAtual"),

        novaSenha:
            document.getElementById("novaSenha"),

        confirmarNovaSenha:
            document.getElementById("confirmarNovaSenha"),

        btnAlterarSenha:
            document.getElementById("btnAlterarSenha"),

        btnSair:
            document.getElementById("btnSair"),

        modalSair:
            document.getElementById("modalSair"),

        btnCancelarSair:
            document.getElementById("btnCancelarSair"),

        btnConfirmarSair:
            document.getElementById("btnConfirmarSair"),
       
        modalFoto:
             document.getElementById("modalFoto"),

        imagemCropper:
             document.getElementById("imagemCropper"),

        btnCancelarFoto:
             document.getElementById("btnCancelarFoto"),

        btnUsarFoto:
             document.getElementById("btnUsarFoto")
    };

}


/* =========================================================
   EVENTOS
========================================================= */

function configurarEventos() {

    if (elementos.formDadosTutor) {

        elementos.formDadosTutor.addEventListener(
            "submit",
            salvarDadosTutor
        );

    }

    if (elementos.formAlterarSenha) {

        elementos.formAlterarSenha.addEventListener(
            "submit",
            alterarSenha
        );

    }

    if (elementos.inputFoto) {

        elementos.inputFoto.addEventListener(
            "change",
            selecionarFoto
        );

    }

    if (elementos.btnRemoverFoto) {

        elementos.btnRemoverFoto.addEventListener(
            "click",
            removerFotoSelecionada
        );

    }
   if (elementos.btnCancelarFoto) {

    elementos.btnCancelarFoto.addEventListener(
        "click",
        fecharModalFoto
    );

}

if (elementos.btnUsarFoto) {

    elementos.btnUsarFoto.addEventListener(
        "click",
        confirmarRecorteFoto
    );

}

if (elementos.modalFoto) {

    const fundoFoto =
        elementos.modalFoto.querySelector(".fundo-modal-painel");

    if (fundoFoto) {

        fundoFoto.addEventListener(
            "click",
            fecharModalFoto
        );

    }

}

    if (elementos.whatsapp) {

        elementos.whatsapp.addEventListener(
            "input",
            aplicarMascaraWhatsapp
        );

    }

    if (elementos.nomePet) {

        elementos.nomePet.addEventListener(
            "input",
            atualizarResumo
        );

    }

    if (elementos.nomeTutor) {

        elementos.nomeTutor.addEventListener(
            "input",
            atualizarResumo
        );

    }

    if (elementos.emailTutor) {

        elementos.emailTutor.addEventListener(
            "input",
            atualizarResumo
        );

    }

    if (elementos.whatsapp) {

        elementos.whatsapp.addEventListener(
            "input",
            atualizarResumo
        );

    }

    document
        .querySelectorAll(".botao-mostrar-senha")
        .forEach(function (botao) {

            botao.addEventListener(
                "click",
                alternarVisibilidadeSenha
            );

        });

    if (elementos.btnSair) {

        elementos.btnSair.addEventListener(
            "click",
            abrirModalSair
        );

    }

    if (elementos.btnCancelarSair) {

        elementos.btnCancelarSair.addEventListener(
            "click",
            fecharModalSair
        );

    }

    if (elementos.btnConfirmarSair) {

        elementos.btnConfirmarSair.addEventListener(
            "click",
            realizarLogout
        );

    }

    if (elementos.modalSair) {

        const fundoModal =
            elementos.modalSair.querySelector(".fundo-modal-painel");

        if (fundoModal) {

            fundoModal.addEventListener(
                "click",
                fecharModalSair
            );

        }

    }

    document.addEventListener(
    "keydown",
    function (evento) {

        if (evento.key !== "Escape") {
            return;
        }

        fecharModalFoto(false);
        fecharModalSair();

    }
);

}


/* =========================================================
   VALIDAÇÃO DA SESSÃO
========================================================= */

async function validarSessao() {

    /*
      Primeiro tenta utilizar o método existente no api.js.
      Caso não esteja disponível, usa a comunicação direta.
    */

    if (
        typeof API !== "undefined" &&
        typeof API.validarLogin === "function"
    ) {

        try {

            const resposta = await API.validarLogin(
                estadoPainel.tokenLogin
            );

            if (resposta) {
                return resposta;
            }

        } catch (erro) {

            console.warn(
                "Falha ao validar pelo api.js. Tentando diretamente:",
                erro
            );

        }

    }

    return chamarApiGet("validarLogin", {
        token_login: estadoPainel.tokenLogin,
        token: estadoPainel.tokenLogin
    });

}


/* =========================================================
   PREENCHER PAINEL
========================================================= */

function preencherPainel(dados) {

    const nomePet =
        dados.nome_pet ||
        localStorage.getItem(STORAGE.NOME_PET) ||
        "";

    const nomeTutor =
        dados.nome_tutor ||
        localStorage.getItem(STORAGE.NOME_TUTOR) ||
        "";

    const whatsapp =
        dados.whatsapp ||
        dados.telefone ||
        "";

    const email =
        dados.email ||
        dados.email_tutor ||
        "";

    const tokenTag =
        dados.token ||
        dados.token_tag ||
        dados.id_tag ||
        "";

    const foto =
        dados.foto ||
        dados.foto_pet ||
        dados.url_foto ||
        "";

    elementos.nomePet.value = nomePet;

    elementos.nomeTutor.value = nomeTutor;

    elementos.whatsapp.value =
        formatarWhatsapp(whatsapp);

    elementos.emailTutor.value = email;

    elementos.tokenTag.value = tokenTag;

    elementos.nomeTutorCabecalho.textContent =
        nomeTutor || "Tutor";

    elementos.nomePetFoto.textContent =
        nomePet || "Meu pet";

    estadoPainel.fotoAtual = foto;

    estadoPainel.fotoSelecionada = "";

    estadoPainel.nomeArquivoFoto = "";

    atualizarImagemPet(foto);

    atualizarTextoArquivoFoto();

    atualizarResumo();

    localStorage.setItem(
        STORAGE.NOME_PET,
        nomePet
    );

    localStorage.setItem(
        STORAGE.NOME_TUTOR,
        nomeTutor
    );

}


/* =========================================================
   RESUMO
========================================================= */

function atualizarResumo() {

    const nomePet =
        elementos.nomePet.value.trim();

    const nomeTutor =
        elementos.nomeTutor.value.trim();

    const whatsapp =
        elementos.whatsapp.value.trim();

    const email =
        elementos.emailTutor.value.trim();

    elementos.resumoNomePet.textContent =
        nomePet || "Não informado";

    elementos.resumoNomeTutor.textContent =
        nomeTutor || "Não informado";

    elementos.resumoWhatsapp.textContent =
        whatsapp || "Não informado";

    elementos.resumoEmail.textContent =
        email || "Não informado";

    elementos.nomePetFoto.textContent =
        nomePet || "Meu pet";

    elementos.nomeTutorCabecalho.textContent =
        nomeTutor || "Tutor";

}


/* =========================================================
   FOTO DO PET
========================================================= */

function selecionarFoto(evento) {

    limparMensagemGeral();

    const arquivo = evento.target.files[0];

    if (!arquivo) {
        return;
    }

    if (!TIPOS_FOTO_PERMITIDOS.includes(arquivo.type)) {

        evento.target.value = "";

        mostrarMensagemGeral(
            "Formato de foto inválido. Escolha uma imagem JPG, PNG ou WEBP.",
            "erro"
        );

        return;
    }

    if (arquivo.size > LIMITE_FOTO_BYTES) {

        evento.target.value = "";

        mostrarMensagemGeral(
            "A foto deve ter no máximo 5 MB.",
            "erro"
        );

        return;
    }

    if (
        typeof Cropper === "undefined"
    ) {

        evento.target.value = "";

        mostrarMensagemGeral(
            "O editor de imagem não foi carregado. Atualize a página e tente novamente.",
            "erro"
        );

        return;
    }

    arquivoTemporario = arquivo.name;

    const leitor = new FileReader();

    leitor.onload = function () {

        imagemTemporaria = String(leitor.result || "");

        if (
            !imagemTemporaria ||
            !elementos.imagemCropper
        ) {

            mostrarMensagemGeral(
                "Não foi possível preparar a foto selecionada.",
                "erro"
            );

            return;
        }

        if (cropper) {

            cropper.destroy();

            cropper = null;
        }

        elementos.imagemCropper.onload = function () {

            elementos.imagemCropper.onload = null;

            setTimeout(function () {

                if (cropper) {

                    cropper.destroy();

                    cropper = null;
                }

                cropper = new Cropper(
                    elementos.imagemCropper,
                    {
                        aspectRatio: 1,
                        viewMode: 1,
                        dragMode: "move",
                        autoCropArea: 1,
                        responsive: true,
                        restore: false,
                        guides: true,
                        center: true,
                        highlight: false,
                        background: false,
                        movable: true,
                        zoomable: true,
                        zoomOnWheel: true,
                        zoomOnTouch: true,
                        cropBoxMovable: true,
                        cropBoxResizable: true,
                        toggleDragModeOnDblclick: false,
                        scalable: false,
                        rotatable: false,
                        checkOrientation: true
                    }
                );

            }, 100);

        };

        elementos.imagemCropper.onerror = function () {

            elementos.imagemCropper.onerror = null;

            fecharModalFoto(true);

            mostrarMensagemGeral(
                "Não foi possível abrir a imagem selecionada.",
                "erro"
            );

        };

        abrirModalFoto();

        elementos.imagemCropper.src =
            imagemTemporaria;

    };

    leitor.onerror = function () {

        evento.target.value = "";

        imagemTemporaria = "";

        arquivoTemporario = "";

        mostrarMensagemGeral(
            "Não foi possível ler a foto selecionada.",
            "erro"
        );

    };

    leitor.readAsDataURL(arquivo);

}


function removerFotoSelecionada() {

    if (elementos.inputFoto) {
        elementos.inputFoto.value = "";
    }

    estadoPainel.fotoSelecionada = "";

    estadoPainel.nomeArquivoFoto = "";

    imagemTemporaria = "";

    arquivoTemporario = "";

    atualizarImagemPet(
        estadoPainel.fotoAtual
    );

    atualizarTextoArquivoFoto();

    if (elementos.indicadorFoto) {

        elementos.indicadorFoto.classList.remove(
            "foto-alterada"
        );

    }

}


function atualizarImagemPet(foto) {

    if (!elementos.fotoPet) {
        return;
    }

    if (foto) {

        elementos.fotoPet.src = foto;

    } else {

        elementos.fotoPet.src =
            "../assets/img/logo.png";

    }

}


function atualizarTextoArquivoFoto() {

    if (!elementos.nomeArquivoFoto) {
        return;
    }

    if (estadoPainel.nomeArquivoFoto) {

        elementos.nomeArquivoFoto.textContent =
            estadoPainel.nomeArquivoFoto;

    } else {

        elementos.nomeArquivoFoto.textContent =
            "Nenhuma nova foto selecionada.";

    }

}


function abrirModalFoto() {

    if (!elementos.modalFoto) {
        return;
    }

    elementos.modalFoto.hidden = false;

    document.body.style.overflow = "hidden";

    setTimeout(function () {

        elementos.modalFoto.classList.add(
            "aberto"
        );

    }, 10);

}


function fecharModalFoto(cancelarSelecao = true) {

    if (
        !elementos.modalFoto ||
        elementos.modalFoto.hidden
    ) {
        return;
    }

    elementos.modalFoto.classList.remove(
        "aberto"
    );

    document.body.style.overflow = "";

    if (cropper) {

        cropper.destroy();

        cropper = null;
    }

    if (elementos.imagemCropper) {

        elementos.imagemCropper.onload = null;

        elementos.imagemCropper.onerror = null;
    }

    if (cancelarSelecao) {

        imagemTemporaria = "";

        arquivoTemporario = "";

        if (elementos.inputFoto) {
            elementos.inputFoto.value = "";
        }

    }

    setTimeout(function () {

        elementos.modalFoto.hidden = true;

        if (elementos.imagemCropper) {
            elementos.imagemCropper.removeAttribute("src");
        }

    }, 200);

}


function confirmarRecorteFoto() {

    limparMensagemGeral();

    if (!cropper) {

        mostrarMensagemGeral(
            "A imagem ainda não está pronta para o recorte.",
            "erro"
        );

        return;
    }

    if (elementos.btnUsarFoto) {
        elementos.btnUsarFoto.disabled = true;
    }

    try {

        const canvas = cropper.getCroppedCanvas({
            width: 500,
            height: 500,
            minWidth: 300,
            minHeight: 300,
            maxWidth: 1000,
            maxHeight: 1000,
            imageSmoothingEnabled: true,
            imageSmoothingQuality: "high",
            fillColor: "#ffffff"
        });

        if (!canvas) {

            throw new Error(
                "Não foi possível gerar a imagem recortada."
            );

        }

        const fotoRecortada =
            canvas.toDataURL(
                "image/jpeg",
                0.9
            );

        if (
            !fotoRecortada ||
            !fotoRecortada.startsWith(
                "data:image/jpeg"
            )
        ) {

            throw new Error(
                "Não foi possível preparar a foto recortada."
            );

        }

        estadoPainel.fotoSelecionada =
            fotoRecortada;

        estadoPainel.nomeArquivoFoto =
            gerarNomeFotoRecortada(
                arquivoTemporario
            );

        atualizarImagemPet(
            estadoPainel.fotoSelecionada
        );

        atualizarTextoArquivoFoto();

        if (elementos.indicadorFoto) {

            elementos.indicadorFoto.classList.add(
                "foto-alterada"
            );

        }

        imagemTemporaria = "";

        arquivoTemporario = "";

        fecharModalFoto(false);

    } catch (erro) {

        console.error(
            "Erro ao recortar a foto:",
            erro
        );

        mostrarMensagemGeral(
            erro.message ||
            "Não foi possível recortar a foto.",
            "erro"
        );

    } finally {

        if (elementos.btnUsarFoto) {
            elementos.btnUsarFoto.disabled = false;
        }

    }

}


function gerarNomeFotoRecortada(nomeOriginal) {

    const nome =
        String(nomeOriginal || "foto-pet")
            .trim()
            .replace(/\.[^.]+$/, "")
            .replace(/[^\wÀ-ÿ-]+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");

    return (
        nome ||
        "foto-pet"
    ) + ".jpg";

}

/* =========================================================
   SALVAR DADOS
========================================================= */

async function salvarDadosTutor(evento) {

    evento.preventDefault();

    if (estadoPainel.salvandoDados) {
        return;
    }

    limparMensagemGeral();

    const nomePet =
        elementos.nomePet.value.trim();

    const nomeTutor =
        elementos.nomeTutor.value.trim();

    const whatsapp =
        somenteNumeros(elementos.whatsapp.value);

    const email =
        elementos.emailTutor.value.trim().toLowerCase();

    if (!nomePet) {

        mostrarMensagemGeral(
            "Informe o nome do pet.",
            "erro"
        );

        elementos.nomePet.focus();

        return;
    }

    if (!nomeTutor) {

        mostrarMensagemGeral(
            "Informe o nome do tutor.",
            "erro"
        );

        elementos.nomeTutor.focus();

        return;
    }

    if (whatsapp.length < 10) {

        mostrarMensagemGeral(
            "Informe um WhatsApp válido com DDD.",
            "erro"
        );

        elementos.whatsapp.focus();

        return;
    }

    if (!validarEmail(email)) {

        mostrarMensagemGeral(
            "Informe um endereço de e-mail válido.",
            "erro"
        );

        elementos.emailTutor.focus();

        return;
    }

    estadoPainel.salvandoDados = true;

    alternarCarregamentoBotao(
        elementos.btnSalvarDados,
        true
    );

    desabilitarFormulario(
        elementos.formDadosTutor,
        true
    );

    try {

        const dadosAtualizacao = {
            token_login: estadoPainel.tokenLogin,
            token: estadoPainel.tokenLogin,
            nome_pet: nomePet,
            nome_tutor: nomeTutor,
            whatsapp: whatsapp,
            telefone: whatsapp,
            email: email
        };

        let resposta;

        if (
            typeof API !== "undefined" &&
            typeof API.atualizarTutor === "function"
        ) {

            try {

                resposta = await API.atualizarTutor(
                    dadosAtualizacao
                );

            } catch (erroApi) {

                console.warn(
                    "Falha pelo api.js. Tentando diretamente:",
                    erroApi
                );

                resposta = await chamarApiPost(
                    "atualizarTutor",
                    dadosAtualizacao
                );

            }

        } else {

            resposta = await chamarApiPost(
                "atualizarTutor",
                dadosAtualizacao
            );

        }

        if (!resposta || resposta.sucesso !== true) {

            throw new Error(
                resposta?.mensagem ||
                resposta?.erro ||
                "Não foi possível salvar as alterações."
            );

        }

        if (estadoPainel.fotoSelecionada) {

            await atualizarFotoPet(
                estadoPainel.fotoSelecionada
            );

            estadoPainel.fotoAtual =
                estadoPainel.fotoSelecionada;

            estadoPainel.fotoSelecionada = "";

            estadoPainel.nomeArquivoFoto = "";

            if (elementos.inputFoto) {
                elementos.inputFoto.value = "";
            }

            atualizarTextoArquivoFoto();

            if (elementos.indicadorFoto) {

                elementos.indicadorFoto.classList.remove(
                    "foto-alterada"
                );

            }

        }

        localStorage.setItem(
            STORAGE.NOME_PET,
            nomePet
        );

        localStorage.setItem(
            STORAGE.NOME_TUTOR,
            nomeTutor
        );

        atualizarResumo();

        mostrarMensagemGeral(
            resposta.mensagem ||
            "Alterações salvas com sucesso.",
            "sucesso"
        );

        rolarParaTopo();

    } catch (erro) {

        console.error(
            "Erro ao salvar os dados:",
            erro
        );

        tratarPossivelSessaoExpirada(erro);

        mostrarMensagemGeral(
            erro.message ||
            "Não foi possível salvar as alterações.",
            "erro"
        );

    } finally {

        estadoPainel.salvandoDados = false;

        alternarCarregamentoBotao(
            elementos.btnSalvarDados,
            false
        );

        desabilitarFormulario(
            elementos.formDadosTutor,
            false
        );

    }

}


/* =========================================================
   ATUALIZAR FOTO
========================================================= */

async function atualizarFotoPet(fotoBase64) {

    const resposta = await chamarApiPost(
        "atualizarFoto",
        {
            token_login: estadoPainel.tokenLogin,
            token: elementos.tokenTag.value,
            foto: fotoBase64
        }
    );

    if (!resposta || resposta.sucesso !== true) {
        throw new Error(
            resposta?.mensagem ||
            "Os dados foram atualizados, mas não foi possível salvar a foto."
        );
    }

    return resposta;
}


/* =========================================================
   ALTERAR SENHA
========================================================= */

async function alterarSenha(evento) {

    evento.preventDefault();

    if (estadoPainel.alterandoSenha) {
        return;
    }

    limparMensagemSenha();

    const senhaAtual =
        elementos.senhaAtual.value;

    const novaSenha =
        elementos.novaSenha.value;

    const confirmarNovaSenha =
        elementos.confirmarNovaSenha.value;

    if (!senhaAtual) {

        mostrarMensagemSenha(
            "Informe sua senha atual.",
            "erro"
        );

        elementos.senhaAtual.focus();

        return;
    }

    if (novaSenha.length < 6) {

        mostrarMensagemSenha(
            "A nova senha deve ter pelo menos 6 caracteres.",
            "erro"
        );

        elementos.novaSenha.focus();

        return;
    }

    if (novaSenha !== confirmarNovaSenha) {

        mostrarMensagemSenha(
            "A confirmação da nova senha não corresponde.",
            "erro"
        );

        elementos.confirmarNovaSenha.focus();

        return;
    }

    if (senhaAtual === novaSenha) {

        mostrarMensagemSenha(
            "A nova senha deve ser diferente da senha atual.",
            "erro"
        );

        elementos.novaSenha.focus();

        return;
    }

    estadoPainel.alterandoSenha = true;

    alternarCarregamentoBotao(
        elementos.btnAlterarSenha,
        true
    );

    desabilitarFormulario(
        elementos.formAlterarSenha,
        true
    );

    try {

        const dadosSenha = {
            token_login: estadoPainel.tokenLogin,
            token: estadoPainel.tokenLogin,
            senha_atual: senhaAtual,
            nova_senha: novaSenha
        };

        let resposta;

        if (
            typeof API !== "undefined" &&
            typeof API.alterarSenha === "function"
        ) {

            try {

                resposta = await API.alterarSenha(
                    dadosSenha
                );

            } catch (erroApi) {

                console.warn(
                    "Falha pelo api.js. Tentando diretamente:",
                    erroApi
                );

                resposta = await chamarApiPost(
                    "alterarSenha",
                    dadosSenha
                );

            }

        } else {

            resposta = await chamarApiPost(
                "alterarSenha",
                dadosSenha
            );

        }

        if (!resposta || resposta.sucesso !== true) {

            throw new Error(
                resposta?.mensagem ||
                resposta?.erro ||
                "Não foi possível alterar a senha."
            );

        }

        elementos.formAlterarSenha.reset();

        mostrarMensagemSenha(
            resposta.mensagem ||
            "Senha alterada com sucesso.",
            "sucesso"
        );

    } catch (erro) {

        console.error(
            "Erro ao alterar senha:",
            erro
        );

        tratarPossivelSessaoExpirada(erro);

        mostrarMensagemSenha(
            erro.message ||
            "Não foi possível alterar a senha.",
            "erro"
        );

    } finally {

        estadoPainel.alterandoSenha = false;

        alternarCarregamentoBotao(
            elementos.btnAlterarSenha,
            false
        );

        desabilitarFormulario(
            elementos.formAlterarSenha,
            false
        );

    }

}


/* =========================================================
   MOSTRAR E ESCONDER SENHA
========================================================= */

function alternarVisibilidadeSenha(evento) {

    const botao = evento.currentTarget;

    const idCampo =
        botao.dataset.campoSenha;

    const campo =
        document.getElementById(idCampo);

    if (!campo) {
        return;
    }

    const icone =
        botao.querySelector("i");

    if (campo.type === "password") {

        campo.type = "text";

        botao.setAttribute(
            "aria-label",
            "Ocultar senha"
        );

        if (icone) {

            icone.classList.remove("bi-eye");

            icone.classList.add("bi-eye-slash");

        }

    } else {

        campo.type = "password";

        botao.setAttribute(
            "aria-label",
            "Mostrar senha"
        );

        if (icone) {

            icone.classList.remove("bi-eye-slash");

            icone.classList.add("bi-eye");

        }

    }

}


/* =========================================================
   LOGOUT
========================================================= */

function abrirModalSair() {

    if (!elementos.modalSair) {
        return;
    }

    elementos.modalSair.hidden = false;

    document.body.style.overflow = "hidden";

    setTimeout(function () {

        elementos.modalSair.classList.add("aberto");

    }, 10);

}


function fecharModalSair() {

    if (
        !elementos.modalSair ||
        elementos.modalSair.hidden
    ) {
        return;
    }

    elementos.modalSair.classList.remove("aberto");

    document.body.style.overflow = "";

    setTimeout(function () {

        elementos.modalSair.hidden = true;

    }, 200);

}


async function realizarLogout() {

    if (estadoPainel.saindo) {
        return;
    }

    estadoPainel.saindo = true;

    elementos.btnConfirmarSair.disabled = true;

    try {

        if (
            typeof API !== "undefined" &&
            typeof API.logout === "function"
        ) {

            try {

                await API.logout(
                    estadoPainel.tokenLogin
                );

            } catch (erroApi) {

                console.warn(
                    "Não foi possível concluir o logout pelo api.js:",
                    erroApi
                );

                await chamarApiPost(
                    "logout",
                    {
                        token_login:
                            estadoPainel.tokenLogin,

                        token:
                            estadoPainel.tokenLogin
                    }
                );

            }

        } else {

            await chamarApiPost(
                "logout",
                {
                    token_login:
                        estadoPainel.tokenLogin,

                    token:
                        estadoPainel.tokenLogin
                }
            );

        }

    } catch (erro) {

        console.warn(
            "A sessão local será encerrada mesmo sem resposta do servidor:",
            erro
        );

    } finally {

        limparSessao();

        redirecionarLogin();

    }

}


/* =========================================================
   COMUNICAÇÃO COM APPS SCRIPT
========================================================= */

async function chamarApiGet(action, parametros = {}) {

    verificarConfiguracaoApi();

    const url = new URL(CONFIG.API_URL);

    url.searchParams.set("action", action);

    Object.entries(parametros).forEach(
        function ([chave, valor]) {

            if (
                valor !== undefined &&
                valor !== null &&
                valor !== ""
            ) {

                url.searchParams.set(
                    chave,
                    String(valor)
                );

            }

        }
    );

    const resposta = await fetch(
        url.toString(),
        {
            method: "GET",
            cache: "no-store",
            redirect: "follow"
        }
    );

    return lerRespostaApi(resposta);

}


async function chamarApiPost(action, dados = {}) {

    verificarConfiguracaoApi();

    const resposta = await fetch(
        CONFIG.API_URL,
        {
            method: "POST",

            redirect: "follow",

            headers: {
                "Content-Type":
                    "text/plain;charset=utf-8"
            },

            body: JSON.stringify({
                action: action,
                ...dados
            })
        }
    );

    return lerRespostaApi(resposta);

}


async function lerRespostaApi(resposta) {

    const texto = await resposta.text();

    if (!resposta.ok) {

        throw new Error(
            "Erro de comunicação com o servidor."
        );

    }

    if (!texto) {

        throw new Error(
            "O servidor não retornou uma resposta."
        );

    }

    try {

        return JSON.parse(texto);

    } catch (erro) {

        console.error(
            "Resposta inválida do servidor:",
            texto
        );

        throw new Error(
            "O servidor retornou uma resposta inválida."
        );

    }

}


function verificarConfiguracaoApi() {

    if (
        typeof CONFIG === "undefined" ||
        !CONFIG.API_URL
    ) {

        throw new Error(
            "A URL da API não foi configurada."
        );

    }

}


/* =========================================================
   MENSAGENS
========================================================= */

function mostrarMensagemGeral(texto, tipo) {

    mostrarMensagem(
        elementos.mensagemPainel,
        texto,
        tipo
    );

}


function limparMensagemGeral() {

    limparMensagem(
        elementos.mensagemPainel
    );

}


function mostrarMensagemSenha(texto, tipo) {

    mostrarMensagem(
        elementos.mensagemSenha,
        texto,
        tipo
    );

}


function limparMensagemSenha() {

    limparMensagem(
        elementos.mensagemSenha
    );

}


function mostrarMensagem(elemento, texto, tipo) {

    if (!elemento) {
        return;
    }

    const span =
        elemento.querySelector("span");

    const icone =
        elemento.querySelector("i");

    elemento.classList.remove(
        "sucesso",
        "erro",
        "aviso",
        "visivel"
    );

    elemento.classList.add(
        tipo || "aviso",
        "visivel"
    );

    if (span) {
        span.textContent = texto;
    }

    if (icone) {

        icone.className = "";

        if (tipo === "sucesso") {

            icone.classList.add(
                "bi",
                "bi-check-circle-fill"
            );

        } else if (tipo === "erro") {

            icone.classList.add(
                "bi",
                "bi-exclamation-circle-fill"
            );

        } else {

            icone.classList.add(
                "bi",
                "bi-info-circle-fill"
            );

        }

    }

}


function limparMensagem(elemento) {

    if (!elemento) {
        return;
    }

    const span =
        elemento.querySelector("span");

    elemento.classList.remove(
        "sucesso",
        "erro",
        "aviso",
        "visivel"
    );

    if (span) {
        span.textContent = "";
    }

}


/* =========================================================
   BOTÕES E FORMULÁRIOS
========================================================= */

function alternarCarregamentoBotao(botao, carregando) {

    if (!botao) {
        return;
    }

    botao.disabled = carregando;

    botao.classList.toggle(
        "carregando",
        carregando
    );

    const textoBotao =
        botao.querySelector(".texto-botao");

    const loadingBotao =
        botao.querySelector(".loading-botao");

    if (textoBotao) {

        textoBotao.style.display =
            carregando ? "none" : "";

    }

    if (loadingBotao) {

        loadingBotao.style.display =
            carregando ? "inline-flex" : "none";

    }

}


function desabilitarFormulario(formulario, desabilitar) {

    if (!formulario) {
        return;
    }

    formulario
        .querySelectorAll(
            "input, button, select, textarea"
        )
        .forEach(function (campo) {

            campo.disabled = desabilitar;

        });

}


/* =========================================================
   MÁSCARA DO WHATSAPP
========================================================= */

function aplicarMascaraWhatsapp(evento) {

    evento.target.value =
        formatarWhatsapp(evento.target.value);

}


function formatarWhatsapp(valor) {

    const numeros =
        somenteNumeros(valor).slice(0, 11);

    if (numeros.length <= 2) {

        return numeros;

    }

    if (numeros.length <= 6) {

        return numeros.replace(
            /^(\d{2})(\d+)/,
            "($1) $2"
        );

    }

    if (numeros.length <= 10) {

        return numeros.replace(
            /^(\d{2})(\d{4})(\d+)/,
            "($1) $2-$3"
        );

    }

    return numeros.replace(
        /^(\d{2})(\d{5})(\d{4})/,
        "($1) $2-$3"
    );

}


/* =========================================================
   VALIDAÇÕES
========================================================= */

function validarEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
    );

}


function somenteNumeros(valor) {

    return String(valor || "")
        .replace(/\D/g, "");

}


/* =========================================================
   SESSÃO
========================================================= */

function limparSessao() {

    localStorage.removeItem(STORAGE.TOKEN);
    localStorage.removeItem(STORAGE.NOME_PET);
    localStorage.removeItem(STORAGE.NOME_TUTOR);

    sessionStorage.removeItem(STORAGE.TOKEN);
    sessionStorage.removeItem(STORAGE.NOME_PET);
    sessionStorage.removeItem(STORAGE.NOME_TUTOR);

    estadoPainel.tokenLogin = "";

}

function tratarPossivelSessaoExpirada(erro) {

    const mensagem =
        String(erro?.message || "")
            .toLowerCase();

    const sessaoExpirada =
        mensagem.includes("sessão expirada") ||
        mensagem.includes("sessao expirada") ||
        mensagem.includes("token inválido") ||
        mensagem.includes("token invalido") ||
        mensagem.includes("login expirado") ||
        mensagem.includes("não autorizado") ||
        mensagem.includes("nao autorizado");

    if (!sessaoExpirada) {
        return;
    }

    limparSessao();

    setTimeout(function () {

        redirecionarLogin();

    }, 1500);

}


/* =========================================================
   TELA E REDIRECIONAMENTO
========================================================= */

function mostrarTelaCarregamento(mostrar) {

    if (!elementos.telaCarregamento) {
        return;
    }

    elementos.telaCarregamento.style.display =
        mostrar ? "flex" : "none";

}


function mostrarPaginaPainel() {

    if (!elementos.paginaPainel) {
        return;
    }

    elementos.paginaPainel.hidden = false;

}


function redirecionarLogin() {

    window.location.replace("login.html");

}


function rolarParaTopo() {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}
