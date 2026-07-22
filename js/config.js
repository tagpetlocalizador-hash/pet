/*************************************************
 * PET NFC
 * config.js
 * Versão 1.0.0
 *************************************************/

/*
|--------------------------------------------------------------------------
| CONFIGURAÇÕES DO SISTEMA
|--------------------------------------------------------------------------
|
| Altere apenas estes valores quando necessário.
|
*/

const CONFIG = {

    API_URL: "https://script.google.com/macros/s/AKfycbyUaF8EHlWZcgL0T3alf438MPNpeHgPm_dLqSrwiUGvIj4ggDrDcr3vSOCflCg8aVvQ/exec",

    APP_NAME: "PET NFC",

    FOTO_PADRAO: "img/pet-default.png",

    TIMEOUT: 15000

};

/*
|--------------------------------------------------------------------------
| STATUS
|--------------------------------------------------------------------------
*/

const STATUS = {

    LIVRE: "LIVRE",

    ATIVO: "ATIVO",

    BLOQUEADO: "BLOQUEADO"

};


/*
|--------------------------------------------------------------------------
| AÇÕES DA API
|--------------------------------------------------------------------------
*/

const ACTION = {

    // PET

    BUSCAR_PET: "buscarPet",

    CADASTRAR_PET: "cadastrarPet",

    EDITAR_PET: "editarPet",

    ATUALIZAR_FOTO: "atualizarFoto",

    LOGIN_TUTOR: "loginTutor",

    LOCALIZACAO: "localizacao",

    // ADMIN

    GERAR_TAG: "gerarTag",

    GERAR_LOTE: "gerarLote",

    LISTAR_TAGS: "listarTags",

    BUSCAR_TAG: "buscarTag",

    BLOQUEAR_TAG: "bloquearTag",

    REATIVAR_TAG: "reativarTag",

    RESETAR_TAG: "resetarTag",

    EXCLUIR_TAG: "excluirTag",

    ESTATISTICAS: "estatisticas"

};


/*
|--------------------------------------------------------------------------
| PARÂMETROS DA URL
|--------------------------------------------------------------------------
*/

const PARAMS = new URLSearchParams(window.location.search);


/*
|--------------------------------------------------------------------------
| TOKEN DA TAG
|--------------------------------------------------------------------------
*/

const TOKEN = PARAMS.get("token") || "";
