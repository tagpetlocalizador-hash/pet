/*************************************************
 * PET NFC ADMIN
 * api.js
 *************************************************/

async function apiGet(action, params = {}) {

    const url = new URL(CONFIG.API_URL);

    url.searchParams.set("action", action);

    Object.keys(params).forEach(chave => {

        url.searchParams.set(chave, params[chave]);

    });

    const resposta = await fetch(url);

    return await resposta.json();

}

async function apiPost(obj) {

    const resposta = await fetch(CONFIG.API_URL, {

        method: "POST",

        headers: {

            "Content-Type":"application/json"

        },

        body: JSON.stringify(obj)

    });

    return await resposta.json();

}
