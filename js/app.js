/*************************************************
 * PET NFC
 * app.js
 * Versão 1.2.0
 *************************************************/

let petAtual = null;


/* ===================================================
   INICIALIZAÇÃO
=================================================== */

document.addEventListener("DOMContentLoaded", function () {

    configurarEventos();

    iniciarSistema();

});


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

}


/* ===================================================
   INICIAR
=================================================== */

async function iniciarSistema() {

    mostrarLoading();

    if (!TOKEN) {

        mostrarErro(
            "Token da TAG não informado."
        );

        return;

    }

    const resposta =
        await buscarPet(TOKEN);

    if (!resposta.sucesso) {

        mostrarErro(
            resposta.mensagem
        );

        return;

    }

    petAtual = resposta;

    if (
        resposta.status === STATUS.LIVRE
    ) {

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

    const loading =
        document.getElementById("loading");

    const cadastro =
        document.getElementById("cadastro");

    const perfil =
        document.getElementById("perfil");

    const mensagem =
        document.getElementById("mensagem");


    if (loading) {

        loading.style.display = "none";

    }


    if (cadastro) {

        cadastro.style.display = "none";

    }


    if (perfil) {

        perfil.style.display = "none";

    }


    if (mensagem) {

        mensagem.style.display = "none";

    }

}


function mostrarLoading() {

    esconderTudo();

    const loading =
        document.getElementById("loading");

    if (loading) {

        loading.style.display = "block";

    }

}


function mostrarCadastro() {

    esconderTudo();

    const cadastro =
        document.getElementById("cadastro");

    if (cadastro) {

        cadastro.style.display = "block";

    }

}


function mostrarPerfil() {

    esconderTudo();

    const perfil =
        document.getElementById("perfil");

    if (perfil) {

        perfil.style.display = "block";

    }

}


function mostrarMensagem() {

    esconderTudo();

    const mensagem =
        document.getElementById("mensagem");

    if (mensagem) {

        mensagem.style.display = "block";

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


    if (perfilNomePet) {

        perfilNomePet.innerText =
            dados.nome_pet || "";

    }


    if (perfilTutor) {

        perfilTutor.innerText =
            dados.nome_tutor || "";

    }


    if (fotoPerfil) {

        if (dados.foto) {

            fotoPerfil.src =
                dados.foto;

            fotoPerfil.style.display =
                "block";

        } else {

            fotoPerfil.removeAttribute(
                "src"
            );

            fotoPerfil.style.display =
                "none";

        }


        fotoPerfil.onerror =
            function () {

                console.error(
                    "Não foi possível carregar a foto:",
                    dados.foto
                );

                this.style.display =
                    "none";

            };

    }

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
        !arquivo.type.startsWith(
            "image/"
        )
    ) {

        alert(
            "Selecione um arquivo de imagem."
        );

        evento.target.value = "";

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
                "block";

        };


    reader.onerror =
        function () {

            alert(
                "Não foi possível ler a imagem."
            );

        };


    reader.readAsDataURL(arquivo);

}


/* ===================================================
   REDUZIR FOTO
=================================================== */

/**
 * Reduz a imagem antes do envio.
 * Tamanho máximo: 500 px
 * Qualidade JPEG: 65%
 */
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
                                "Tamanho da foto enviada:",
                                Math.round(
                                    fotoBase64.length /
                                    1024
                                ),
                                "KB"
                            );


                            resolve(fotoBase64);

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


    if (
        arquivoFoto &&
        !arquivoFoto.type.startsWith(
            "image/"
        )
    ) {

        alert(
            "Selecione uma foto válida."
        );

        return;

    }


    if (btnCadastrar) {

        btnCadastrar.disabled =
            true;

        btnCadastrar.innerText =
            "Cadastrando...";

    }


    try {

        const dados = {

            token: TOKEN,

            nome_pet: nomePet,

            nome_tutor: nomeTutor,

            whatsapp: whatsapp,

            email: email

        };


        /*
         * Primeiro cadastra os dados do pet.
         */
        const respostaCadastro =
            await cadastrarPet(dados);


        if (!respostaCadastro.sucesso) {

            alert(
                respostaCadastro.mensagem
            );

            return;

        }


        /*
         * Depois envia a foto.
         */
        if (arquivoFoto) {

            if (btnCadastrar) {

                btnCadastrar.innerText =
                    "Preparando foto...";

            }


            const fotoBase64 =
                await reduzirFoto(
                    arquivoFoto
                );


            if (btnCadastrar) {

                btnCadastrar.innerText =
                    "Enviando foto...";

            }


            const respostaFoto =
                await atualizarFoto(
                    TOKEN,
                    fotoBase64
                );


            if (!respostaFoto.sucesso) {

                alert(
                    "O cadastro foi realizado, " +
                    "mas a foto não foi enviada.\n\n" +
                    respostaFoto.mensagem
                );

            }

        }


        if (btnCadastrar) {

            btnCadastrar.innerText =
                "Carregando perfil...";

        }


        const respostaPet =
            await buscarPet(TOKEN);


        if (!respostaPet.sucesso) {

            location.reload();

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

        if (btnCadastrar) {

            btnCadastrar.disabled =
                false;

            btnCadastrar.innerText =
                "Cadastrar";

        }

    }

}


/* ===================================================
   LOCALIZAÇÃO
=================================================== */

function enviarMinhaLocalizacao() {

    if (!navigator.geolocation) {

        alert(
            "Seu navegador não suporta localização."
        );

        return;

    }


    navigator.geolocation
        .getCurrentPosition(

            async function (posicao) {

                const resposta =
                    await enviarLocalizacao(

                        TOKEN,

                        posicao.coords.latitude,

                        posicao.coords.longitude

                    );


                if (resposta.sucesso) {

                    mostrarMensagem();

                } else {

                    alert(
                        resposta.mensagem
                    );

                }

            },


            function (erro) {

                console.error(
                    "Erro de localização:",
                    erro
                );

                alert(
                    "Não foi possível obter sua localização."
                );

            },


            {

                enableHighAccuracy: true,

                timeout: 15000,

                maximumAge: 0

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

                <p>${escaparHTML(msg)}</p>

            </div>

        </div>

    `;

}


/**
 * Evita inserir HTML em mensagens
 */
function escaparHTML(texto) {

    const elemento =
        document.createElement(
            "div"
        );

    elemento.innerText =
        String(texto || "");

    return elemento.innerHTML;

}
