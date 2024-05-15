const typesContainer = document.querySelector('.addTypesToContainer');
const topAppBar = new MDCTopAppBar(document.querySelector('.mdc-top-app-bar'));

let pokemonType = "";
let pokemontypeBackground = {
    "fire": "#EE8130",
    "water": "#6390F0",
    "grass": "#7AC74C",
    "electric": "#F7D02C",
    "psychic": "#F95587",
    "ice": "#96D9D6",
    "dragon": "#6F35FC",
    "dark": "#705746",
    "fairy": "#D685AD",
    "normal": "#A8A77A",
    "fighting": "#C22E28",
    "flying": "#A98FF3",
    "poison": "#A33EA1",
    "ground": "#E2BF65",
    "rock": "#B6A136",
    "bug": "#A6B91A",
    "ghost": "#735797",
    "steel": "#B7B7CE"
};

function getAllPokemonTypes() {
    console.log('fetching types')
    fetch('https://pokeapi.co/api/v2/type')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const types = data.results;

            types.forEach(type => {
                const typeName = type.name;
                const typeId = type.url.split('/')[6];
                const div = document.createElement('div');
                div.className = 'type-card w-25';
                div.innerHTML = `
                <div class="card bg-[${pokemontypeBackground[typeName]}] text-white mdc-card mdc-card--outlined" data-id="${typeId}">
                    <div class="flex justify-center flex-col">
                        <h1 class="text-center py-2">${typeName}</h1>
                        </div>
                </div>
          `;
                typesContainer.appendChild(div);
            });
        });

}

document.addEventListener('DOMContentLoaded', function () {
    getAllPokemonTypes();
});