import { fetchPokemonById } from "./app.js";

const typesContainer = document.querySelector('.addTypesToContainer');
const topAppBar = new MDCTopAppBar(document.querySelector('.mdc-top-app-bar'));
const drawer = new MDCDrawer(document.querySelector('.mdc-drawer'));
const typeCard = document.querySelector('.typeCard');
const pokemonContainer = document.querySelector('.sheet main');

let typeID = 0;
let pokemonID = 0;

document.querySelector('#hamburger-menu').addEventListener('click', () => {
    drawer.open = true;
});

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
    "steel": "#B7B7CE",
    "unknown": "#68A090",
    "stellar": "#FFD700",
};

function closeSheet() {
    document.querySelector('.sheet').classList.add('sheet-out-of-view');
    history.pushState({}, "", location.pathname);
    document.body.classList.remove('stop-scrolling');
}

window.addEventListener("popstate", function (event) {
    closeSheet();
});

function sheetview() {
    const content = document.querySelectorAll('.card');
    const closebtn = document.querySelector('.sheet .mdc-top-app-bar__navigation-icon');
    history.pushState({}, "", location.pathname);

    content.forEach(element => {
        element.addEventListener('click', () => {
            pokemonID = element.getAttribute('data-id');
            const url = new URL(location);

            url.searchParams.set('pokemonID', pokemonID);
            history.pushState({}, "", url);

            fetchPokemonById();

            document.body.classList.add('stop-scrolling')

            document.querySelector('.sheet').classList.remove('sheet-out-of-view');
        });
    });

    closebtn.addEventListener('click', () => {
        closeSheet();
    });
}

function getAllPokemonTypes() {
    fetch('https://pokeapi.co/api/v2/type')
        .then(response => response.json())
        .then(data => {
            const types = data.results;

            types.forEach(type => {
                const typeName = type.name;
                const name = typeName.charAt(0).toUpperCase() + typeName.slice(1);
                const typeId = type.url.split('/')[6];
                const div = document.createElement('div');
                div.className = 'type-card w-25';
                div.innerHTML = `
                <div class="typeCard bg-[${pokemontypeBackground[typeName]}] text-white mdc-card mdc-card--outlined" data-id="${typeId}">
                    <div class="flex justify-center flex-col">
                        <h1 class="text-center py-2">${name}</h1>
                        </div>
                </div>
          `;
                typesContainer.appendChild(div);
            });

            const typeCards = document.querySelectorAll('.typeCard');
            typeCards.forEach(typeCard => {
                typeCard.addEventListener('click', () => {
                    const url = new URL(location);
                    typeID = typeCard.getAttribute('data-id');
                    url.searchParams.set('typeID', typeID);
                    history.pushState({}, "", url);

                    fetchPokemonsByType();
                });
            });
        });

}

function fetchPokemonsByType() {
    document.querySelector('#go-back').style.display = 'block';
    document.querySelector('.addTypesToContainer').innerHTML = '';
    const urlParams = new URLSearchParams(window.location.search);
    let typeID = urlParams.get('typeID');

    fetch(`https://pokeapi.co/api/v2/type/${typeID}`)
        .then(response => response.json())
        .then(data => {
            const pokemons = data.pokemon;

            pokemons.forEach(pokemon => {
                const pokemonName = pokemon.pokemon.name;
                const name = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
                pokemonID = pokemon.pokemon.url.split('/')[6];
                const pokemonImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonID}.png`;

                const div = document.createElement('div');
                div.className = 'pokemon-card w-25';
                div.innerHTML = `
                <div class="card mdc-card mdc-card--outlined" data-id=${pokemonID}>
                    <div class="flex justify-center flex-col">
                        <img src="${pokemonImage}" alt="${name}" class="w-32 h-32 mx-auto">
                        <h1 class="text-center py-2">${name}</h1>
                        </div>
                </div>
        `;
                typesContainer.appendChild(div);

                sheetview();
            });
        })
}

document.querySelector('#go-back').addEventListener('click', () => {
    document.querySelector('#go-back').style.display = 'none';
    document.querySelector('.addTypesToContainer').innerHTML = '';
    getAllPokemonTypes();
});

document.addEventListener('DOMContentLoaded', function () {
    getAllPokemonTypes();
    sheetview();
});