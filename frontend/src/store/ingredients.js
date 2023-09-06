import { csrfFetch } from "./csrf";

const LOAD_ALL_INGREDIENTS = 'ingredients/LOAD_ALL_INGREDIENTS';

// AC - Action creator
const loadAllIngredientsAC = (ingredients) => ({
    type: LOAD_ALL_INGREDIENTS,
    payload: ingredients
});

// Thunk AC
export const loadAllIngredients = () => async dispatch => {
    const res = await csrfFetch("api/ingredients");

    if (res.ok) {
        const ingredients = await res.json();
        dispatch(loadAllIngredientsAC(ingredients));
        return ingredients;
    }
}