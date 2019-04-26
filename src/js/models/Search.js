import axios from 'axios';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        const key = '2c6995468794319a3d84bddf0c2e5007';
        try {
            const results = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.results = results.data.recipes;
            //console.log(this.results);
        } catch (error) {
            alert(error);
        }
    }
};