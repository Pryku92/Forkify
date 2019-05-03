import axios from 'axios';
import { key } from '../config';

export default class Recipe {
    constructor (id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const recipe = await axios(`https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            this.title = recipe.data.recipe.title;
            this.author = recipe.data.recipe.publisher;
            this.img = recipe.data.recipe.image_url;
            this.url = recipe.data.recipe.source_url;
            this.ingredients = recipe.data.recipe.ingredients;
        } catch(error) {
            alert(error);
        }
    }

    calcTime() {
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }
}