import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";

import { useModal } from "../../context/ModalContext";
import {
  createIngredient,
  loadSingleIngredient,
  updateIngredient,
} from "../../store/ingredients";

const IngredientFormModal = ({ ingredientId }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const isEdit = !!ingredientId;
  const sessionUser = useSelector((state) => state.session.user);
  const ingredientToEdit = useSelector((state) => {
    if (isEdit) {
      return state.ingredients[ingredientId];
    }
    return "";
  });

  const [loaded, setLoaded] = useState(false);
  const [formData, setFormData] = useState({ name: "" });
  const [validationErrors, setValidationErrors] = useState([]);

  const { closeModal } = useModal();

  useEffect(() => {
    (async () => {
      if (isEdit) {
        await dispatch(loadSingleIngredient(ingredientId));
      }
    })();

    setFormData({
      name: ingredientToEdit.name,
    });

    setLoaded(true);
  }, [dispatch]);

  const validateName = () => {
    const errors = [];
    if (!formData.name) {
      errors.push("An ingredient name is required.");
    }

    if (formData.name.length < 2 || formData.name.length > 120) {
      errors.push("Ingredient name must be between 2 and 120 characters.");
    }
    return errors;
  };

  const handleCancel = () => {
    closeModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nameValErrors = validateName();
    const valErrors = [...nameValErrors];

    if (valErrors.length > 0) {
      setValidationErrors(valErrors);
      return;
    }

    let newIngredientId;

    try {
      if (isEdit) {
        newIngredientId = await dispatch(
          updateIngredient(ingredientId, formData),
        );
      } else {
        newIngredientId = await dispatch(createIngredient(formData));
      }

      if (newIngredientId !== null) {
        setFormData({ name: "" });
        setValidationErrors([]);

        // Go to ingredient details page - Coming soon
        // history.push(`/ingredients/${newIngredientId}`);
        closeModal();
        history.push(`/ingredients/current`);
      }
    } catch (error) {
      const res = await error.json();
      if (res.errors) {
        setValidationErrors(Object.values(res.errors));
      } else if (res.message) {
        setValidationErrors([res.message]);
      }
    }
  };

  return (
    <div className="overflow-hidden bg-gray-400 text-left shadow-xl dark:bg-main-dark-bg">
      <div className="flex items-start">
        <div className="m-4">
          {sessionUser && loaded ? (
            <>
              <p className="text-main-dark-bg dark:text-light-gray text-center text-lg font-semibold">
                Create Ingredient
              </p>
              {validationErrors.length > 0 && (
                <div className="mb-5 flex flex-col items-center justify-center text-center text-red-500">
                  {validationErrors.map((error, index) => (
                    <div className="m-0.5" key={index}>
                      {error}
                    </div>
                  ))}
                </div>
              )}
              <form className="mt-2" onSubmit={handleSubmit}>
                <input
                  className="w-full rounded-lg bg-gray-200 p-1.5 placeholder:italic placeholder:text-gray-700 focus:outline-none dark:bg-gray-400"
                  placeholder="Name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
                <div className="justify-center px-4 pb-3 pt-1 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => handleCancel()}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </>
          ) : (
            <p className="m-4 flex justify-center text-xl font-bold">
              Must be logged-in to view this content.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default IngredientFormModal;
