import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { loadAllFoods } from "../../store/foods";

const AllFoodsPage = () => {
  const dispatch = useDispatch();
  const foods = useSelector((state) => state.foods);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      await dispatch(loadAllFoods());
      setLoaded(true);
    })();
  }, [dispatch]);

  return (
    // DEVNOTE - make component for the same divs across pages?
    <div className="dark:text-light-gray text-secondary-dark-bg bg-light-gray dark:bg-secondary-dark-bg">
      <div className="flex flex-wrap justify-center lg:flex-nowrap">
        <div className="h-[calc(100vh-73px)] m-3 flex w-full flex-col overflow-y-scroll rounded-xl bg-main-bg dark:bg-main-dark-bg">
          {loaded && (
            <>
              <p className="m-4 text-xl font-bold">
                Browse all available foods
              </p>
              {foods.map((food) => (
                <div className="border-t px-10 py-3">
                  <p className="text-lg">{food.name}</p>
                  <p className="text-sm opacity-60">{food.cuisine}</p>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllFoodsPage;
