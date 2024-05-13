const container = document.querySelector('.addToContainer');
const topAppBar = new MDCTopAppBar(document.querySelector('.mdc-top-app-bar'));
const drawer = MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));
const tabBar = new MDCTabBar(document.querySelector('.mdc-tab-bar'));
const searchInput = document.querySelector('#my-search');
const searchContainer = document.querySelector('.mdc-text-field');
const pokemonContainer = document.querySelector('.sheet main');

const pagination = document.querySelector('.pagination');
const paginationP = document.createElement('p');
const searchButton = document.querySelector('#searchButton');

let pageLimit = 20;
let pageOffset = 0;
let currentPage = 1;
let pokemonID;

const tabs = Array.from(document.querySelectorAll('.mdc-tab'));
const title = document.querySelector('.mdc-top-app-bar__title');
const tabindicator = Array.from(document.querySelectorAll('.mdc-tab-indicator'));

const nextButton = document.querySelector('.next');
const prevButton = document.querySelector('.prev');

document.querySelector('#hamburger-menu').addEventListener('click', () => {
    drawer.open = true;
});

title.addEventListener('click', () => {
    tabs.forEach(element => {
        element.classList.remove('mdc-tab--active');
    });

    tabindicator.forEach(element => {
        element.classList.remove('mdc-tab-indicator--active');
    });
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
    const image = document.querySelector('.sheet img');
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

            let contentTitle = element.getAttribute('title');
            title.textContent = contentTitle;

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
              <div class="card shadow flex justify-center rounded-2xl" data-id="${pokemonID}">
                <div>
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
    if (pageOffset === 0) {
        prevButton.disabled = true;
        prevButton.classList.add('opacity-50');
    } else {
        prevButton.disabled = false;
        prevButton.classList.remove('opacity-50');
    }

    //Button voor de volgende pokemon maak eerst de pagina leeg daarna verhoog de offset en de currentpage en fetch de pokemon opnieuw
    nextButton.addEventListener('click', () => {
        container.innerHTML = '';
        pageOffset += pageLimit;
        currentPage += 1;
        updatePagination();
        fetchPokemons();
    });

    //Button voor de vorige pokemon maak eerst de pagina leeg daarna verlaag de offset en de currentpage en fetch de pokemon opnieuw
    prevButton.addEventListener('click', () => {
        if (pageOffset === 0) return;
        container.innerHTML = '';
        pageOffset -= pageLimit;
        currentPage -= 1;
        updatePagination();
        fetchPokemons();
    });

    // Event listener for the search button
    searchButton.addEventListener('click', () => {
        searchButtonVisible();
    });
}

//Functie om de pagination te updaten
function updatePagination() {
    title.innerHTML = `Pokemon page ${currentPage}`;
    paginationP.innerHTML = `Page: ${currentPage}`;
    paginationP.className = 'text-center py-4 text-lg font-bold';
    pagination.appendChild(paginationP);
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
                        <img class="w-40 highlighted-spot rounded-2xl p-4" src="${pokemonImage}" alt="${pokemonName}">
                            <div class="flex gap-3">
                                <img class="w-32 border-2 rounded-2xl border-blue-700" id="api_image" src="${pokemonImage}" alt="${pokemonName}">
                                <img class="w-32 border rounded-2xl border-black" id="external_image" src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/${external_pokemonid}.png" alt="">
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
                    <button class="prevPokeBtn bg-blue-700 text-white px-8 py-3 rounded-xl w-24">Back</button>
                    <button class="nextPokeBtn bg-blue-700 text-white px-8 py-3 rounded-xl w-24">Next</button>
                </div>
            </div>
        `;


            //Maak de vorige button onklikbaar als we op de eerste pagina zitten
            if (Number(pokemonID) === 1) {
                prevButton.disabled = true;
                prevButton.classList.add('opacity-50');
            } else {
                prevButton.disabled = false;
                prevButton.classList.remove('opacity-50');
            }

            // Voeg de div toe aan de container
            pokemonContainer.appendChild(div);

            // Voeg event listeners toe aan de images
            const externalImage = document.getElementById('external_image');
            const apiImage = document.getElementById('api_image');
            const highlightedSpot = document.querySelector('.highlighted-spot');

            function swapClasses(element1, element2) {
                element1.className = 'w-32 border rounded-2xl border-black';
                element2.className = 'w-32 border-2 rounded-2xl border-blue-700';
            }

            externalImage.addEventListener('click', function () {
                swapClasses(apiImage, externalImage);
                highlightedSpot.src = this.src;
            });

            apiImage.addEventListener('click', function () {
                swapClasses(externalImage, apiImage);
                highlightedSpot.src = this.src;
            });

            //Button voor de volgende pokemon maak eerst de pagina leeg daarna verhoog de pokemonID en fetch de pokemon opnieuw en update de url
            const nextPokeButton = document.querySelector('.nextPokeBtn');
            const prevPokeButton = document.querySelector('.prevPokeBtn');

            nextPokeButton.addEventListener('click', () => {
                document.querySelector('.sheet main').innerHTML = '';
                pokemonID++;
                const url = new URL(location);

                url.searchParams.set('pokemonID', pokemonID);
                history.pushState({}, "", url);
                fetchPokemonById();
            });

            //Button voor de vorige pokemon maak eerst de pagina leeg daarna verlaag de pokemonID en fetch de pokemon opnieuw en update de url
            prevPokeButton.addEventListener('click', () => {
                if(pokemonID < 1) {
                    alert('This is the first pokemon');
                }

                document.querySelector('.sheet main').innerHTML = '';
                pokemonID--;
                const url = new URL(location);

                url.searchParams.set('pokemonID', pokemonID);
                history.pushState({}, "", url);
                fetchPokemonById();
            });
        });
}

function fetchPokemonByName() {
    // Get the search query from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');

    // Make the API call
    fetch(`https://pokeapi.co/api/v2/pokemon/${query}`)
        .then(response => response.json())
        .then(data => {
            const pokemon = data;
        })
        .catch(error => {
            console.error(error);
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

//Fetch de pokemons en update de pagination
document.addEventListener('DOMContentLoaded', (event) => {
    sheetview();
    updatePagination();
    fetchPokemons();
});