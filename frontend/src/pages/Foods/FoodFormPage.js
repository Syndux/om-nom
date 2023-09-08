import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import {
  loadAllFoods,
  loadSingleFood,
  createFood,
  updateFood,
} from "../../store/foods";
import { loadAllIngredients } from "../../store/ingredients";

// handle API errors: {name: "ERROR HERE" }
// anchor to newest ingredient cell
// render in edit mode

const FoodFormPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { routeId } = useParams();
  const sessionUser = useSelector((state) => state.session.user);
  const foodToEdit = useSelector((state) => state.foods[routeId]);
  const ingredients = useSelector((state) => Object.values(state.ingredients));
  const isEdit = !!routeId;

  const [formData, setFormData] = useState({
    name: "",
    imgUrl: "",
    cuisine: "",
    ingredients: [
      {
        ingredientId: "",
        quantity: "",
        units: "",
      },
    ],
  });

  useEffect(() => {
    dispatch(loadAllFoods());
    dispatch(loadAllIngredients());

    if (isEdit) {
      dispatch(loadSingleFood(routeId));
    }
  }, [dispatch, isEdit, routeId]);

  useEffect(() => {
    if (isEdit && foodToEdit) {
      setFormData({
        name: foodToEdit.name,
        imgUrl: foodToEdit.imgUrl,
        cuisine: foodToEdit.cuisine,
        ingredients: foodToEdit.ingredients,
      });
    }
  }, [isEdit, foodToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let foodId;

    if (isEdit) {
      foodId = await dispatch(updateFood(routeId, formData));
    } else {
      foodId = await dispatch(createFood(formData));
    }

    history.push(`/foods/${foodId}`);

    setFormData({
      name: "",
      imgUrl: "",
      cuisine: "",
      ingredients: [],
    });
  };

  // Add a new dropdown for selecting ingredients
  const addIngredientDropdown = () => {
    setFormData((prevData) => ({
      ...prevData,
      ingredients: [
        ...prevData.ingredients,
        {
          ingredientId: "",
          quantity: "",
          units: "",
        },
      ],
    }));
  };

  // Update the selected ingredient at a specific index
  const handleIngredientChange = (index, ingredientId, quantity, units) => {
    setFormData((prevData) => {
      const updatedIngredients = [...prevData.ingredients];
      updatedIngredients[index] = {
        ingredientId,
        quantity,
        units,
      };
      return {
        ...prevData,
        ingredients: updatedIngredients,
      };
    });
  };

  // Remove a dropdown for selecting ingredients
  const removeIngredientDropdown = (index) => {
    setFormData((prevData) => {
      const updatedIngredients = [...prevData.ingredients];
      updatedIngredients.splice(index, 1);
      return {
        ...prevData,
        ingredients: updatedIngredients,
      };
    });
  };

  return (
    <div className="dark:text-light-gray text-secondary-dark-bg bg-light-gray dark:bg-secondary-dark-bg">
      <div className="flex flex-wrap items-center justify-center lg:flex-nowrap">
        <div className="m-3 flex h-[calc(100dvh-72px)] w-full flex-col items-center justify-start overflow-y-auto overflow-x-hidden rounded-xl bg-main-bg p-4 dark:bg-main-dark-bg">
          {sessionUser ? (
            <>
              <p className="my-10 text-3xl ">
                {isEdit ? "Edit Food" : "Create a new food"}
              </p>
              <form className="flex flex-col" onSubmit={handleSubmit}>
                {/* Input fields */}
                <div className="my-2">
                  <input
                    className="rounded-lg bg-light-gray p-1.5 dark:bg-secondary-dark-bg"
                    placeholder="Name"
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="my-2">
                  <input
                    className="rounded-lg bg-light-gray p-1.5 dark:bg-secondary-dark-bg"
                    placeholder="Image url"
                    type="text"
                    id="imgUrl"
                    name="imgUrl"
                    value={formData.imgUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imgUrl: e.target.value })
                    }
                  />
                </div>
                <div className="my-2">
                  <input
                    className="rounded-lg bg-light-gray p-1.5 dark:bg-secondary-dark-bg"
                    placeholder="Cuisine"
                    type="text"
                    id="cuisine"
                    name="cuisine"
                    value={formData.cuisine}
                    onChange={(e) =>
                      setFormData({ ...formData, cuisine: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Ingredient add */}
                <div className="my-2">
                  <select
                    className="w-full rounded-lg bg-light-gray p-1.5 dark:bg-secondary-dark-bg"
                    id="ingredientDropdown"
                    name="selectedIngredient"
                    value={formData.ingredients[0] || ""}
                    onChange={(e) => handleIngredientChange(0, e.target.value)}
                  >
                    <option value="">Select an ingredient...</option>
                    {/* Ingredient dropdown */}
                    {ingredients.map((ingredient) => (
                      <option key={ingredient.id} value={ingredient.id}>
                        {ingredient.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* More ingredient adds */}
                {formData.ingredients.map((ingredient, index) => (
                  <div className="my-2" key={index}>
                    <div className="relative flex">
                      <select
                        className="w-full rounded-lg bg-light-gray p-1.5 dark:bg-secondary-dark-bg"
                        id={`ingredientDropdown_${index}`}
                        name={`selectedIngredient_${index}`}
                        value={ingredient.ingredientId || ""}
                        onChange={(e) =>
                          handleIngredientChange(
                            index,
                            e.target.value,
                            ingredient.quantity,
                            ingredient.units,
                          )
                        }
                      >
                        <option value="">Select an ingredient...</option>
                        {ingredients.map((ingredient) => (
                          <option key={ingredient.id} value={ingredient.id}>
                            {ingredient.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        className="ml-2 w-1/3 rounded-lg bg-light-gray p-1.5 dark:bg-secondary-dark-bg"
                        placeholder="Quantity"
                        value={ingredient.quantity || ""}
                        onChange={(e) =>
                          handleIngredientChange(
                            index,
                            ingredient.ingredientId,
                            e.target.value,
                            ingredient.units,
                          )
                        }
                      />
                      <input
                        type="text"
                        className="ml-2 w-1/3 rounded-lg bg-light-gray p-1.5 dark:bg-secondary-dark-bg"
                        placeholder="Units"
                        value={ingredient.units || ""}
                        onChange={(e) =>
                          handleIngredientChange(
                            index,
                            ingredient.ingredientId,
                            ingredient.quantity,
                            e.target.value,
                          )
                        }
                      />
                      <button
                        type="button"
                        onClick={() => removeIngredientDropdown(index)}
                        className="px-2 text-red-500"
                      >
                        &#10005;
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add more ingredient dropdown button */}
                <button
                  type="button"
                  onClick={addIngredientDropdown}
                  className="mt-2 rounded bg-blue-500 px-2 py-1 text-white"
                >
                  Add Ingredient
                </button>

                {/* Submit button */}
                <div className="my-5 flex justify-center">
                  <button
                    className="text-light-gray bg-chinese-gold dark:text-main-bg rounded-lg px-3 py-1 duration-100 ease-in hover:scale-105"
                    type="submit"
                  >
                    {isEdit ? "Update this food" : "Create this food"}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <p className="m-4 flex justify-center text-xl font-bold">
              Must be logged-in to view this page.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodFormPage;
