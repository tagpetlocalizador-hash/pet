/*************************************************
 * PET NFC ADMIN
 * configuracoes.js
 *************************************************/


/* =====================================================
   CONFIGURAÇÕES PADRÃO
===================================================== */

const CONFIGURACOES_PADRAO = {

    empresa: {

        nomeEmpresa: "LINKA Gift",

        nomeSistema: "PET NFC",

        emailEmpresa: "",

        whatsappEmpresa: "",

        siteEmpresa: "",

        instagramEmpresa: "",

        rodapeEmpresa:
            "© LINKA Gift - Todos os direitos reservados",

        logoEmpresa: "",

        marcaBrancaAtiva: true

    },


    site: {

        urlSitePublico: "",

        tituloSitePublico: "PET NFC",

        faviconSite: "",

        descricaoSitePublico:
            "Identificação inteligente para pets.",

        mostrarBotaoLigar: true,

        mostrarBotaoWhatsapp: true,

        mostrarLogoSite: true

    },


    tags: {

        prefixoToken: "PET",

        quantidadePadraoLote: 10,

        tamanhoCodigoAtivacao: 6,

        bloquearExclusaoAtivada: true,

        permitirReutilizarTag: true,

        abrirEtiquetasAposLote: false,

        confirmarResetTag: true

    },


    notificacoes: {

        solicitarLocalizacao: true,

        repetirLocalizacao: true,

        intervaloLocalizacao: 5000,

        tipoNotificacao: "EMAIL",

        emailNotificacoes: "",

        mensagemLocalizacaoNegada:
            "🐾 A localização está desligada ou bloqueada.\n\n" +
            "Ligue a localização do celular e passe a tag novamente " +
            "para ajudar a encontrar o tutor deste pet.",

        mensagemLocalizacaoEnviada:
            "📍 Localização compartilhada com sucesso. " +
            "Obrigado por ajudar este pet!"

    },


    aparencia: {

        temaPublico: "CLASSICO",

        corPetPrincipal: "#2E7D32",

        corPetSecundaria: "#43A047",

        corTutorPrincipal: "#2E7D32",

        corTutorSecundaria: "#43A047",

        corFundoPet: "#F3F8F4",

        corFundoTutor: "#F5F7F9",

        corBotaoLigar: "#1976D2",

        corBotaoLocalizacao: "#F9A825",

        mostrarLogoPet: true,

        mostrarLogoTutor: true,

        mostrarRodapePublico: true,

        usarMesmoTema: true

    },


    seguranca: {

        tempoSessao: 60,

        tentativasLogin: 5,

        confirmarExclusaoTag: true,

        confirmarBloqueioTag: true

    },


    sistema: {

        versao: "1.1.0",

        ultimoBackup: ""

    }

};


/* =====================================================
   VARIÁVEIS
===================================================== */

const CHAVE_CONFIGURACOES =
    "petNfcConfiguracoes";

let acaoConfirmacao = null;

let modalConfirmacao = null;


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

document.addEventListener("DOMContentLoaded", function(){

    inicializarModal();

    carregarConfiguracoes();

    configurarEventos();

    atualizarPreview();

    carregarInformacoesSistema();

});


/* =====================================================
   MODAL
===================================================== */

function inicializarModal(){

    const elementoModal =
        document.getElementById("modalConfirmacao");

    if(
        elementoModal &&
        typeof bootstrap !== "undefined"
    ){

        modalConfirmacao =
            new bootstrap.Modal(elementoModal);

    }

}


/* =====================================================
   EVENTOS
===================================================== */

function configurarEventos(){

    const formulario =
        document.getElementById("formConfiguracoes");

    formulario?.addEventListener(
        "submit",
        function(evento){

            evento.preventDefault();

            salvarConfiguracoes();

        }
    );


    document
        .getElementById("btnSalvarConfiguracoesTopo")
        ?.addEventListener(
            "click",
            salvarConfiguracoes
        );


    document
        .getElementById("btnRestaurarPadrao")
        ?.addEventListener(
            "click",
            function(){

                abrirConfirmacao(

                    "Restaurar configurações",

                    "Deseja restaurar todas as configurações padrão?",

                    restaurarConfiguracoesPadrao

                );

            }
        );


    document
        .getElementById("btnConfirmarOperacao")
        ?.addEventListener(
            "click",
            executarAcaoConfirmada
        );

    configurarEventosPersonalizacao();


    document
        .getElementById("btnFazerBackup")
        ?.addEventListener(
            "click",
            fazerBackup
        );


    document
        .getElementById("btnRestaurarBackup")
        ?.addEventListener(
            "click",
            restaurarBackup
        );


    document
        .getElementById("btnLimparTagsTeste")
        ?.addEventListener(
            "click",
            function(){

                abrirConfirmacao(

                    "Limpar TAGs de teste",

                    "Esta operação deverá excluir TAGs livres e sem pet vinculado. Deseja continuar?",

                    limparTagsTeste

                );

            }
        );


    document
        .getElementById("btnLimparRegistros")
        ?.addEventListener(
            "click",
            function(){

                abrirConfirmacao(

                    "Limpar registros",

                    "Deseja excluir os registros antigos de localização e logs?",

                    limparRegistros

                );

            }
        );


    document
        .getElementById("btnAlterarSenha")
        ?.addEventListener(
            "click",
            alterarSenha
        );


    document
        .getElementById("btnTestarConexao")
        ?.addEventListener(
            "click",
            testarConexao
        );

}


/* =====================================================
   CARREGAR CONFIGURAÇÕES
===================================================== */

function carregarConfiguracoes(){

    let configuracoes = copiarObjeto(
        CONFIGURACOES_PADRAO
    );

    try{

        const dadosSalvos =
            localStorage.getItem(
                CHAVE_CONFIGURACOES
            );

        if(dadosSalvos){

            const dados =
                JSON.parse(dadosSalvos);

            configuracoes =
                mesclarObjetos(
                    configuracoes,
                    dados
                );

        }

    }catch(erro){

        console.error(
            "Erro ao carregar configurações:",
            erro
        );

    }

    preencherCampos(configuracoes);

    aplicarConfiguracoesVisuais(configuracoes);

}


/* =====================================================
   PREENCHER CAMPOS
===================================================== */

function preencherCampos(configuracoes){

    preencherGrupo(configuracoes.empresa);

    preencherGrupo(configuracoes.site);

    preencherGrupo(configuracoes.tags);

    preencherGrupo(configuracoes.notificacoes);

    preencherGrupo(configuracoes.aparencia);

    preencherGrupo(configuracoes.seguranca);

}


function preencherGrupo(grupo){

    if(!grupo){

        return;

    }

    Object.entries(grupo).forEach(
        function([id, valor]){

            const campo =
                document.getElementById(id);

            if(!campo){

                return;

            }

            if(campo.type === "checkbox"){

                campo.checked =
                    Boolean(valor);

            }else{

                campo.value =
                    valor ?? "";

            }

        }
    );

}


/* =====================================================
   COLETAR CONFIGURAÇÕES
===================================================== */

function coletarConfiguracoes(){

    return {

        empresa: {

            nomeEmpresa:
                obterValor("nomeEmpresa"),

            nomeSistema:
                obterValor("nomeSistema"),

            emailEmpresa:
                obterValor("emailEmpresa"),

            whatsappEmpresa:
                obterValor("whatsappEmpresa"),

            siteEmpresa:
                obterValor("siteEmpresa"),

            instagramEmpresa:
                obterValor("instagramEmpresa"),

            rodapeEmpresa:
                obterValor("rodapeEmpresa"),

            logoEmpresa:
                obterValor("logoEmpresa"),

            marcaBrancaAtiva:
                obterMarcado("marcaBrancaAtiva")

        },


        site: {

            urlSitePublico:
                obterValor("urlSitePublico"),

            tituloSitePublico:
                obterValor("tituloSitePublico"),

            faviconSite:
                obterValor("faviconSite"),

            descricaoSitePublico:
                obterValor("descricaoSitePublico"),

            mostrarBotaoLigar:
                obterMarcado("mostrarBotaoLigar"),

            mostrarBotaoWhatsapp:
                obterMarcado("mostrarBotaoWhatsapp"),

            mostrarLogoSite:
                obterMarcado("mostrarLogoSite")

        },


        tags: {

            prefixoToken:
                obterValor("prefixoToken")
                    .toUpperCase(),

            quantidadePadraoLote:
                obterNumero(
                    "quantidadePadraoLote",
                    10
                ),

            tamanhoCodigoAtivacao:
                obterNumero(
                    "tamanhoCodigoAtivacao",
                    6
                ),

            bloquearExclusaoAtivada:
                obterMarcado(
                    "bloquearExclusaoAtivada"
                ),

            permitirReutilizarTag:
                obterMarcado(
                    "permitirReutilizarTag"
                ),

            abrirEtiquetasAposLote:
                obterMarcado(
                    "abrirEtiquetasAposLote"
                ),

            confirmarResetTag:
                obterMarcado(
                    "confirmarResetTag"
                )

        },


        notificacoes: {

            solicitarLocalizacao:
                obterMarcado(
                    "solicitarLocalizacao"
                ),

            repetirLocalizacao:
                obterMarcado(
                    "repetirLocalizacao"
                ),

            intervaloLocalizacao:
                obterNumero(
                    "intervaloLocalizacao",
                    5000
                ),

            tipoNotificacao:
                obterValor(
                    "tipoNotificacao"
                ),

            emailNotificacoes:
                obterValor(
                    "emailNotificacoes"
                ),

            mensagemLocalizacaoNegada:
                obterValor(
                    "mensagemLocalizacaoNegada"
                ),

            mensagemLocalizacaoEnviada:
                obterValor(
                    "mensagemLocalizacaoEnviada"
                )

        },


        aparencia: {

            temaPublico:
                obterValor("temaPublico") || "CLASSICO",

            corPetPrincipal:
                obterValor("corPetPrincipal") || "#2E7D32",

            corPetSecundaria:
                obterValor("corPetSecundaria") || "#43A047",

            corTutorPrincipal:
                obterValor("corTutorPrincipal") || "#2E7D32",

            corTutorSecundaria:
                obterValor("corTutorSecundaria") || "#43A047",

            corFundoPet:
                obterValor("corFundoPet") || "#F3F8F4",

            corFundoTutor:
                obterValor("corFundoTutor") || "#F5F7F9",

            corBotaoLigar:
                obterValor("corBotaoLigar") || "#1976D2",

            corBotaoLocalizacao:
                obterValor("corBotaoLocalizacao") || "#F9A825",

            mostrarLogoPet:
                obterMarcado("mostrarLogoPet"),

            mostrarLogoTutor:
                obterMarcado("mostrarLogoTutor"),

            mostrarRodapePublico:
                obterMarcado("mostrarRodapePublico"),

            usarMesmoTema:
                obterMarcado("usarMesmoTema")

        },


        seguranca: {

            tempoSessao:
                obterNumero(
                    "tempoSessao",
                    60
                ),

            tentativasLogin:
                obterNumero(
                    "tentativasLogin",
                    5
                ),

            confirmarExclusaoTag:
                obterMarcado(
                    "confirmarExclusaoTag"
                ),

            confirmarBloqueioTag:
                obterMarcado(
                    "confirmarBloqueioTag"
                )

        },


        sistema: {

            versao:
                document
                    .getElementById("infoVersao")
                    ?.textContent
                    ?.trim() || "1.1.0",

            ultimoBackup:
                obterUltimoBackup()

        }

    };

}


/* =====================================================
   SALVAR
===================================================== */

function salvarConfiguracoes(){

    if(!validarConfiguracoes()){

        return;

    }

    const configuracoes =
        coletarConfiguracoes();

    try{

        localStorage.setItem(

            CHAVE_CONFIGURACOES,

            JSON.stringify(configuracoes)

        );

        aplicarConfiguracoesVisuais(
            configuracoes
        );

        atualizarPreview();

        mostrarMensagem(
            "Configurações salvas com sucesso.",
            "success"
        );

    }catch(erro){

        console.error(
            "Erro ao salvar configurações:",
            erro
        );

        mostrarMensagem(
            "Não foi possível salvar as configurações.",
            "danger"
        );

    }

}


/* =====================================================
   VALIDAÇÃO
===================================================== */

function validarConfiguracoes(){

    const nomeSistema =
        obterValor("nomeSistema");

    const prefixo =
        obterValor("prefixoToken");

    const quantidade =
        obterNumero(
            "quantidadePadraoLote",
            0
        );

    if(!nomeSistema){

        mostrarMensagem(
            "Informe o nome do sistema.",
            "warning"
        );

        abrirAbaCampo(
            "abaEmpresa",
            "nomeSistema"
        );

        return false;

    }

    if(!prefixo){

        mostrarMensagem(
            "Informe o prefixo das TAGs.",
            "warning"
        );

        abrirAbaCampo(
            "abaTags",
            "prefixoToken"
        );

        return false;

    }

    if(
        quantidade < 2 ||
        quantidade > 500
    ){

        mostrarMensagem(
            "A quantidade padrão deve estar entre 2 e 500.",
            "warning"
        );

        abrirAbaCampo(
            "abaTags",
            "quantidadePadraoLote"
        );

        return false;

    }

    return true;

}


/* =====================================================
   RESTAURAR PADRÃO
===================================================== */

function restaurarConfiguracoesPadrao(){

    try{

        localStorage.setItem(

            CHAVE_CONFIGURACOES,

            JSON.stringify(
                CONFIGURACOES_PADRAO
            )

        );

        preencherCampos(
            CONFIGURACOES_PADRAO
        );

        aplicarConfiguracoesVisuais(
            CONFIGURACOES_PADRAO
        );

        atualizarPreview();

        mostrarMensagem(
            "Configurações padrão restauradas.",
            "success"
        );

    }catch(erro){

        console.error(erro);

        mostrarMensagem(
            "Não foi possível restaurar as configurações.",
            "danger"
        );

    }

}


/* =====================================================
   PERSONALIZAÇÃO DAS PÁGINAS PÚBLICAS
===================================================== */

const TEMAS_PUBLICOS = {

    CLASSICO: {
        corPetPrincipal: "#2E7D32",
        corPetSecundaria: "#43A047",
        corTutorPrincipal: "#2E7D32",
        corTutorSecundaria: "#43A047",
        corFundoPet: "#F3F8F4",
        corFundoTutor: "#F5F7F9",
        corBotaoLigar: "#1976D2",
        corBotaoLocalizacao: "#F9A825"
    },

    AZUL: {
        corPetPrincipal: "#1565C0",
        corPetSecundaria: "#42A5F5",
        corTutorPrincipal: "#1565C0",
        corTutorSecundaria: "#42A5F5",
        corFundoPet: "#F1F7FD",
        corFundoTutor: "#F3F7FC",
        corBotaoLigar: "#0D47A1",
        corBotaoLocalizacao: "#F9A825"
    },

    ROXO: {
        corPetPrincipal: "#6A1B9A",
        corPetSecundaria: "#AB47BC",
        corTutorPrincipal: "#6A1B9A",
        corTutorSecundaria: "#AB47BC",
        corFundoPet: "#F8F2FA",
        corFundoTutor: "#F7F3F9",
        corBotaoLigar: "#3949AB",
        corBotaoLocalizacao: "#FB8C00"
    },

    LARANJA: {
        corPetPrincipal: "#E65100",
        corPetSecundaria: "#FB8C00",
        corTutorPrincipal: "#E65100",
        corTutorSecundaria: "#FB8C00",
        corFundoPet: "#FFF7F0",
        corFundoTutor: "#FFF8F2",
        corBotaoLigar: "#1976D2",
        corBotaoLocalizacao: "#F57C00"
    },

    VERMELHO: {
        corPetPrincipal: "#B71C1C",
        corPetSecundaria: "#E53935",
        corTutorPrincipal: "#B71C1C",
        corTutorSecundaria: "#E53935",
        corFundoPet: "#FFF5F5",
        corFundoTutor: "#FFF7F7",
        corBotaoLigar: "#1565C0",
        corBotaoLocalizacao: "#F9A825"
    },

    ESCURO: {
        corPetPrincipal: "#263238",
        corPetSecundaria: "#546E7A",
        corTutorPrincipal: "#263238",
        corTutorSecundaria: "#546E7A",
        corFundoPet: "#E8ECEE",
        corFundoTutor: "#ECEFF1",
        corBotaoLigar: "#1565C0",
        corBotaoLocalizacao: "#EF6C00"
    }

};


function configurarEventosPersonalizacao(){

    const tema =
        document.getElementById("temaPublico");

    tema?.addEventListener(
        "change",
        function(){

            aplicarTemaPublicoSelecionado();
            atualizarPreview();

        }
    );


    const camposCores = [
        "corPetPrincipal",
        "corPetSecundaria",
        "corTutorPrincipal",
        "corTutorSecundaria",
        "corFundoPet",
        "corFundoTutor",
        "corBotaoLigar",
        "corBotaoLocalizacao"
    ];


    camposCores.forEach(
        function(id){

            document
                .getElementById(id)
                ?.addEventListener(
                    "input",
                    function(){

                        sincronizarTemaTutor();
                        atualizarPreview();

                    }
                );

        }
    );


    document
        .getElementById("usarMesmoTema")
        ?.addEventListener(
            "change",
            function(){

                sincronizarTemaTutor();
                atualizarEstadoCamposPersonalizados();
                atualizarPreview();

            }
        );


    [
        "mostrarLogoPet",
        "mostrarLogoTutor",
        "mostrarRodapePublico"
    ].forEach(
        function(id){

            document
                .getElementById(id)
                ?.addEventListener(
                    "change",
                    atualizarPreview
                );

        }
    );


    atualizarEstadoCamposPersonalizados();

}


function aplicarTemaPublicoSelecionado(){

    const tema =
        obterValor("temaPublico") ||
        "CLASSICO";

    if(tema !== "PERSONALIZADO"){

        const cores =
            TEMAS_PUBLICOS[tema] ||
            TEMAS_PUBLICOS.CLASSICO;

        Object.entries(cores).forEach(
            function([id, valor]){

                const campo =
                    document.getElementById(id);

                if(campo){
                    campo.value = valor;
                }

            }
        );

    }

    sincronizarTemaTutor();
    atualizarEstadoCamposPersonalizados();

}


function sincronizarTemaTutor(){

    if(!obterMarcado("usarMesmoTema")){
        return;
    }

    definirValorCampo(
        "corTutorPrincipal",
        obterValor("corPetPrincipal") || "#2E7D32"
    );

    definirValorCampo(
        "corTutorSecundaria",
        obterValor("corPetSecundaria") || "#43A047"
    );

    definirValorCampo(
        "corFundoTutor",
        obterValor("corFundoPet") || "#F3F8F4"
    );

}


function atualizarEstadoCamposPersonalizados(){

    const personalizado =
        obterValor("temaPublico") ===
        "PERSONALIZADO";

    const mesmoTema =
        obterMarcado("usarMesmoTema");

    const area =
        document.getElementById(
            "areaCoresPersonalizadas"
        );

    area?.classList.toggle(
        "cores-desativadas",
        !personalizado
    );


    [
        "corPetPrincipal",
        "corPetSecundaria",
        "corFundoPet",
        "corBotaoLigar",
        "corBotaoLocalizacao"
    ].forEach(
        function(id){

            const campo =
                document.getElementById(id);

            if(campo){
                campo.disabled = !personalizado;
            }

        }
    );


    [
        "corTutorPrincipal",
        "corTutorSecundaria",
        "corFundoTutor"
    ].forEach(
        function(id){

            const campo =
                document.getElementById(id);

            if(campo){
                campo.disabled =
                    !personalizado || mesmoTema;
            }

        }
    );

}


function atualizarPreview(){

    sincronizarTemaTutor();
    atualizarEstadoCamposPersonalizados();

    const corPetPrincipal =
        obterValor("corPetPrincipal") ||
        "#2E7D32";

    const corPetSecundaria =
        obterValor("corPetSecundaria") ||
        "#43A047";

    const corTutorPrincipal =
        obterValor("corTutorPrincipal") ||
        corPetPrincipal;

    const corTutorSecundaria =
        obterValor("corTutorSecundaria") ||
        corPetSecundaria;

    const corFundoPet =
        obterValor("corFundoPet") ||
        "#F3F8F4";

    const corFundoTutor =
        obterValor("corFundoTutor") ||
        "#F5F7F9";

    const corBotaoLigar =
        obterValor("corBotaoLigar") ||
        "#1976D2";

    const corBotaoLocalizacao =
        obterValor("corBotaoLocalizacao") ||
        "#F9A825";


    definirEstilo(
        "previewPaginaPet",
        "background",
        corFundoPet
    );

    const faixaPet =
        document.querySelector(
            ".preview-faixa-pet"
        );

    if(faixaPet){

        faixaPet.style.background =
            criarGradiente(
                corPetSecundaria,
                corPetPrincipal
            );

    }


    definirEstilo(
        "previewBotaoLigar",
        "background",
        criarGradiente(
            corBotaoLigar,
            escurecerCor(corBotaoLigar, 25)
        )
    );

    definirEstilo(
        "previewBotaoLocalizacao",
        "background",
        criarGradiente(
            corBotaoLocalizacao,
            escurecerCor(corBotaoLocalizacao, 18)
        )
    );


    definirEstilo(
        "previewPaginaTutor",
        "background",
        corFundoTutor
    );

    definirEstilo(
        "previewIconeTutor",
        "background",
        criarGradiente(
            corTutorPrincipal,
            corTutorSecundaria,
            145
        )
    );

    definirEstilo(
        "previewBotaoTutor",
        "background",
        criarGradiente(
            corTutorPrincipal,
            corTutorSecundaria
        )
    );


    const botaoTutorSecundario =
        document.getElementById(
            "previewBotaoTutorSecundario"
        );

    if(botaoTutorSecundario){

        botaoTutorSecundario.style.color =
            corTutorPrincipal;

        botaoTutorSecundario.style.borderColor =
            corTutorPrincipal;

    }

}


function aplicarConfiguracoesVisuais(
    configuracoes
){

    const empresa =
        configuracoes.empresa || {};

    const nomePainel =
        document.querySelector(
            ".sidebar h3"
        );

    if(
        nomePainel &&
        empresa.nomeSistema
    ){

        nomePainel.textContent =
            empresa.nomeSistema;

    }

    atualizarPreview();

}


function definirValorCampo(id, valor){

    const campo =
        document.getElementById(id);

    if(campo){
        campo.value = valor;
    }

}


function definirEstilo(
    id,
    propriedade,
    valor
){

    const elemento =
        document.getElementById(id);

    if(elemento){
        elemento.style[propriedade] = valor;
    }

}


function criarGradiente(
    primeiraCor,
    segundaCor,
    angulo = 135
){

    return `linear-gradient(${angulo}deg, ${primeiraCor}, ${segundaCor})`;

}


function escurecerCor(corHex, percentual){

    const cor = String(corHex || "")
        .replace("#", "")
        .trim();

    if(!/^[0-9a-fA-F]{6}$/.test(cor)){
        return corHex;
    }

    const fator =
        Math.max(0, 100 - percentual) /
        100;

    const vermelho =
        Math.round(
            parseInt(cor.slice(0, 2), 16) *
            fator
        );

    const verde =
        Math.round(
            parseInt(cor.slice(2, 4), 16) *
            fator
        );

    const azul =
        Math.round(
            parseInt(cor.slice(4, 6), 16) *
            fator
        );

    return "#" +
        [vermelho, verde, azul]
            .map(
                valor =>
                    valor
                        .toString(16)
                        .padStart(2, "0")
            )
            .join("");

}


/* =====================================================
   BACKUP
===================================================== */

function fazerBackup(){

    const configuracoes =
        coletarConfiguracoes();

    const backup = {

        sistema: "PET NFC",

        dataBackup:
            new Date().toISOString(),

        configuracoes:
            configuracoes

    };


    const conteudo =
        JSON.stringify(
            backup,
            null,
            2
        );


    const arquivo =
        new Blob(
            [conteudo],
            {
                type:
                    "application/json;charset=utf-8"
            }
        );


    const url =
        URL.createObjectURL(arquivo);


    const link =
        document.createElement("a");

    const dataArquivo =
        new Date()
            .toISOString()
            .slice(0,10);

    link.href = url;

    link.download =
        `pet-nfc-backup-${dataArquivo}.json`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);


    configuracoes.sistema.ultimoBackup =
        new Date().toISOString();

    localStorage.setItem(

        CHAVE_CONFIGURACOES,

        JSON.stringify(configuracoes)

    );

    atualizarUltimoBackup(
        configuracoes.sistema.ultimoBackup
    );

    mostrarMensagem(
        "Backup das configurações gerado com sucesso.",
        "success"
    );

}


/* =====================================================
   RESTAURAR BACKUP
===================================================== */

function restaurarBackup(){

    const campoArquivo =
        document.getElementById(
            "arquivoBackup"
        );

    const arquivo =
        campoArquivo?.files?.[0];

    if(!arquivo){

        mostrarMensagem(
            "Selecione um arquivo de backup.",
            "warning"
        );

        return;

    }


    const leitor =
        new FileReader();


    leitor.onload = function(evento){

        try{

            const dados =
                JSON.parse(
                    evento.target.result
                );

            const configuracoes =
                dados.configuracoes ||
                dados;

            const configuracoesFinais =
                mesclarObjetos(

                    copiarObjeto(
                        CONFIGURACOES_PADRAO
                    ),

                    configuracoes

                );


            localStorage.setItem(

                CHAVE_CONFIGURACOES,

                JSON.stringify(
                    configuracoesFinais
                )

            );


            preencherCampos(
                configuracoesFinais
            );

            aplicarConfiguracoesVisuais(
                configuracoesFinais
            );

            atualizarPreview();

            atualizarUltimoBackup(
                configuracoesFinais
                    .sistema
                    ?.ultimoBackup
            );

            campoArquivo.value = "";

            mostrarMensagem(
                "Backup restaurado com sucesso.",
                "success"
            );

        }catch(erro){

            console.error(erro);

            mostrarMensagem(
                "O arquivo selecionado não é um backup válido.",
                "danger"
            );

        }

    };


    leitor.onerror = function(){

        mostrarMensagem(
            "Não foi possível ler o arquivo.",
            "danger"
        );

    };


    leitor.readAsText(arquivo);

}


/* =====================================================
   ALTERAR SENHA
===================================================== */

function alterarSenha(){

    const senhaAtual =
        obterValor("senhaAtual");

    const novaSenha =
        obterValor("novaSenha");

    const confirmarSenha =
        obterValor("confirmarNovaSenha");


    if(
        !senhaAtual ||
        !novaSenha ||
        !confirmarSenha
    ){

        mostrarMensagem(
            "Preencha todos os campos da senha.",
            "warning"
        );

        return;

    }


    if(novaSenha.length < 6){

        mostrarMensagem(
            "A nova senha deve ter pelo menos 6 caracteres.",
            "warning"
        );

        return;

    }


    if(novaSenha !== confirmarSenha){

        mostrarMensagem(
            "A confirmação da nova senha não confere.",
            "warning"
        );

        return;

    }


    mostrarMensagem(

        "A tela está pronta. A alteração real da senha será conectada ao Apps Script na próxima etapa.",

        "info"

    );


    limparCampo("senhaAtual");

    limparCampo("novaSenha");

    limparCampo("confirmarNovaSenha");

}


/* =====================================================
   INFORMAÇÕES DO SISTEMA
===================================================== */

async function carregarInformacoesSistema(){

    atualizarNomeSistema();

    atualizarUltimoBackup(
        obterUltimoBackup()
    );


    if(typeof listarTags !== "function"){

        marcarBancoIndisponivel();

        return;

    }


    try{

        const resposta =
            await listarTags();

        const tags =
            extrairLista(resposta);


        const livres =
            tags.filter(
                tag =>
                    normalizarStatus(tag.status) ===
                    "LIVRE"
            ).length;


        const ativadas =
            tags.filter(
                tag =>
                    [
                        "ATIVA",
                        "ATIVADA",
                        "VINCULADA"
                    ].includes(
                        normalizarStatus(
                            tag.status
                        )
                    )
            ).length;


        const bloqueadas =
            tags.filter(
                tag =>
                    normalizarStatus(tag.status) ===
                    "BLOQUEADA"
            ).length;


        definirTexto(
            "infoTotalTags",
            tags.length
        );

        definirTexto(
            "infoTagsLivres",
            livres
        );

        definirTexto(
            "infoTagsAtivadas",
            ativadas
        );

        definirTexto(
            "infoTagsBloqueadas",
            bloqueadas
        );


        const petsVinculados =
            tags.filter(
                tag =>
                    tag.pet ||
                    tag.petId ||
                    tag.nomePet
            ).length;


        definirTexto(
            "infoTotalPets",
            petsVinculados
        );


        definirTexto(
            "infoBanco",
            "Conectado"
        );


        const infoBanco =
            document.getElementById(
                "infoBanco"
            );

        infoBanco?.classList.remove(
            "text-danger"
        );

        infoBanco?.classList.add(
            "text-success"
        );

    }catch(erro){

        console.error(
            "Erro ao carregar informações:",
            erro
        );

        marcarBancoIndisponivel();

    }

}


function atualizarNomeSistema(){

    const nomeSistema =
        obterValor("nomeSistema") ||
        "PET NFC";

    definirTexto(
        "infoNomeSistema",
        nomeSistema
    );

}


/* =====================================================
   TESTAR CONEXÃO
===================================================== */

async function testarConexao(){

    const botao =
        document.getElementById(
            "btnTestarConexao"
        );

    alterarEstadoBotao(
        botao,
        true,
        "Testando..."
    );


    if(typeof listarTags !== "function"){

        alterarEstadoBotao(
            botao,
            false
        );

        mostrarMensagem(
            "A função listarTags() não foi encontrada.",
            "danger"
        );

        return;

    }


    try{

        await listarTags();

        definirTexto(
            "infoBanco",
            "Conectado"
        );

        mostrarMensagem(
            "Conexão realizada com sucesso.",
            "success"
        );

    }catch(erro){

        console.error(erro);

        definirTexto(
            "infoBanco",
            "Sem conexão"
        );

        mostrarMensagem(
            "Não foi possível conectar ao sistema.",
            "danger"
        );

    }finally{

        alterarEstadoBotao(
            botao,
            false
        );

    }

}


/* =====================================================
   MANUTENÇÃO
===================================================== */

function limparTagsTeste(){

    mostrarMensagem(

        "O botão está preparado. A exclusão real das TAGs será conectada ao Apps Script na próxima etapa.",

        "info"

    );

}


function limparRegistros(){

    mostrarMensagem(

        "O botão está preparado. A limpeza real dos registros será conectada ao Apps Script na próxima etapa.",

        "info"

    );

}


/* =====================================================
   CONFIRMAÇÃO
===================================================== */

function abrirConfirmacao(
    titulo,
    texto,
    acao
){

    definirTexto(
        "tituloModalConfirmacao",
        titulo
    );

    definirTexto(
        "textoModalConfirmacao",
        texto
    );

    acaoConfirmacao = acao;


    if(modalConfirmacao){

        modalConfirmacao.show();

    }else{

        const confirmou =
            window.confirm(texto);

        if(confirmou){

            acao();

        }

    }

}


function executarAcaoConfirmada(){

    if(
        typeof acaoConfirmacao ===
        "function"
    ){

        acaoConfirmacao();

    }

    acaoConfirmacao = null;

    modalConfirmacao?.hide();

}


/* =====================================================
   MENSAGENS
===================================================== */

function mostrarMensagem(
    texto,
    tipo = "info"
){

    const caixa =
        document.getElementById(
            "mensagemConfiguracoes"
        );

    if(!caixa){

        alert(texto);

        return;

    }

    caixa.className =
        `alert alert-${tipo}`;

    caixa.textContent =
        texto;

    caixa.classList.remove(
        "d-none"
    );

    caixa.scrollIntoView({

        behavior: "smooth",

        block: "center"

    });


    window.clearTimeout(
        mostrarMensagem.timeout
    );


    mostrarMensagem.timeout =
        window.setTimeout(
            function(){

                caixa.classList.add(
                    "d-none"
                );

            },
            5000
        );

}


/* =====================================================
   FUNÇÕES AUXILIARES
===================================================== */

function obterValor(id){

    return document
        .getElementById(id)
        ?.value
        ?.trim() || "";

}


function obterNumero(
    id,
    valorPadrao = 0
){

    const valor =
        Number(
            document
                .getElementById(id)
                ?.value
        );

    return Number.isFinite(valor)
        ? valor
        : valorPadrao;

}


function obterMarcado(id){

    return Boolean(
        document
            .getElementById(id)
            ?.checked
    );

}


function definirTexto(
    id,
    valor
){

    const elemento =
        document.getElementById(id);

    if(elemento){

        elemento.textContent =
            valor ?? "-";

    }

}


function limparCampo(id){

    const campo =
        document.getElementById(id);

    if(campo){

        campo.value = "";

    }

}


function abrirAbaCampo(
    idAba,
    idCampo
){

    const botaoAba =
        document.getElementById(idAba);

    if(
        botaoAba &&
        typeof bootstrap !== "undefined"
    ){

        const aba =
            bootstrap.Tab.getOrCreateInstance(
                botaoAba
            );

        aba.show();

    }


    window.setTimeout(
        function(){

            document
                .getElementById(idCampo)
                ?.focus();

        },
        250
    );

}


function copiarObjeto(objeto){

    return JSON.parse(
        JSON.stringify(objeto)
    );

}


function mesclarObjetos(
    destino,
    origem
){

    if(
        !origem ||
        typeof origem !== "object"
    ){

        return destino;

    }


    Object.keys(origem).forEach(
        function(chave){

            const valorOrigem =
                origem[chave];

            const valorDestino =
                destino[chave];


            if(
                valorOrigem &&
                typeof valorOrigem === "object" &&
                !Array.isArray(valorOrigem) &&
                valorDestino &&
                typeof valorDestino === "object" &&
                !Array.isArray(valorDestino)
            ){

                destino[chave] =
                    mesclarObjetos(
                        valorDestino,
                        valorOrigem
                    );

            }else{

                destino[chave] =
                    valorOrigem;

            }

        }
    );

    return destino;

}


function extrairLista(resposta){

    if(Array.isArray(resposta)){

        return resposta;

    }

    if(
        Array.isArray(resposta?.dados)
    ){

        return resposta.dados;

    }

    if(
        Array.isArray(resposta?.tags)
    ){

        return resposta.tags;

    }

    if(
        Array.isArray(resposta?.resultado)
    ){

        return resposta.resultado;

    }

    return [];

}


function normalizarStatus(status){

    return String(status || "")
        .trim()
        .toUpperCase();

}


function marcarBancoIndisponivel(){

    definirTexto(
        "infoBanco",
        "Indisponível"
    );

    const infoBanco =
        document.getElementById(
            "infoBanco"
        );

    infoBanco?.classList.remove(
        "text-success"
    );

    infoBanco?.classList.add(
        "text-danger"
    );

}


function obterUltimoBackup(){

    try{

        const dados =
            JSON.parse(
                localStorage.getItem(
                    CHAVE_CONFIGURACOES
                )
            );

        return dados
            ?.sistema
            ?.ultimoBackup || "";

    }catch(erro){

        return "";

    }

}


function atualizarUltimoBackup(data){

    if(!data){

        definirTexto(
            "infoUltimoBackup",
            "Nunca realizado"
        );

        return;

    }

    const dataFormatada =
        new Date(data);

    if(
        Number.isNaN(
            dataFormatada.getTime()
        )
    ){

        definirTexto(
            "infoUltimoBackup",
            data
        );

        return;

    }

    definirTexto(

        "infoUltimoBackup",

        dataFormatada.toLocaleString(
            "pt-BR"
        )

    );

}


function alterarEstadoBotao(
    botao,
    carregando,
    textoCarregando = "Carregando..."
){

    if(!botao){

        return;

    }

    if(carregando){

        botao.dataset.textoOriginal =
            botao.innerHTML;

        botao.disabled = true;

        botao.innerHTML =
            `<span class="spinner-border spinner-border-sm me-2"></span>${textoCarregando}`;

    }else{

        botao.disabled = false;

        if(botao.dataset.textoOriginal){

            botao.innerHTML =
                botao.dataset.textoOriginal;

        }

    }

}
