"use strict";

/* ===================================================
   PET NFC — AJUSTE DA FOTO NO CADASTRO
=================================================== */

document.addEventListener(
    "DOMContentLoaded",
    iniciarEditorFotoCadastro
);

let cropperCadastro = null;

let fotoCadastroRecortada = "";

let nomeFotoCadastro = "";


/* ===================================================
   INICIALIZAÇÃO
=================================================== */

function iniciarEditorFotoCadastro() {

    const inputFoto =
        document.getElementById("foto");

    const modal =
        document.getElementById("modalFotoCadastro");

    const fundoModal =
        document.getElementById("fundoModalFotoCadastro");

    const btnCancelar =
        document.getElementById("btnCancelarFotoCadastro");

    const btnUsar =
        document.getElementById("btnUsarFotoCadastro");

    if (
        !inputFoto ||
        !modal ||
        !btnCancelar ||
        !btnUsar
    ) {

        console.error(
            "Elementos do editor de foto não encontrados."
        );

        return;
    }

    inputFoto.addEventListener(
        "change",
        selecionarFotoCadastro
    );

    btnCancelar.addEventListener(
        "click",
        cancelarFotoCadastro
    );

    btnUsar.addEventListener(
        "click",
        confirmarFotoCadastro
    );

    if (fundoModal) {

        fundoModal.addEventListener(
            "click",
            cancelarFotoCadastro
        );

    }

    document.addEventListener(
        "keydown",
        function (evento) {

            if (
                evento.key === "Escape" &&
                !modal.hidden
            ) {

                cancelarFotoCadastro();

            }

        }
    );

}


/* ===================================================
   SELECIONAR FOTO
=================================================== */

function selecionarFotoCadastro(evento) {

    const arquivo =
        evento.target.files[0];

    if (!arquivo) {
        return;
    }

    const tiposPermitidos = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    if (!tiposPermitidos.includes(arquivo.type)) {

        alert(
            "Escolha uma imagem JPG, PNG ou WEBP."
        );

        evento.target.value = "";

        return;
    }

    const limiteFoto =
        5 * 1024 * 1024;

    if (arquivo.size > limiteFoto) {

        alert(
            "A foto deve ter no máximo 5 MB."
        );

        evento.target.value = "";

        return;
    }

    if (typeof Cropper === "undefined") {

        alert(
            "O editor de imagem não foi carregado. Atualize a página e tente novamente."
        );

        evento.target.value = "";

        return;
    }

    nomeFotoCadastro =
        arquivo.name || "foto-pet.jpg";

    const leitor =
        new FileReader();

    leitor.onload = function () {

        abrirEditorFotoCadastro(
            String(leitor.result || "")
        );

    };

    leitor.onerror = function () {

        evento.target.value = "";

        alert(
            "Não foi possível ler a foto selecionada."
        );

    };

    leitor.readAsDataURL(arquivo);

}


/* ===================================================
   ABRIR EDITOR
=================================================== */

function abrirEditorFotoCadastro(imagemBase64) {

    const modal =
        document.getElementById("modalFotoCadastro");

    const imagem =
        document.getElementById("imagemCropperCadastro");

    if (!modal || !imagem || !imagemBase64) {
        return;
    }

    if (cropperCadastro) {

        cropperCadastro.destroy();

        cropperCadastro = null;

    }

    modal.hidden = false;

    document.body.style.overflow = "hidden";

    imagem.onload = function () {

        imagem.onload = null;

        cropperCadastro =
            new Cropper(
                imagem,
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

    };

    imagem.src = imagemBase64;

}


/* ===================================================
   CONFIRMAR RECORTE
=================================================== */

function confirmarFotoCadastro() {

    const btnUsar =
        document.getElementById("btnUsarFotoCadastro");

    const previewFoto =
        document.getElementById("previewFoto");

    if (!cropperCadastro) {

        alert(
            "A imagem ainda não está pronta."
        );

        return;
    }

    btnUsar.disabled = true;

    try {

        const canvas =
            cropperCadastro.getCroppedCanvas({
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
                "Não foi possível gerar a imagem."
            );

        }

        fotoCadastroRecortada =
            canvas.toDataURL(
                "image/jpeg",
                0.9
            );

        if (previewFoto) {

            previewFoto.src =
                fotoCadastroRecortada;

        }

        fecharEditorFotoCadastro(false);

    } catch (erro) {

        console.error(
            "Erro ao ajustar foto:",
            erro
        );

        alert(
            erro.message ||
            "Não foi possível ajustar a foto."
        );

    } finally {

        btnUsar.disabled = false;

    }

}


/* ===================================================
   CANCELAR
=================================================== */

function cancelarFotoCadastro() {

    fotoCadastroRecortada = "";

    nomeFotoCadastro = "";

    fecharEditorFotoCadastro(true);

}


/* ===================================================
   FECHAR EDITOR
=================================================== */

function fecharEditorFotoCadastro(
    limparInput = false
) {

    const modal =
        document.getElementById("modalFotoCadastro");

    const imagem =
        document.getElementById("imagemCropperCadastro");

    const inputFoto =
        document.getElementById("foto");

    if (cropperCadastro) {

        cropperCadastro.destroy();

        cropperCadastro = null;

    }

    if (limparInput && inputFoto) {

        inputFoto.value = "";

    }

    if (imagem) {

        imagem.onload = null;

        imagem.removeAttribute("src");

    }

    if (modal) {

        modal.hidden = true;

    }

    document.body.style.overflow = "";

}


/* ===================================================
   FUNÇÕES DISPONÍVEIS PARA O APP.JS
=================================================== */

window.obterFotoCadastroRecortada =
    function () {

        return fotoCadastroRecortada;

    };

window.obterNomeFotoCadastro =
    function () {

        return nomeFotoCadastro;

    };
