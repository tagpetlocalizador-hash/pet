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

    const campoFoto =
        document.getElementById("foto");

    const btnCadastrar =
        document.getElementById("btnCadastrar");

    const btnLocalizacao =
        document.getElementById("btnLocalizacao");

    const btnVoltarPerfil =
        document.getElementById("btnVoltarPerfil");


    if (campoFoto) {

        campoFoto.addEventListener(
            "change",
            mostrarPreviewFoto
        );

    }


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


    const resposta =
        await buscarPet(TOKEN);


    if (!resposta.sucesso) {

        mostrarErro(
            resposta.mensagem ||
            "Não foi possível carregar esta TAG."
        );

        return;

    }


    petAtual = resposta;


    if (
        resposta.status === STATUS.LIVRE
    ) {

        mostrarCadastro();

        return;

    }


    if (
        resposta.status === STATUS.BLOQUEADO
    ) {

        mostrarErro(
            "Esta TAG está bloqueada."
        );

        return;

    }


    carregarPerfil(resposta);

    mostrarPerfil();

    // Tenta obter e enviar a localização automaticamente
    // logo após abrir uma TAG já cadastrada.
    setTimeout(function () {

        verificarLocalizacaoAutomatica();

    }, 800);

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
   FOTO - PREVIEW
=================================================== */

function mostrarPreviewFoto(evento) {

    const arquivo =
        evento.target.files[0];


    if (!arquivo) {

        return;

    }


    if (
        !arquivo.type.startsWith("image/")
    ) {

        alert(
            "Selecione um arquivo de imagem."
        );

        evento.target.value =
            "";

        return;

    }


    const previewFoto =
        document.getElementById(
            "previewFoto"
        );


    if (!previewFoto) {

        return;

    }


    const reader =
        new FileReader();


    reader.onload =
        function (eventoReader) {

            previewFoto.src =
                eventoReader.target.result;

            previewFoto.style.display =
                "inline-block";

        };


    reader.onerror =
        function () {

            alert(
                "Não foi possível ler a imagem."
            );

        };


    reader.readAsDataURL(
        arquivo
    );

}
/* ===================================================
   REDUZIR FOTO
=================================================== */

function reduzirFoto(arquivo) {

    return new Promise(
        function (resolve, reject) {

            const reader =
                new FileReader();


            reader.onerror =
                function () {

                    reject(
                        new Error(
                            "Não foi possível ler a foto."
                        )
                    );

                };


            reader.onload =
                function (eventoReader) {

                    const imagem =
                        new Image();


                    imagem.onerror =
                        function () {

                            reject(
                                new Error(
                                    "Arquivo de imagem inválido."
                                )
                            );

                        };


                    imagem.onload =
                        function () {

                            const tamanhoMaximo =
                                500;

                            let largura =
                                imagem.width;

                            let altura =
                                imagem.height;


                            if (
                                largura > altura &&
                                largura > tamanhoMaximo
                            ) {

                                altura =
                                    Math.round(
                                        altura *
                                        tamanhoMaximo /
                                        largura
                                    );

                                largura =
                                    tamanhoMaximo;

                            } else if (
                                altura > tamanhoMaximo
                            ) {

                                largura =
                                    Math.round(
                                        largura *
                                        tamanhoMaximo /
                                        altura
                                    );

                                altura =
                                    tamanhoMaximo;

                            }


                            const canvas =
                                document.createElement(
                                    "canvas"
                                );

                            canvas.width =
                                largura;

                            canvas.height =
                                altura;


                            const contexto =
                                canvas.getContext(
                                    "2d"
                                );


                            if (!contexto) {

                                reject(
                                    new Error(
                                        "Não foi possível processar a foto."
                                    )
                                );

                                return;

                            }


                            contexto.fillStyle =
                                "#ffffff";

                            contexto.fillRect(
                                0,
                                0,
                                largura,
                                altura
                            );


                            contexto.drawImage(
                                imagem,
                                0,
                                0,
                                largura,
                                altura
                            );


                            const fotoBase64 =
                                canvas.toDataURL(
                                    "image/jpeg",
                                    0.65
                                );


                            console.log(

                                "Tamanho da foto:",

                                Math.round(
                                    fotoBase64.length /
                                    1024
                                ),

                                "KB"

                            );


                            resolve(
                                fotoBase64
                            );

                        };


                    imagem.src =
                        eventoReader.target.result;

                };


            reader.readAsDataURL(
                arquivo
            );

        }
    );

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

    const campoFoto =
        document.getElementById(
            "foto"
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

    const arquivoFoto =
        campoFoto &&
        campoFoto.files.length > 0
            ? campoFoto.files[0]
            : null;


    if (
        !nomePet ||
        !nomeTutor ||
        !whatsapp ||
        !email
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

        return;

    }


    if (
        limparTelefone(whatsapp).length < 12
    ) {

        alert(
            "Informe um WhatsApp válido com DDD."
        );

        return;

    }


    alterarBotaoCadastro(
        btnCadastrar,
        true,
        "Cadastrando..."
    );


    try {

        const respostaCadastro =
            await cadastrarPet({

                token:
                    TOKEN,

                nome_pet:
                    nomePet,

                nome_tutor:
                    nomeTutor,

                whatsapp:
                    whatsapp,

                email:
                    email

            });


        if (!respostaCadastro.sucesso) {

            alert(
                respostaCadastro.mensagem ||
                "Não foi possível cadastrar o pet."
            );

            return;

        }


        if (arquivoFoto) {

            alterarBotaoCadastro(
                btnCadastrar,
                true,
                "Preparando foto..."
            );


            const fotoBase64 =
                await reduzirFoto(
                    arquivoFoto
                );


            alterarBotaoCadastro(
                btnCadastrar,
                true,
                "Enviando foto..."
            );


            const respostaFoto =
                await atualizarFoto(
                    TOKEN,
                    fotoBase64
                );


            if (!respostaFoto.sucesso) {

                alert(

                    "O cadastro foi realizado, " +
                    "mas a foto não foi enviada.\n\n" +

                    (
                        respostaFoto.mensagem ||
                        "Erro desconhecido."
                    )

                );

            }

        }


        alterarBotaoCadastro(
            btnCadastrar,
            true,
            "Carregando perfil..."
        );


        const respostaPet =
            await buscarPet(TOKEN);


        if (!respostaPet.sucesso) {

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
            "Cadastrar"
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
   LOCALIZAÇÃO
=================================================== */

function enviarMinhaLocalizacao() {

    if (localizacaoEnviada) {

        mostrarMensagem();

        return;

    }


    if (enviandoLocalizacao) {

        return;

    }


    if (!navigator.geolocation) {

        alert(
            "📍 A localização está desligada ou bloqueada.\n\n" +
            "Ligue a localização do celular e passe a tag novamente para ajudar a encontrar o tutor deste pet."
        );

        return;

    }


    const btnLocalizacao =
        document.getElementById(
            "btnLocalizacao"
        );


    enviandoLocalizacao =
        true;


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

                    localizacaoEnviada =
                        true;

                    mostrarMensagem();

                    return;

                }


                alert(
                    resposta.mensagem ||
                    "Não foi possível enviar a localização."
                );


            } catch (erro) {

                console.error(
                    "Erro ao enviar localização:",
                    erro
                );

                alert(
                    "Não foi possível enviar a localização."
                );


            } finally {

                enviandoLocalizacao =
                    false;

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


            enviandoLocalizacao =
                false;


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

            enableHighAccuracy:
                true,

            timeout:
                20000,

            maximumAge:
                0

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


    alert(
        "📍 A localização está desligada ou bloqueada.\n\n" +
        "Ligue a localização do celular e passe a tag novamente para ajudar a encontrar o tutor deste pet."
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


    alert(
        "📍 A localização está desligada ou bloqueada.\n\n" +
        "Ligue a localização do celular e passe a tag novamente para ajudar a encontrar o tutor deste pet."
    );

}
