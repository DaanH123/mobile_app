const container = document.querySelector('.addToContainer');
const topAppBar = new MDCTopAppBar(document.querySelector('.mdc-top-app-bar'));
const drawer = MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));
const tabBar = new MDCTabBar(document.querySelector('.mdc-tab-bar'));

document.querySelector('#hamburger-menu').addEventListener('click', () => {
    drawer.open = true;
});

const tabs = Array.from(document.querySelectorAll('.mdc-tab'));
const title = document.querySelector('.mdc-top-app-bar__title');
const tabindicator = Array.from(document.querySelectorAll('.mdc-tab-indicator'));
const recipes = Array.from(document.querySelectorAll('.recipeContainer'));

title.addEventListener('click', () => {
    tabs.forEach(element => {
        element.classList.remove('mdc-tab--active');
    });

    tabindicator.forEach(element => {
        element.classList.remove('mdc-tab-indicator--active');
    });

    recipes.forEach(element => {
        element.classList.remove('hidden');
    });
});

function fetchRandomRecipe() {
    //Shows 10 recipes from spoonacular API 
    fetch('https://api.spoonacular.com/recipes/random?number=10&apiKey=9594943b59d84127b512f6435a99683f')
        .then(response => {
            return response.json();
        })
        .then(data => {
            const apiRecipes = data.recipes;

            apiRecipes.forEach(recipe => {
                const recipeContainer = document.createElement('div');
                recipeContainer.classList.add('recipeContainer');

                // Add data attributes for the recipe properties
                recipeContainer.dataset.vegetarian = recipe.vegetarian;
                recipeContainer.dataset.vegan = recipe.vegan;
                recipeContainer.dataset.glutenFree = recipe.glutenFree;

                const recipeTitle = document.createElement('h2');
                recipeTitle.textContent = recipe.title;

                const recipeImage = document.createElement('img');
                recipeImage.src = recipe.image;

                recipeContainer.appendChild(recipeTitle);
                recipeContainer.appendChild(recipeImage);

                container.appendChild(recipeContainer);

                // Add the new recipeContainer element to the recipes array
                recipes.push(recipeContainer);
            })

            checkRecipeFilter();
        })
        .catch(error => {
            console.error(error);
        });
}

function checkRecipeFilter() {
    const recipes = document.querySelectorAll('.recipeContainer');

    recipes.forEach(recipe => {
        if (recipe.dataset.vegetarian === 'true') {
            recipe.classList.add('vegetarian');
        }
        if (recipe.dataset.vegan === 'true') {
            recipe.classList.add('vegan');
        }
        if (recipe.dataset.glutenFree === 'true') {
            recipe.classList.add('glutenFree');
        }
    });
}

//Dynamic filter function for the tabs by checking classes
function filterRecipes(tab) {
    console.log(recipes)
    let recipeCount = 0;
    recipes.forEach(recipe => {
        recipe.classList.add('hidden');

        if (recipe.classList.contains(tab)) {
            recipeCount++;
            recipe.classList.remove('hidden');
        }
    });

    if (recipeCount === 0) {
        alert('No recipes found for this category');
    }
}

fetchRandomRecipe();