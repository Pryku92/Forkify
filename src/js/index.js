// 2c6995468794319a3d84bddf0c2e5007
// API endpoints https://www.food2fork.com/api/search  https://www.food2fork.com/api/get

import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';

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

        // 4 search for recipes
        await state.search.getResults();

        // 5 render results in UI
        clearLoader();
        searchView.renderResults(state.search.results);
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