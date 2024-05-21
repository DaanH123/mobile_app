import { fetchPokemonById } from "./app.js";
const container = document.querySelector('.addToContainer');
const topAppBar = new MDCTopAppBar(document.querySelector('.mdc-top-app-bar'));
const drawer = new MDCDrawer(document.querySelector('.mdc-drawer'));

document.querySelector('#hamburger-menu').addEventListener('click', () => {
    drawer.open = true;
});

function showFavoritePokemons() {
    const favorites = JSON.parse(localStorage.getItem('favoritePokemons')) || [];
    console.log(favorites);
    container.innerHTML = '';

    favorites.forEach(favorite => {
        if (favorite) {
            const card = document.createElement('div');
            card.classList.add('card');
    
            const pokemonID = favorite.id;
            const pokemonImage = favorite.sprites.front_default;
    
            card.innerHTML = `
            <div class="card mdc-card mdc-card--outlined" data-id="${pokemonID}">
                <div class="flex justify-center flex-col">
                    <img src="${pokemonImage}" alt="${favorite.name}" class="w-32 h-32 mx-auto"/>
                    <h1 class="text-center py-2">${pokemonID}. ${favorite.name}</h1>
                </div>
            </div>
            `;
            container.appendChild(card);
        }
    });
}

document.getElementById('clearLocalStorage').addEventListener('click', function() {
    localStorage.removeItem('favoritePokemons');
    window.location.reload();
});

showFavoritePokemons();