// Alle variabelen die ik nodig heb
const container = document.querySelector('.addToContainer');
const topAppBar = new MDCTopAppBar(document.querySelector('.mdc-top-app-bar'));
const drawer = new MDCDrawer(document.querySelector('.mdc-drawer'));
const searchInput = document.querySelector('#my-search');
const searchContainer = document.querySelector('.mdc-text-field');
const pokemonContainer = document.querySelector('.sheet main');
const typesContainer = document.querySelector('.addTypesToContainer');
const title = document.querySelector('.mdc-top-app-bar__title');
const nextButton = document.querySelector('.next');
const prevButton = document.querySelector('.prev');

const pagination = document.querySelector('.pagination');
const paginationP = document.createElement('p');
const searchButton = document.querySelector('#searchButton');
const seachPokemonButton = document.querySelector('#search-Button');
const pokemonsPerPage = 20;
const main = document.querySelector('#main');

let currentPage = 1;
let pokemonID;
let pokemonName;
let typeID = 0;
let goBackButton = document.querySelector('#go-back');
let addTypesContainer = document.querySelector('.addTypesToContainer');
let clearLocalStorageButton = document.getElementById('clearLocalStorage');
let favoriteButton = document.querySelector('.favoritePokemonBtn');
let eventListenerAdded = false;

// Object met alle kleuren voor de verschillende types
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

// Event listener voor de hamburger menu
document.querySelector('#hamburger-menu').addEventListener('click', () => {
    drawer.open = true;
});

window.addEventListener("popstate", function (event) {
    closeSheet();
});

// Functie om de search button te laten zien als ik op het zoek incoontje klik
function searchButtonVisible() {
    searchContainer.classList.toggle('hidden');
}


// Functie om de sheet te sluiten
function closeSheet() {
    document.querySelector('.sheet').classList.add('sheet-out-of-view');
    history.pushState({}, "", location.pathname);
    document.body.classList.remove('stop-scrolling');

    if (window.location.href.endsWith('favorites.html')) {
        window.location.reload();
    }
}

function sheetview() {
    const content = document.querySelectorAll('.card');
    const closebtn = document.querySelector('.sheet .mdc-top-app-bar__navigation-icon');
    history.pushState({}, "", location.pathname);

    content.forEach(element => {
        element.addEventListener('click', () => {
            if (eventListenerAdded) {
                return;
            }

            if (window.location.href.endsWith('types.html')) {
                goBackButton.style.display = 'none';
            }

            pokemonID = element.getAttribute('data-id');
            const url = new URL(location);

            url.searchParams.set('pokemonID', pokemonID);
            history.pushState({}, "", url);

            fetchPokemonById();

            document.querySelector('.sheet').classList.remove('sheet-out-of-view');

            let sheet = document.querySelector('.sheet');
            let main = document.querySelector('#main');

            main.style.height = (window.innerHeight + 100) + 'px';
            sheet.style.height = (main.offsetHeight + 50) + 'px';
            main.style.overflow = 'hidden';
            eventListenerAdded = true;
        });
    });

    closebtn.addEventListener('click', () => {
        if (window.location.href.endsWith('types.html')) {
            goBackButton.style.display = 'block';
        }
        closeSheet();
        eventListenerAdded = false;
    });
}

// Functie om de pokemons op te halen en op te slaan in de lokale opslag
function fetchPokemons() {
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=1000`)
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('pokemons', JSON.stringify(data.results));
            displayPokemons();
        });
}

function displayPokemons() {
    // Haal de opgeslagen pokemons uit de lokale opslag en parse het naar een JavaScript object
    const pokemons = JSON.parse(localStorage.getItem('pokemons'));

    // Bereken startindex voor huidige pagina. Trek 1 af van huidige pagina en vermenigvuldig met pokemons per pagina.
    const start = (currentPage - 1) * pokemonsPerPage;

    // Bereken de eindindex voor de huidige pagina
    const end = start + pokemonsPerPage;
    const currentPokemons = pokemons.slice(start, end);

    // Maak de container leeg
    container.innerHTML = '';

    // Loop door de pokemons heen en maak een div aan met de pokemon info
    currentPokemons.forEach(pokemon => {
        const pokemonID = pokemon.url.split('/')[6];
        const pokemonImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonID}.png`;
        pokemonName = pokemon.name;

        const div = document.createElement('div');
        div.className = 'pokecard w-25';
        div.innerHTML = `
        <div class="card mdc-card mdc-card--outlined" data-id="${pokemonID}">
            <div class="flex justify-center flex-col">
                <img src="${pokemonImage}" alt="${pokemonName}" class="w-32 h-32 mx-auto"/>
                <h1 class="text-center py-2">${pokemonID}. ${pokemonName}</h1>
            </div>
        </div>
        `;
        container.appendChild(div);

        sheetview();
    });
}

// Functie om de next en back buttons te handelen
function handleButtonClick(direction) {
    // Haal de opgeslagen pokemons uit de lokale opslag en parse het naar een JavaScript object
    const pokemons = JSON.parse(localStorage.getItem('pokemons'));
    // Bereken het aantal pagina's door de lengte van de pokemons te delen door de pokemons per pagina en afronden naar boven
    const maxPage = Math.ceil(pokemons.length / pokemonsPerPage);

    // Check of de direction next is en de huidige pagina kleiner is dan het aantal pagina's
    if (direction === 'next' && currentPage < maxPage) {
        currentPage++;
    } else if (direction === 'back' && currentPage > 1) {
        currentPage--;
    }

    // Update de pagination en display de pokemons
    updatePagination();
    displayPokemons();
}

// Fetch pokemon by ID
function fetchPokemonById() {
    // Get the id from the URL
    document.querySelector('.sheet main').innerHTML = '';
    const urlParams = new URLSearchParams(window.location.search);
    let pokemonId = urlParams.get('pokemonID');

    // Make the API call
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
        .then(response => response.json())
        .then(data => {
            const pokemon = data;

            // Haal alle info van de pokemon op
            const pokemonName = pokemon.name;
            const pokemonImage = pokemon.sprites.front_default;
            let pokemonID = pokemon.id;
            const abilities = pokemon.abilities;
            const typeName = pokemon.types[0].type.name;

            //Haal het id op en format het voor de externe image
            const external_pokemonid = formatPokemonID(pokemonID);

            //Maak een lege variabele aan om in de loop de info in te stoppen
            let pokemonType = "";
            let pokemonAbilities = "";
            let baseStats = '';


            let favoritePokemons = JSON.parse(localStorage.getItem('favoritePokemons')) || [];

            // Zet de initial kleur van de favorieten button
            if (favoritePokemons.find(pokemon => pokemon.id === pokemonID)) {
                favoriteButton.classList.add('red');
            } else {
                favoriteButton.classList.remove('red');
            }

            // Update de kleur van de favorieten button
            favoriteButton.addEventListener('click', function () {
                // Check of de pokemon al in de favorieten zit
                const foundPokemon = favoritePokemons.find(pokemon => pokemon.id === pokemonID);
                if (foundPokemon) {
                    // Verwijder uit favorites en ook soort van extra check om te voorkomen dat er dubbele pokemons in de array komen
                    favoritePokemons = favoritePokemons.filter(pokemon => pokemon.id !== pokemonID);
                } else {
                    // Voeg toe aan favorites
                    favoritePokemons.push({ id: pokemonID, name: pokemonName, sprites: { front_default: pokemonImage } });
                }
                localStorage.setItem('favoritePokemons', JSON.stringify(favoritePokemons));

                // Update button color
                if (foundPokemon) {
                    this.classList.remove('red');
                } else {
                    this.classList.add('red');
                }
            });

            pokemon.types.forEach(type => {
                //Loop door de types heen en sla de naam op in de pokemonType variabele
                pokemonType += type.type.name;
                if (pokemon.types.indexOf(type) !== pokemon.types.length - 1) {
                    pokemonType += ", ";
                }
            });

            //Loop door de abilities heen en sla de naam op in de pokemonAbilities variabele
            abilities.forEach((ability) => {
                pokemonAbilities += ability.ability.name;
                if (abilities.indexOf(ability) !== abilities.length - 1) {
                    pokemonAbilities += ", ";
                }
            });

            // Loop door de stats heen en maak een div aan met de stats en geef ze een kleur op basis van de base_stat
            pokemon.stats.forEach(stat => {
                let statClass = '';
                if (stat.base_stat <= 40 || stat.base_stat <= 50) {
                    statClass = "bg-red-500";
                } else if (stat.base_stat > 50 && stat.base_stat <= 64) {
                    statClass = "bg-yellow-500";
                } else if (stat.base_stat >= 65 && stat.base_stat <= 99) {
                    statClass = "bg-green-500";
                } else if (stat.base_stat >= 100) {
                    statClass = "bg-fuchsia-900";
                }
                baseStats += `<p class="${statClass} my-2 mx-1 p-3 rounded-xl">${stat.stat.name}: ${stat.base_stat}</p>`;
            });

            baseStats += '</div>';

            // Maak een div aan en vul deze met de data van de pokemon
            const div = document.createElement('div');
            div.innerHTML = `
            <div class="pokemon-card pt-20 text-white" data-id=${pokemonID}>
                <div class="block md:flex items-center">
                    <div class="px-4 md:flex items-center">
                        <h2 class="font-bold text-2xl uppercase text-[${pokemontypeBackground[typeName]}]">${pokemonID}. ${pokemonName}</h2>
                        <img class="w-28 highlighted-spot rounded-2xl p-4" src="${pokemonImage}" alt="${pokemonName}">
                            <div class="flex gap-3">
                                <img class="w-28 border-2 rounded-2xl border-blue-700" id="api_image" src="${pokemonImage}" alt="${pokemonName}">
                                <img class="w-28 border rounded-2xl border-black" id="external_image" src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/${external_pokemonid}.png" alt="">
                            </div>
                        </div>
                    <div class="px-4 space-y-4 pt-2">
                        <h3 class="font-bold text-lg pt-1">Type</h3>
                        <p class="text-lg mt-1">${pokemonType}</p>
                        <h3 class="font-bold text-lg">Abilities</h3>
                        <p class="text-lg mt-1">${pokemonAbilities}</p>
                    </div>
                    <div class="px-4 grid grid-cols-2 mt-3 mb-1">
                        <h3 class="font-bold text-lg">Base Stats</h3>
                        <p>${baseStats}</p>
                    </div>
                </div>
                <div class="flex justify-center gap-4 p-4">
                    <button class="prevPokeBtn mdc-button mdc-button--raised">
                        <span class="mdc-button__label">Back</span>
                    </button>
                    <button class="nextPokeBtn mdc-button mdc-button--raised">
                        <span class="mdc-button__label">Next</span>
                    </button>
                </div>
            </div>
        `;

            //Maak de vorige button onklikbaar als we op de eerste pagina zitten
            if (prevButton) {
                if (Number(pokemonID) === 1) {
                    prevButton.disabled = true;
                    prevButton.classList.add('opacity-50');
                } else {
                    prevButton.disabled = false;
                    prevButton.classList.remove('opacity-50');
                }
            }

            // Voeg de div toe aan de container
            pokemonContainer.appendChild(div);

            // Voeg event listeners toe aan de images
            const externalImage = document.getElementById('external_image');
            const apiImage = document.getElementById('api_image');
            const highlightedSpot = document.querySelector('.highlighted-spot');

            // Functie om de classes van de images te wisselen
            function swapClasses(element1, element2) {
                element1.className = 'w-28 border rounded-2xl border-black';
                element2.className = 'w-28 border-2 rounded-2xl border-blue-700';
            }

            // Swapped classes en zet de highlighted spot naar de external api image
            externalImage.addEventListener('click', function () {
                swapClasses(apiImage, externalImage);
                highlightedSpot.src = this.src;
            });

            // Swapped classes en zet de highlighted spot naar de api image
            apiImage.addEventListener('click', function () {
                swapClasses(externalImage, apiImage);
                highlightedSpot.src = this.src;
            });

            //Button voor de volgende pokemon maak eerst de pagina leeg daarna verhoog de pokemonID en fetch de pokemon opnieuw en update de url
            const nextPokeButton = document.querySelector('.nextPokeBtn');
            const prevPokeButton = document.querySelector('.prevPokeBtn');

            if (pokemonID <= 1) {
                prevPokeButton.disabled = true;
                prevPokeButton.classList.add('opacity-90');
            }

            if (nextPokeButton) {

                // Event listener voor de volgende pokemon button
                nextPokeButton.addEventListener('click', () => {

                    // Maak de pagina leeg en verhoog de pokemonID
                    document.querySelector('.sheet main').innerHTML = '';
                    pokemonID++;

                    // Update de url en fetch de pokemon opnieuw
                    const url = new URL(location);
                    url.searchParams.set('pokemonID', pokemonID);
                    history.pushState({}, "", url);

                    // Fetch de pokemon opnieuw
                    fetchPokemonById();
                });
            }

            //Button voor de vorige pokemon maak eerst de pagina leeg daarna verlaag de pokemonID en fetch de pokemon opnieuw en update de url
            if (prevPokeButton) {

                // Event listener voor de vorige pokemon button
                prevPokeButton.addEventListener('click', () => {

                    // Check of de pokemonID kleiner is dan 1
                    if (pokemonID <= 1) {
                        return;
                    }

                    // Maak de pagina leeg en verlaag de pokemonID
                    document.querySelector('.sheet main').innerHTML = '';
                    pokemonID--;

                    // Update de url en fetch de pokemon opnieuw
                    const url = new URL(location);
                    url.searchParams.set('pokemonID', pokemonID);
                    history.pushState({}, "", url);

                    // Fetch de pokemon opnieuw
                    fetchPokemonById();
                });
            }
            return data;
        });
}

function searchPokemonByName(query) {
    // Haal de opgeslagen pokemons uit de lokale opslag en parse het naar een JavaScript object
    const pokemons = JSON.parse(localStorage.getItem('pokemons'));
    document.querySelector('.addToContainer').innerHTML = '';
    query = query.toLowerCase();
    const searchResults = pokemons.filter(pokemon => pokemon.name.includes(query));

    searchResults.forEach(pokemon => {
        const pokemonID = pokemon.url.split('/')[6];
        const pokemonImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonID}.png`;

        const div = document.createElement('div');
        div.className = 'pokecard w-25';
        div.innerHTML = `
            <div class="card mdc-card mdc-card--outlined" data-id="${pokemonID}">
                <div class="flex justify-center flex-col">
                    <img src="${pokemonImage}" alt="${pokemon.name}" class="w-32 h-32 mx-auto"/>
                    <h1 class="text-center py-2">${pokemonID}. ${pokemon.name}</h1>
                </div>
            </div>
        `;

        // Voeg de div toe aan de container
        container.appendChild(div);

        sheetview();
    });

    // Check of de zoekresultaten minder zijn dan de pokemons per pagina en zet de buttons disabled
    if (searchResults.length < pokemonsPerPage) {
        pagination.innerHTML = '';
        nextButton.disabled = true;
        prevButton.disabled = true;
    }
}

function formatPokemonID(external_pokemonid) {

    //Format het id voor de externe image uit een andere api
    if (external_pokemonid < 10) {
        return '00' + external_pokemonid;
    }
    else if (external_pokemonid < 100) {
        return '0' + external_pokemonid;
    }
    else {
        return external_pokemonid;
    }
}

//Functie om de pagination te updaten
function updatePagination() {

    // Check of de titel en pagination bestaan
    if (title) {
        title.innerHTML = `Pokemon page ${currentPage}`;
    }

    if (pagination) {
        paginationP.innerHTML = `Page: ${currentPage}`;
        paginationP.className = 'text-center py-4 text-lg font-bold';
        pagination.appendChild(paginationP);
    }
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
    goBackButton.style.display = 'block';
    document.querySelector('.addTypesToContainer').innerHTML = '';
    const urlParams = new URLSearchParams(window.location.search);
    let typeID = urlParams.get('typeID');

    fetch(`https://pokeapi.co/api/v2/type/${typeID}`)
        .then(response => response.json())
        .then(data => {
            const pokemons = data.pokemon;

            if (pokemons.length === 0) {
                alert('Geen pokemons gevonden!');
                typesContainer.innerHTML = 'Geen pokemons gevonden!';
                typesContainer.style.textAlign = 'center';
                typesContainer.classList.remove('grid-cols-2')
            }

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
                        <h1 class="text-center py-2">${pokemonID}. ${name}</h1>
                        </div>
                </div>
        `;
                typesContainer.appendChild(div);

            });

            sheetview();
        })
}

// Functie om favoriete pokemons te laten zien
function showFavoritePokemons() {
    // Haal de favorieten op uit de local storage
    const favorites = JSON.parse(localStorage.getItem('favoritePokemons')) || [];
    // Maak de container leeg
    container.innerHTML = '';

    // Loop door de favorieten heen en maak een card voor elke favoriete pokemon
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

            // Voeg de card toe aan de container
            container.appendChild(card);
        }
    });

    sheetview();
}

// Clear de local storage wanneer de clearLocalStorage knop wordt geklikt
if (clearLocalStorageButton) {
    clearLocalStorageButton.addEventListener('click', function () {
        localStorage.removeItem('favoritePokemons');
        window.location.reload();
    });
}

if (goBackButton) {
    goBackButton.addEventListener('click', () => {
        goBackButton.style.display = 'none';
        addTypesContainer.innerHTML = '';
        addTypesContainer.classList.add('grid-cols-2');
        getAllPokemonTypes();
    });
}

// Event listeners voor de next en back buttons
if (nextButton) { nextButton.addEventListener('click', () => handleButtonClick('next')); }
if (prevButton) { prevButton.addEventListener('click', () => handleButtonClick('back')); }

// Event listener for the search button
searchButton.addEventListener('click', () => {
    searchButtonVisible();
});

if (seachPokemonButton) {

    // Event listener voor de zoek button
    seachPokemonButton.addEventListener('click', () => {

        // Haal de pokemon naam op en zet deze in de url zodat ik die er later weer uit kan halen
        pokemonName = searchInput.value;
        const url = new URL(location);

        // Check of er een pokemon is ingevuld
        if (!pokemonName) { alert("Geen pokemon gevonden") }

        // Zet de pokemon naam in de url en push de url naar de history
        url.searchParams.set('query', pokemonName);
        history.pushState({}, "", url);

        // Zoek de pokemon op basis van de naam uit de url
        searchPokemonByName(pokemonName);
    });
}

if (searchInput) {

    // Event listener zodat je op enter kan drukken om te zoeken
    searchInput.addEventListener('keypress', (event) => {

        // Check of de enter key is ingedrukt (enter key code is 13)
        if (event.keyCode === 13) {

            // Zorg ervoor dat de pagina niet herlaad
            event.preventDefault();

            // Haal de pokemon naam op en zet deze in de url zodat ik die er later weer uit kan halen
            pokemonName = searchInput.value;
            const url = new URL(location);

            // Check of er een pokemon is ingevuld
            if (!pokemonName) { alert("Geen pokemon gevonden") }

            // Zet de pokemon naam in de url en push de url naar de history
            url.searchParams.set('query', pokemonName);
            history.pushState({}, "", url);


            // Zoek de pokemon op basis van de naam uit de url
            searchPokemonByName(pokemonName);
        }
    });
}

window.addEventListener('load', function () {
    if (sheetview()) {
        closeSheet();
    }
    if (!this.window.location.href.endsWith('favorites.html') && !this.window.location.href.endsWith('types.html')) {
        fetchPokemons();
    }
});

//Fetch de pokemons en update de pagination
document.addEventListener('DOMContentLoaded', (event) => {
    if (window.location.href.endsWith('types.html')) {
        getAllPokemonTypes();
    }

    if (window.location.href.endsWith('favorites.html')) {
        showFavoritePokemons();
    }
});