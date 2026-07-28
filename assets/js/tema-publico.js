/*************************************************
 * PET NFC
 * tema-publico.js
 * Aplica as configurações de aparência
 *************************************************/


async function carregarTemaPublico(){

    try{

        let resposta;


if(
    typeof API !== "undefined" &&
    typeof API.consultar === "function"
){

    resposta =
        await API.consultar(
            "buscarConfiguracoes"
        );

}else if(
    typeof apiGet === "function"
){

    resposta =
        await apiGet(
            "buscarConfiguracoes"
        );

}else{

    console.warn(
        "API de configurações não encontrada."
    );

    return;

}

        if(
            !resposta ||
            !resposta.sucesso ||
            !resposta.configuracoes
        ){

            console.warn(
                "Não foi possível carregar o tema.",
                resposta
            );

            return;

        }


        const configuracoes =
            resposta.configuracoes;

        const aparencia =
            configuracoes.aparencia || {};

        const empresa =
            configuracoes.empresa || {};


        aplicarTemaNasPaginas(
            aparencia,
            empresa
        );


    }catch(erro){

        console.error(
            "Erro ao carregar tema público:",
            erro
        );

    }

}



function aplicarTemaNasPaginas(
    aparencia,
    empresa
){

    const raiz =
        document.documentElement;


    const corPetPrincipal =
        aparencia.corPetPrincipal ||
        "#2E7D32";

    const corPetSecundaria =
        aparencia.corPetSecundaria ||
        "#43A047";

    const corTutorPrincipal =
        aparencia.usarMesmoTema
            ? corPetPrincipal
            : (
                aparencia.corTutorPrincipal ||
                "#2E7D32"
            );

    const corTutorSecundaria =
        aparencia.usarMesmoTema
            ? corPetSecundaria
            : (
                aparencia.corTutorSecundaria ||
                "#43A047"
            );

    const corFundoPet =
        aparencia.corFundoPet ||
        "#F3F8F4";

    const corFundoTutor =
        aparencia.usarMesmoTema
            ? corFundoPet
            : (
                aparencia.corFundoTutor ||
                "#F5F7F9"
            );

    const corBotaoLigar =
        aparencia.corBotaoLigar ||
        "#1976D2";

    const corBotaoLocalizacao =
        aparencia.corBotaoLocalizacao ||
        "#F9A825";


    raiz.style.setProperty(
        "--cor-pet-principal",
        corPetPrincipal
    );

    raiz.style.setProperty(
        "--cor-pet-secundaria",
        corPetSecundaria
    );

    raiz.style.setProperty(
        "--cor-tutor-principal",
        corTutorPrincipal
    );

    raiz.style.setProperty(
        "--cor-tutor-secundaria",
        corTutorSecundaria
    );

    raiz.style.setProperty(
        "--cor-fundo-pet",
        corFundoPet
    );

    raiz.style.setProperty(
        "--cor-fundo-tutor",
        corFundoTutor
    );

    raiz.style.setProperty(
        "--cor-botao-ligar",
        corBotaoLigar
    );

    raiz.style.setProperty(
        "--cor-botao-localizacao",
        corBotaoLocalizacao
    );


    const paginaPet =
        document.querySelector(
            ".pagina-pet"
        );

    const paginaTutor =
        document.querySelector(
            ".pagina-inicial-tutor, " +
            ".pagina-login, " +
            ".pagina-painel"
        );


    if(paginaPet){

        aplicarTemaPet(
            aparencia,
            corPetPrincipal,
            corPetSecundaria,
            corFundoPet,
            corBotaoLigar,
            corBotaoLocalizacao
        );

    }


    if(paginaTutor){

        aplicarTemaTutor(
            aparencia,
            corTutorPrincipal,
            corTutorSecundaria,
            corFundoTutor
        );

    }


    atualizarLogoERodape(
        aparencia,
        empresa,
        Boolean(paginaPet),
        Boolean(paginaTutor)
    );

}



function aplicarTemaPet(
    aparencia,
    principal,
    secundaria,
    fundo,
    corLigar,
    corLocalizacao
){

    document.body.style.background =
        fundo;


    const pagina =
        document.querySelector(
            ".pagina-pet"
        );

    if(pagina){

        pagina.style.background =
            fundo;

    }


    aplicarEstiloElementos(
        [
            ".icone-marca",
            ".icone-titulo",
            ".faixa-superior",
            ".botao-principal",
            ".icone-sucesso",
            ".selo-identificado"
        ],
        "background",
        principal
    );


    aplicarEstiloElementos(
        [
            ".marca strong",
            ".titulo-secao h1",
            ".perfil-identidade h1",
            ".texto-ajuda strong",
            ".campo-grupo label",
            ".etiqueta-pet",
            ".tutor-icone",
            ".icone-ajuda",
            ".spinner-pet"
        ],
        "color",
        principal
    );


    aplicarEstiloElementos(
        [
            ".card-pet",
            ".perfil-foto-moldura",
            ".moldura-foto"
        ],
        "border-color",
        secundaria
    );


    aplicarEstiloElementos(
        [
            ".etiqueta-pet",
            ".etiqueta-sucesso"
        ],
        "background",
        adicionarTransparencia(
            secundaria,
            "20"
        )
    );


    aplicarEstiloElementos(
        [
            ".botao-ligar"
        ],
        "background",
        corLigar
    );


    aplicarEstiloElementos(
        [
            ".botao-localizacao"
        ],
        "background",
        corLocalizacao
    );


    const metaTema =
        document.querySelector(
            'meta[name="theme-color"]'
        );

    if(metaTema){

        metaTema.setAttribute(
            "content",
            principal
        );

    }

}



function aplicarTemaTutor(
    aparencia,
    principal,
    secundaria,
    fundo
){

    document.body.style.background =
        fundo;


    aplicarEstiloElementos(
        [
            ".pagina-inicial-tutor",
            ".pagina-login",
            ".pagina-painel",
            ".tela-carregamento"
        ],
        "background",
        fundo
    );


    aplicarEstiloElementos(
        [
            ".icone-inicial-tutor",
            ".icone-login",
            ".botao-principal-tutor",
            ".botao-entrar",
            ".botao-salvar-painel",
            ".icone-apresentacao-painel",
            ".icone-titulo-card",
            ".botao-confirmar-modal"
        ],
        "background",
        principal
    );


    aplicarEstiloElementos(
        [
            ".conteudo-inicial-tutor h1",
            ".titulo-login h1",
            ".apresentacao-painel h1",
            ".cabecalho-card-painel h2",
            ".campo-grupo label",
            ".etiqueta-inicial-tutor",
            ".etiqueta-login",
            ".etiqueta-painel",
            ".link-recuperar",
            ".link-voltar-inicial",
            ".link-voltar-painel"
        ],
        "color",
        principal
    );


    aplicarEstiloElementos(
        [
            ".card-inicial-tutor",
            ".card-login",
            ".card-painel",
            ".campo-com-icone",
            ".botao-secundario-tutor"
        ],
        "border-color",
        secundaria
    );


    aplicarEstiloElementos(
        [
            ".etiqueta-inicial-tutor",
            ".etiqueta-login",
            ".etiqueta-painel",
            ".item-resumo-painel > span"
        ],
        "background",
        adicionarTransparencia(
            secundaria,
            "20"
        )
    );


    const metaTema =
        document.querySelector(
            'meta[name="theme-color"]'
        );

    if(metaTema){

        metaTema.setAttribute(
            "content",
            principal
        );

    }

}



function atualizarLogoERodape(
    aparencia,
    empresa,
    paginaPet,
    paginaTutor
){

    const mostrarLogo = paginaPet
        ? aparencia.mostrarLogoPet !== false
        : aparencia.mostrarLogoTutor !== false;


    document
        .querySelectorAll(
            ".logo-inicial-tutor, " +
            ".logo-login, " +
            ".logo-painel, " +
            ".cabecalho img"
        )
        .forEach(function(logo){

            logo.style.display =
                mostrarLogo
                    ? ""
                    : "none";

        });


    const mostrarRodape =
        aparencia.mostrarRodapePublico !==
        false;


    document
        .querySelectorAll(
            ".rodape, " +
            ".rodape-login, " +
            ".rodape-painel"
        )
        .forEach(function(rodape){

            rodape.style.display =
                mostrarRodape
                    ? ""
                    : "none";

        });

}



function aplicarEstiloElementos(
    seletores,
    propriedade,
    valor
){

    seletores.forEach(
        function(seletor){

            document
                .querySelectorAll(seletor)
                .forEach(
                    function(elemento){

                        elemento.style[
                            propriedade
                        ] = valor;

                    }
                );

        }
    );

}



function adicionarTransparencia(
    cor,
    transparencia
){

    if(
        typeof cor !== "string" ||
        !/^#[0-9a-f]{6}$/i.test(cor)
    ){

        return cor;

    }

    return cor + transparencia;

}


window.carregarTemaPublico =
    carregarTemaPublico;


if(document.readyState === "loading"){

    document.addEventListener(
        "DOMContentLoaded",
        carregarTemaPublico
    );

}else{

    carregarTemaPublico();

}
