let graficoStatus = null;

//==================================================
// INICIAR
//==================================================

document.addEventListener("DOMContentLoaded", async () => {

    await carregarEstatisticas();

});

//==================================================
// CARREGAR
//==================================================

async function carregarEstatisticas() {

    try {

        const resposta =
            await buscarEstatisticas();

        if (!resposta.sucesso) {

            throw new Error(
                resposta.mensagem
            );

        }

        preencherTela(
            resposta.dados
        );

    }

    catch (erro) {

        console.error(erro);

        alert(
            erro.message
        );

    }

}

//==================================================
// PREENCHER TELA
//==================================================

function preencherTela(dados) {

    document.getElementById(
        "totalTags"
    ).innerText =
        dados.total_tags;

    document.getElementById(
        "petsAtivos"
    ).innerText =
        dados.pets_ativos;

    document.getElementById(
        "tagsLivres"
    ).innerText =
        dados.tags_livres;

    document.getElementById(
        "petsBloqueados"
    ).innerText =
        dados.bloqueados;


    //--------------------------------------------------
    // Último pet
    //--------------------------------------------------

    if (dados.ultimo_pet) {

        document.getElementById(
            "ultimoNome"
        ).innerText =
            dados.ultimo_pet.nome || "-";

        document.getElementById(
            "ultimoTutor"
        ).innerText =
            dados.ultimo_pet.tutor || "-";

        document.getElementById(
            "ultimaData"
        ).innerText =
            dados.ultimo_pet.data || "-";

    }


    //--------------------------------------------------
    // Última localização
    //--------------------------------------------------

    if (dados.ultima_localizacao) {

        document.getElementById(
            "petLocalizacao"
        ).innerText =
            dados.ultima_localizacao.pet || "-";

        document.getElementById(
            "dataLocalizacao"
        ).innerText =
            dados.ultima_localizacao.data || "-";

        const botao =
            document.getElementById(
                "btnMaps"
            );

        if (
            dados.ultima_localizacao.maps
        ) {

            botao.href =
                dados.ultima_localizacao.maps;

            botao.classList.remove(
                "disabled"
            );

        }

    }

    desenharGrafico(dados);

}

//==================================================
// GRÁFICO
//==================================================

function desenharGrafico(dados) {

    if (graficoStatus) {

        graficoStatus.destroy();

    }

    const ctx =
        document
        .getElementById(
            "graficoStatus"
        );

    graficoStatus =
        new Chart(ctx, {

            type: "pie",

            data: {

                labels: [

                    "Pets Ativos",

                    "TAGs Livres",

                    "Bloqueados"

                ],

                datasets: [

                    {

                        data: [

                            dados.pets_ativos,

                            dados.tags_livres,

                            dados.bloqueados

                        ]

                    }

                ]

            },

            options: {

                responsive: true,

                plugins: {

                    legend: {

                        position: "bottom"

                    }

                }

            }

        });

}
