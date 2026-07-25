//==================================================
// PERFIL ADMINISTRATIVO DO PET
//==================================================

let petAtual = null;
let novaFotoBase64 = "";


//==================================================
// INICIAR PÁGINA
//==================================================

document.addEventListener("DOMContentLoaded", function () {

    const token = obterTokenDaUrl();

    if (!token) {

        mostrarErro(
            "Token do pet não informado."
        );

        return;

    }

    configurarEventos();

    carregarPerfilPet(token);

});


//==================================================
// PEGAR TOKEN DA URL
//==================================================

function obterTokenDaUrl() {

    const parametros =
        new URLSearchParams(
            window.location.search
        );

    return (
        parametros.get("token") || ""
    ).trim();

}


//==================================================
// CONFIGURAR EVENTOS
//==================================================

function configurarEventos() {

    const btnSalvar =
        document.getElementById("btnSalvar");

    const btnTrocarFoto =
        document.getElementById("btnTrocarFoto");

    const arquivoFoto =
        document.getElementById("arquivoFoto");

    if (btnSalvar) {

        btnSalvar.addEventListener(
            "click",
            salvarAlteracoesPet
        );

    }

    if (btnTrocarFoto) {

        btnTrocarFoto.addEventListener(
            "click",
            function () {

                arquivoFoto.click();

            }
        );

    }

    if (arquivoFoto) {

        arquivoFoto.addEventListener(
            "change",
            selecionarNovaFoto
        );

    }

}


//==================================================
// CARREGAR DADOS DO PET
//==================================================

async function carregarPerfilPet(token) {

    bloquearFormulario(true);

    mostrarMensagem(
        "Carregando dados do pet...",
        "info"
    );

    try {

        /*
         * Reutiliza listarPets(), que já está
         * funcionando no painel administrativo.
         *
         * Não altera nenhuma função da área
         * do tutor.
         */
        const resposta =
            await listarPets();

        if (!resposta || !resposta.sucesso) {

            throw new Error(
                resposta?.mensagem ||
                "Não foi possível carregar os pets."
            );

        }

        const lista =
            Array.isArray(resposta.dados)
                ? resposta.dados
                : [];

        petAtual = lista.find(
            pet =>
                String(pet.token || "").trim() ===
                String(token).trim()
        );

        if (!petAtual) {

            throw new Error(
                "Pet não encontrado."
            );

        }

        preencherFormulario(petAtual);

        esconderMensagem();

    } catch (erro) {

        console.error(
            "Erro ao carregar pet:",
            erro
        );

        mostrarErro(
            erro.message ||
            "Erro ao carregar os dados do pet."
        );

    } finally {

        bloquearFormulario(false);

    }

}


//==================================================
// PREENCHER FORMULÁRIO
//==================================================

function preencherFormulario(pet) {

    const foto =
        pet.foto ||
        "https://placehold.co/300x300?text=PET";

    definirValor(
        "nomePet",
        pet.nome_pet
    );

    definirValor(
        "nomeTutor",
        pet.nome_tutor
    );

    definirValor(
        "whatsapp",
        pet.whatsapp
    );

    definirValor(
        "email",
        pet.email
    );

    definirValor(
        "status",
        pet.status || "ATIVO"
    );

    definirValor(
        "token",
        pet.token
    );

    definirValor(
        "codigoAtivacao",
        pet.codigo_ativacao
    );

    definirValor(
        "dataCadastro",
        formatarData(
            pet.data_cadastro
        )
    );

    definirValor(
        "ultimaLocalizacao",
        pet.ultima_localizacao
    );

    definirTexto(
        "tituloPet",
        pet.nome_pet || "Pet"
    );

    definirTexto(
        "codigoTag",
        pet.token
            ? "TAG: " + pet.token
            : "TAG"
    );

    const imagem =
        document.getElementById("fotoPet");

    if (imagem) {

        imagem.src = foto;

        imagem.onerror = function () {

            this.onerror = null;

            this.src =
                "https://placehold.co/300x300?text=PET";

        };

    }

    configurarBotaoMaps(
        pet.ultima_localizacao
    );

}


//==================================================
// SALVAR ALTERAÇÕES
//==================================================

async function salvarAlteracoesPet() {

    if (!petAtual) {

        mostrarErro(
            "Os dados do pet ainda não foram carregados."
        );

        return;

    }

    const dados = coletarDadosFormulario();

    const erroValidacao =
        validarFormulario(dados);

    if (erroValidacao) {

        mostrarErro(
            erroValidacao
        );

        return;

    }

    const btnSalvar =
        document.getElementById("btnSalvar");

    try {

        bloquearBotao(
            btnSalvar,
            true,
            "Salvando..."
        );

        mostrarMensagem(
            "Salvando alterações...",
            "info"
        );

        /*
         * Esta função será adicionada no api.js
         * e chamará somente a rota administrativa.
         */
        if (
            typeof salvarPetAdmin !==
            "function"
        ) {

            throw new Error(
                "A função salvarPetAdmin ainda não foi adicionada ao arquivo api.js."
            );

        }

        const resposta =
            await salvarPetAdmin(dados);

        if (!resposta || !resposta.sucesso) {

            throw new Error(
                resposta?.mensagem ||
                "Não foi possível salvar o pet."
            );

        }

        petAtual = {
            ...petAtual,
            ...dados
        };

        novaFotoBase64 = "";

        mostrarMensagem(
            resposta.mensagem ||
            "Alterações salvas com sucesso.",
            "success"
        );

        definirTexto(
            "tituloPet",
            dados.nome_pet
        );

        configurarBotaoMaps(
            petAtual.ultima_localizacao
        );

    } catch (erro) {

        console.error(
            "Erro ao salvar pet:",
            erro
        );

        mostrarErro(
            erro.message ||
            "Erro ao salvar as alterações."
        );

    } finally {

        bloquearBotao(
            btnSalvar,
            false
        );

    }

}


//==================================================
// COLETAR DADOS DO FORMULÁRIO
//==================================================

function coletarDadosFormulario() {

    return {

        token:
            obterValor("token"),

        nome_pet:
            obterValor("nomePet"),

        nome_tutor:
            obterValor("nomeTutor"),

        whatsapp:
            obterValor("whatsapp"),

        email:
            obterValor("email"),

        status:
            obterValor("status"),

        /*
         * Só envia a foto quando o administrador
         * selecionar uma nova imagem.
         */
        foto:
            novaFotoBase64 || ""

    };

}


//==================================================
// VALIDAR FORMULÁRIO
//==================================================

function validarFormulario(dados) {

    if (!dados.token) {

        return "Token da TAG não encontrado.";

    }

    if (!dados.nome_pet) {

        return "Informe o nome do pet.";

    }

    if (!dados.nome_tutor) {

        return "Informe o nome do tutor.";

    }

    if (!dados.whatsapp) {

        return "Informe o WhatsApp do tutor.";

    }

    if (
        dados.email &&
        !validarEmail(dados.email)
    ) {

        return "Informe um e-mail válido.";

    }

    const statusPermitidos = [
        "ATIVO",
        "BLOQUEADO",
        "LIVRE"
    ];

    if (
        !statusPermitidos.includes(
            dados.status
        )
    ) {

        return "Status inválido.";

    }

    return "";

}


//==================================================
// SELECIONAR E PREVISUALIZAR FOTO
//==================================================

async function selecionarNovaFoto(evento) {

    const campoArquivo = evento.target;

    const arquivo =
        campoArquivo.files &&
        campoArquivo.files.length > 0
            ? campoArquivo.files[0]
            : null;

    if (!arquivo) {
        return;
    }


    // Tipos de imagem permitidos
    const tiposPermitidos = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];


    if (!tiposPermitidos.includes(arquivo.type)) {

        mostrarErro(
            "Escolha uma imagem JPG, PNG ou WEBP."
        );

        campoArquivo.value = "";

        return;
    }


    /*
     * Limite do arquivo original escolhido.
     *
     * Depois disso, a imagem será automaticamente
     * reduzida para no máximo 512 pixels.
     */
    const limiteArquivo =
        5 * 1024 * 1024;


    if (arquivo.size > limiteArquivo) {

        mostrarErro(
            "A imagem deve ter no máximo 5 MB."
        );

        campoArquivo.value = "";

        return;
    }


    try {

        mostrarMensagem(
            "Preparando a nova foto...",
            "info"
        );


        /*
         * Reduz a imagem antes de armazenar
         * na variável que será enviada à API.
         */
        novaFotoBase64 =
            await reduzirFotoAdmin(
                arquivo
            );


        const foto =
            document.getElementById(
                "fotoPet"
            );


        if (foto) {

            foto.src =
                novaFotoBase64;

        }


        console.log(
            "Foto preparada:",
            Math.round(
                novaFotoBase64.length / 1024
            ),
            "KB em Base64"
        );


        mostrarMensagem(
            "Nova foto preparada. Clique em Salvar Alterações.",
            "warning"
        );


    } catch (erro) {

        console.error(
            "Erro ao preparar a foto:",
            erro
        );


        novaFotoBase64 = "";

        campoArquivo.value = "";


        mostrarErro(
            erro.message ||
            "Não foi possível processar a imagem."
        );

    }

}


//==================================================
// REDUZIR FOTO DO PAINEL ADMINISTRATIVO
//==================================================

function reduzirFotoAdmin(arquivo) {

    return new Promise(function(resolve, reject) {

        const leitor = new FileReader();

        leitor.onerror = function() {

            reject(
                new Error(
                    "Não foi possível ler a imagem."
                )
            );

        };

        leitor.onload = function(eventoLeitor) {

            const imagem = new Image();

            imagem.onerror = function() {

                reject(
                    new Error(
                        "O arquivo selecionado não é uma imagem válida."
                    )
                );

            };

            imagem.onload = function() {

                try {

                    /*
                     * Começa com no máximo 500 pixels.
                     */
                    let tamanhoMaximo = 500;

                    /*
                     * Começa com qualidade de 70%.
                     */
                    let qualidade = 0.70;

                    /*
                     * Mantemos abaixo de 45 mil caracteres
                     * para caber com segurança na planilha.
                     */
                    const limiteCaracteres = 45000;

                    let fotoReduzida = "";

                    /*
                     * Tenta comprimir várias vezes,
                     * reduzindo tamanho e qualidade.
                     */
                    for (
                        let tentativa = 1;
                        tentativa <= 10;
                        tentativa++
                    ) {

                        let largura =
                            imagem.naturalWidth ||
                            imagem.width;

                        let altura =
                            imagem.naturalHeight ||
                            imagem.height;

                        if (!largura || !altura) {

                            throw new Error(
                                "Não foi possível identificar o tamanho da imagem."
                            );

                        }

                        /*
                         * Mantém a proporção da imagem.
                         */
                        if (
                            largura > altura &&
                            largura > tamanhoMaximo
                        ) {

                            altura = Math.round(
                                altura *
                                tamanhoMaximo /
                                largura
                            );

                            largura = tamanhoMaximo;

                        } else if (
                            altura > tamanhoMaximo
                        ) {

                            largura = Math.round(
                                largura *
                                tamanhoMaximo /
                                altura
                            );

                            altura = tamanhoMaximo;

                        }

                        const canvas =
                            document.createElement(
                                "canvas"
                            );

                        canvas.width = largura;
                        canvas.height = altura;

                        const contexto =
                            canvas.getContext("2d");

                        if (!contexto) {

                            throw new Error(
                                "O navegador não conseguiu processar a imagem."
                            );

                        }

                        /*
                         * Fundo branco para imagens transparentes.
                         */
                        contexto.fillStyle = "#ffffff";

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

                        fotoReduzida =
                            canvas.toDataURL(
                                "image/jpeg",
                                qualidade
                            );

                        console.log(
                            "Tentativa:",
                            tentativa,
                            "| Dimensão:",
                            largura + "x" + altura,
                            "| Qualidade:",
                            qualidade.toFixed(2),
                            "| Caracteres:",
                            fotoReduzida.length
                        );

                        /*
                         * Quando ficar abaixo do limite,
                         * encerra o processamento.
                         */
                        if (
                            fotoReduzida.length <=
                            limiteCaracteres
                        ) {

                            resolve(
                                fotoReduzida
                            );

                            return;

                        }

                        /*
                         * Reduz gradualmente para
                         * a próxima tentativa.
                         */
                        tamanhoMaximo =
                            Math.round(
                                tamanhoMaximo * 0.88
                            );

                        qualidade =
                            Math.max(
                                0.45,
                                qualidade - 0.05
                            );

                    }

                    reject(
                        new Error(
                            "A imagem não pôde ser reduzida o suficiente. Escolha outra foto."
                        )
                    );

                } catch (erro) {

                    reject(erro);

                }

            };

            imagem.src =
                eventoLeitor.target.result;

        };

        leitor.readAsDataURL(
            arquivo
        );

    });

}

//==================================================
// CONFIGURAR BOTÃO DO MAPS
//==================================================

function configurarBotaoMaps(localizacao) {

    const botao =
        document.getElementById("btnMaps");

    if (!botao) {

        return;

    }

    const texto =
        String(localizacao || "").trim();

    if (!texto) {

        botao.href = "#";

        botao.classList.add("disabled");

        botao.setAttribute(
            "aria-disabled",
            "true"
        );

        return;

    }

    let linkMaps = "";

    if (
        texto.startsWith("http://") ||
        texto.startsWith("https://")
    ) {

        linkMaps = texto;

    } else {

        /*
         * Aceita localização no formato:
         *
         * -26.123456,-48.123456
         */
        const coordenadas =
            extrairCoordenadas(texto);

        if (coordenadas) {

            linkMaps =
                "https://maps.google.com/?q=" +
                encodeURIComponent(
                    coordenadas
                );

        }

    }

    if (!linkMaps) {

        botao.href = "#";

        botao.classList.add("disabled");

        botao.setAttribute(
            "aria-disabled",
            "true"
        );

        return;

    }

    botao.href = linkMaps;

    botao.classList.remove("disabled");

    botao.removeAttribute(
        "aria-disabled"
    );

}


//==================================================
// EXTRAIR LATITUDE E LONGITUDE
//==================================================

function extrairCoordenadas(texto) {

    const resultado =
        String(texto).match(
            /(-?\d{1,3}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)/
        );

    if (!resultado) {

        return "";

    }

    return (
        resultado[1] +
        "," +
        resultado[2]
    );

}


//==================================================
// FORMATAR DATA
//==================================================

function formatarData(valor) {

    if (!valor) {

        return "";

    }

    const data =
        new Date(valor);

    if (
        Number.isNaN(
            data.getTime()
        )
    ) {

        return String(valor);

    }

    return data.toLocaleString(
        "pt-BR"
    );

}


//==================================================
// VALIDAR E-MAIL
//==================================================

function validarEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
    );

}


//==================================================
// FUNÇÕES AUXILIARES
//==================================================

function obterValor(id) {

    const elemento =
        document.getElementById(id);

    if (!elemento) {

        return "";

    }

    return String(
        elemento.value || ""
    ).trim();

}


function definirValor(id, valor) {

    const elemento =
        document.getElementById(id);

    if (!elemento) {

        return;

    }

    elemento.value =
        valor ?? "";

}


function definirTexto(id, valor) {

    const elemento =
        document.getElementById(id);

    if (!elemento) {

        return;

    }

    elemento.textContent =
        valor ?? "";

}


//==================================================
// MENSAGENS
//==================================================

function mostrarMensagem(
    mensagem,
    tipo = "info"
) {

    let caixa =
        document.getElementById(
            "mensagemPerfilPet"
        );

    if (!caixa) {

        caixa =
            document.createElement("div");

        caixa.id =
            "mensagemPerfilPet";

        const conteudo =
            document.querySelector(
                "main.content"
            );

        if (conteudo) {

            conteudo.insertBefore(
                caixa,
                conteudo.children[1] || null
            );

        }

    }

    caixa.className =
        "alert alert-" +
        tipo +
        " mb-4";

    caixa.textContent =
        mensagem;

    caixa.classList.remove(
        "d-none"
    );

}


function mostrarErro(mensagem) {

    mostrarMensagem(
        mensagem,
        "danger"
    );

}


function esconderMensagem() {

    const caixa =
        document.getElementById(
            "mensagemPerfilPet"
        );

    if (caixa) {

        caixa.classList.add(
            "d-none"
        );

    }

}


//==================================================
// BLOQUEAR FORMULÁRIO
//==================================================

function bloquearFormulario(bloquear) {

    const elementos =
        document.querySelectorAll(
            "#nomePet, " +
            "#nomeTutor, " +
            "#whatsapp, " +
            "#email, " +
            "#status, " +
            "#btnTrocarFoto, " +
            "#btnSalvar"
        );

    elementos.forEach(
        elemento => {

            elemento.disabled =
                bloquear;

        }
    );

}


//==================================================
// BLOQUEAR BOTÃO
//==================================================

function bloquearBotao(
    botao,
    bloquear,
    texto = ""
) {

    if (!botao) {

        return;

    }

    if (bloquear) {

        botao.dataset.textoOriginal =
            botao.innerHTML;

        botao.disabled = true;

        botao.innerHTML =
            '<span class="spinner-border ' +
            'spinner-border-sm me-2" ' +
            'role="status"></span>' +
            texto;

        return;

    }

    botao.disabled = false;

    if (
        botao.dataset.textoOriginal
    ) {

        botao.innerHTML =
            botao.dataset.textoOriginal;

    }

}
