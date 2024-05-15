export { fetchPokemonById };

const container = document.querySelector('.addToContainer');
const topAppBar = new MDCTopAppBar(document.querySelector('.mdc-top-app-bar'));
const drawer = new MDCDrawer(document.querySelector('.mdc-drawer'));
const searchInput = document.querySelector('#my-search');
const searchContainer = document.querySelector('.mdc-text-field');
const pokemonContainer = document.querySelector('.sheet main');

const pagination = document.querySelector('.pagination');
const paginationP = document.createElement('p');
const searchButton = document.querySelector('#searchButton');
const seachPokemonButton = document.querySelector('#search-Button');

let pageLimit = 20;
let pageOffset = 0;
let currentPage = 1;
let pokemonID;

const title = document.querySelector('.mdc-top-app-bar__title');

const nextButton = document.querySelector('.next');
const prevButton = document.querySelector('.prev');

document.querySelector('#hamburger-menu').addEventListener('click', () => {
    drawer.open = true;
});

window.addEventListener("popstate", function (event) {
    closeSheet();
});

function searchButtonVisible() {
    searchContainer.classList.toggle('hidden');
}

function closeSheet() {
    document.querySelector('.sheet').classList.add('sheet-out-of-view');
    history.pushState({}, "", location.pathname);
    document.body.classList.remove('stop-scrolling');
}

function sheetview() {
    const content = document.querySelectorAll('.card');
    const closebtn = document.querySelector('.sheet .mdc-top-app-bar__navigation-icon');
    const title = document.querySelector('.sheet .mdc-top-app-bar__title');
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

function fetchPokemons() {
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${pageLimit}&offset=${pageOffset}`)
        .then(response => response.json())
        .then(data => {
            //Sla alle data op in pokemon variable
            const pokemon = data.results;

            pokemon.forEach(pokemon => {

                // Haa alle info van de pokemon op
                const pokemonName = pokemon.name;
                const pokemonUrl = pokemon.url;

                const pokemonID = pokemonUrl.split('/')[6];
                const pokemonImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonID}.png`;

                //Maak een div aan en vul deze met de info van de pokemon
                const div = document.createElement('div');
                div.className = 'pokecard w-25';
                div.innerHTML = `
                <div class="card mdc-card mdc-card--outlined" data-id="${pokemonID}">
                    <div class="flex justify-center flex-col">
                        <img src="${pokemonImage}" alt="${pokemonName}" />
                        <h1 class="text-center py-2">${pokemonID}. ${pokemonName}</h1>
                        </div>
                </div>
              `;

                //Voeg de div toe aan de container
                container.appendChild(div);
            });

            sheetview();
        });

    //Maak de vorige button onklikbaar als we op de eerste pagina zitten
    if (prevButton) {
        if (pageOffset === 0) {
            prevButton.disabled = true;
            prevButton.classList.add('opacity-50');
        } else {
            prevButton.disabled = false;
            prevButton.classList.remove('opacity-50');
        }
    }

    // Event listener for the search button
    searchButton.addEventListener('click', () => {
        searchButtonVisible();
    });
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

            //Haal het id op en format het voor de externe image
            const external_pokemonid = formatPokemonID(pokemonID);

            //Maak een lege variabele aan om in de loop de info in te stoppen
            let pokemonType = "";
            let pokemonAbilities = "";
            let baseStats = '';

            //Loop door de abilities heen en sla de naam op in de pokemonAbilities variabele
            abilities.forEach((ability) => {
                pokemonAbilities += ability.ability.name;
                if (abilities.indexOf(ability) !== abilities.length - 1) {
                    pokemonAbilities += ", ";
                }
            });

            //Loop door de stats heen en maak een div aan met de stats en geef ze een kleur op basis van de base_stat
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

            //Maak een div aan en vul deze met de data van de pokemon
            const div = document.createElement('div');
            div.innerHTML = `
            <div class="pokemon-card pt-20 text-white">
                <div class="block md:flex items-center">
                    <div class="px-4 md:flex items-center">
                        <h2 class="font-bold text-xl uppercase">${pokemonID}. ${pokemonName}</h2>
                        <img class="w-38 highlighted-spot rounded-2xl p-4" src="${pokemonImage}" alt="${pokemonName}">
                            <div class="flex gap-3">
                                <img class="w-24 border-2 rounded-2xl border-blue-700" id="api_image" src="${pokemonImage}" alt="${pokemonName}">
                                <img class="w-24 border rounded-2xl border-black" id="external_image" src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/${external_pokemonid}.png" alt="">
                            </div>
                        </div>
                    <div class="px-4 space-y-4 pt-2">
                        <h3 class="font-bold text-lg">Type</h3>
                        <p class="text-sm mt-1">${pokemonType}</p>
                        <h3 class="font-bold text-lg">Abilities</h3>
                        <p class="text-sm">${pokemonAbilities}</p>
                        <h3 class="font-bold text-lg">Cries</h3>
                    </div>
                    <div class="px-4 grid grid-cols-2">
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
                element1.className = 'w-24 border rounded-2xl border-black';
                element2.className = 'w-24 border-2 rounded-2xl border-blue-700';
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

            if (nextPokeButton) {
                nextPokeButton.addEventListener('click', () => {
                    document.querySelector('.sheet main').innerHTML = '';
                    pokemonID++;
                    const url = new URL(location);

                    url.searchParams.set('pokemonID', pokemonID);
                    history.pushState({}, "", url);
                    fetchPokemonById();
                });
            }

            //Button voor de vorige pokemon maak eerst de pagina leeg daarna verlaag de pokemonID en fetch de pokemon opnieuw en update de url
            if (prevPokeButton) {
                prevPokeButton.addEventListener('click', () => {
                    if (pokemonID < 1) {
                        alert('This is the first pokemon');
                    }

                    document.querySelector('.sheet main').innerHTML = '';
                    pokemonID--;
                    const url = new URL(location);

                    url.searchParams.set('pokemonID', pokemonID);
                    history.pushState({}, "", url);
                    fetchPokemonById();
                });
            }
        });
}

if (seachPokemonButton) {
    seachPokemonButton.addEventListener('click', () => {
        pokemonName = searchInput.value;
        const url = new URL(location);

        url.searchParams.set('query', pokemonName);
        history.pushState({}, "", url);

        fetchPokemonByName();
    });
}

function fetchPokemonByName() {

    // Maak de pagina leeg
    document.querySelector('.addToContainer').innerHTML = '';

    // Haal de pokemon naam op uit de url
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');

    // Make the API call
    fetch(`https://pokeapi.co/api/v2/pokemon/${query}`)
        .then(response => response.json())
        .then(data => {
            const pokemon = data;

            // Haal alle info van de pokemon op
            const pokemonName = pokemon.name;
            const pokemonImage = pokemon.sprites.front_default;
            let pokemonID = pokemon.id;

            //Maak een div aan en vul deze met de info van de pokemon
            const div = document.createElement('div');
            div.className = 'pokecard w-25';
            div.innerHTML = `
                <div class="card mdc-card mdc-card--outlined" data-id="${pokemonID}">
                    <div class="flex justify-center flex-col">
                        <img src="${pokemonImage}" alt="${pokemonName}" />
                        <h1 class="text-center py-2">${pokemonID}. ${pokemonName}</h1>
                        </div>
                </div>
              `;

            //Voeg de div toe aan de container
            container.appendChild(div);

            sheetview();
        });
}

function formatPokemonID(external_pokemonid) {
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
    if (title) {
        title.innerHTML = `Pokemon page ${currentPage}`;
    }

    if (pagination) {
        paginationP.innerHTML = `Page: ${currentPage}`;
        paginationP.className = 'text-center py-4 text-lg font-bold';
        pagination.appendChild(paginationP);
    }
}

//Button voor de volgende pokemon maak eerst de pagina leeg daarna verhoog de offset en de currentpage en fetch de pokemon opnieuw
if (nextButton) {
    nextButton.addEventListener('click', () => {
        container.innerHTML = '';
        pageOffset += pageLimit;
        currentPage += 1;
        updatePagination();
        fetchPokemons();
    });
}

//Button voor de vorige pokemon maak eerst de pagina leeg daarna verlaag de offset en de currentpage en fetch de pokemon opnieuw
if (prevButton) {
    prevButton.addEventListener('click', () => {
        if (pageOffset === 0) return;
        container.innerHTML = '';
        pageOffset -= pageLimit;
        currentPage -= 1;
        updatePagination();
        fetchPokemons();
    });
}

//Fetch de pokemons en update de pagination
document.addEventListener('DOMContentLoaded', (event) => {
    if (window.location.href.endsWith('index.html') || window.location.href.endsWith('/')) {
        sheetview();
        updatePagination();
        fetchPokemons();
    }
});