const entradaEnderecos = document.getElementById("entrada-enderecos");
const coordenadasDiv = document.getElementById("div-coordenadas");
const botao = document.getElementById("botao");
const api_key = "pk.1c7ad57dab8a678fdc08f03e7a149bcf";

let coordenadas = [];

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function obterCoordenadas() {
    let enderecos = entradaEnderecos.value;
    let latitude = "";
    let longitude = "";
    let detalhes = "";
    enderecos = enderecos.split('\n');

    return Promise.all(enderecos.map(async (endereco, index) => {
        await delay(index * 500);
        await new Promise(resolve => fetch(`https://us1.locationiq.com/v1/search?key=${api_key}&q=${endereco}&format=json&`)
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
    coordenadas = [];
    await obterCoordenadas();
    coordenadasDiv.innerHTML = '';

    coordenadas.forEach(coordenada => {
        let coordenadaElement = document.createElement("span");
        if (coordenada[0] == "erro" || coordenada[1] == "erro") {
            coordenadaElement.textContent = `Não foi possível obter a coordenada do endereço: ${coordenada[2]}`;
            coordenadaElement.classList.add("inactivate");
        }
        else {
            coordenadaElement.innerHTML = `${coordenada[0]} ${coordenada[1]}<span class="inactivate"> ${coordenada[2]}</span>`;
        }
        coordenadasDiv.appendChild(coordenadaElement);
    });
}
