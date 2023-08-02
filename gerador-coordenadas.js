const entradaEnderecos = document.querySelector("#entrada-enderecos");
const saidaCoordenadas = document.querySelector("#saida-coordenadas");
const botao = document.querySelector("#botao");

let coordenadas = [];

function obterCoordenadas() {
    let enderecos = entradaEnderecos.value;
    let latitude = "";
    let longitude = "";
    enderecos = enderecos.split('\n');

    return Promise.all(enderecos.map(async endereco => {
        await new Promise(resolve => fetch(`https://geocode.maps.co/search?q=${endereco}`)
            .then(response => response.json())
            .then(data => {
                if (data[0]) {
                    latitude = data[0].lat;
                    longitude = data[0].lon;
                }
                else {
                    latitude = "erro";
                    longitude = "erro";
                }
                detalhes = [latitude, longitude, endereco]
                coordenadas.push(detalhes);
            })
            .then(response => resolve(response))
            .catch(error => console.error(error))
        )
    }))
}

async function preencherCoordenadas() {
    saidaCoordenadas.value = "";
    coordenadas = [];
    await obterCoordenadas();
    console.log(coordenadas);

    coordenadas.forEach(coordenada => {
        if (coordenada[0] == "erro" || coordenada[1] == "erro") {
            saidaCoordenadas.value += `Não foi possível obter a coordenada do endereço: ${coordenada[2]}\n`;
        }
        else {
            saidaCoordenadas.value += `${coordenada[0]} ${coordenada[1]}\n`;
        }
    });
}

botao.addEventListener("click", () => preencherCoordenadas());
