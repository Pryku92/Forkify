// 2c6995468794319a3d84bddf0c2e5007
// API endpoints https://www.food2fork.com/api/search  https://www.food2fork.com/api/get

import Search from './models/Search';

/* GLOBAL STATE
- search object
- current recipe object
- shopping list object
- liked recipes
*/
const state = {};

const controlSearch = async () => {
    // 1 Get query from view
    const query = 'pulled pork';

    if (query) {
        // 2 new search object added to state
        state.search = new Search(query);

        // 3 prepare UI for results

        // 4 search for recipes
        await state.search.getResults();

        // 5 render results in UI
        console.log(state.search.results);
    }
}

document.querySelector('.search').addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});