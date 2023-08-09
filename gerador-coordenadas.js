import { api_key } from "./config.js";

const entradaEnderecos = document.querySelector("#entrada-enderecos");
const saidaCoordenadas = document.querySelector("#saida-coordenadas");
const botao = document.querySelector("#botao");

let coordenadas = [];

function obterCoordenadas() {
    let enderecos = entradaEnderecos.value;
    let latitude = "";
    let longitude = "";
    let detalhes = "";
    enderecos = enderecos.split('\n');

    return Promise.all(enderecos.map(async endereco => {
        await new Promise(resolve => fetch(`http://api.positionstack.com/v1/forward?access_key=${api_key}&query=${endereco}`)
            .then(response => response.json())
            .then(data => {
                if (data.data[0]) {
                    latitude = data.data[0].latitude;
                    longitude = data.data[0].longitude;
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
