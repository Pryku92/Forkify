// 2c6995468794319a3d84bddf0c2e5007
// API endpoints https://www.food2fork.com/api/search  https://www.food2fork.com/api/get

// https://www.food2fork.com/api/search?key=2c6995468794319a3d84bddf0c2e5007&q=pizza

import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';
//import { stat } from 'fs';

/* GLOBAL STATE
- search object
- current recipe object
- shopping list object
- liked recipes
*/
const state = {};



// SEARCH CONTROLLER

const controlSearch = async () => {
    // 1 Get query from view
    const query = searchView.getInput();

    if (query) {
        // 2 new search object added to state
        state.search = new Search(query);

        // 3 prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // 4 search for recipes
            await state.search.getResults();
    
            // 5 render results in UI
            clearLoader();
            searchView.renderResults(state.search.results);
        } catch (error) {
            alert('Ups! We\'ve got problem with search :\'(...');
            clearLoader();
        }
    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto);
        searchView.clearResults();
        searchView.renderResults(state.search.results, goToPage);
    } 
});



// RECIPE CONTROLLER

const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');

    if(id) {
        //prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // highlight selected list item
        if (state.search) searchView.highlightSelected(id);

        //create new recipe object
        state.recipe = new Recipe(id);

        try {
            //get recipe data
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
    
            //calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
    
            //render recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)   
            );

        } catch (error) {
            alert('Error processing recipe!');
        }
    }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


// SHOPPING LIST CONTROLLER

const controlList = () => {
    if(!state.list) state.list = new List();

    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
};

elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    if(e.target.matches('.shopping__delete, .shopping__delete *')) {
        state.list.deleteItem(id);

        listView.deleteItem(id);
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value);
        state.list.updateCount(id, val);
    }
});



// LIKES CONTROLLER

const controlLike = () => {
    if(!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    //user has not yet liked current recipe
    if(!state.likes.isLiked(currentID)) {
        //add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        //toggle the like button
        likesView.toggleLikeBtn(true);

        //add like to UI list
        likesView.renderLike(newLike);

    } else {
        //remove like from the state
        state.likes.deleteLike(currentID);

        //toggle the like button
        likesView.toggleLikeBtn(false);

        //remove like from UI list
        likesView.deleteLike(currentID);
    }

    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

//restore liked recipes on load
window.addEventListener('load', () => {
    //create likes array on page load
    state.likes = new Likes();

    //restore likes from localStorage
    state.likes.readStorage();

    //toggle like menu
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    //render likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
});


elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        //like controller
        controlLike();
    }
});