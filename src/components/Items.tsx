import { useContext } from "react";
import { BiErrorCircle, BiMessageX, BiPlus } from "react-icons/bi";
import { stationContext } from "../context/StationContext";
import styles from "../styles/MainScreen.module.css";

export default function Items({ item }: { item: MenuItem }) {
  const { selectedStation } = useContext(stationContext);

  // Sorts the items ingredients, and seperates them into selected, not selected and added.
  //
  // edited ingedients will display with a strike through line
  const ingredientsSelected = item.ingredients.filter(
    (ingredient) =>
      (ingredient.selected === true && ingredient.added !== true) ||
      (ingredient.selected === false && ingredient.added !== true && ingredient.edited === true)
  );
  const ingredientsNotSelected = item.ingredients.filter(
    (ingredient) => ingredient.selected === false || (ingredient.selected === true && ingredient.edited === true)
  );
  const ingredientsAdded = item.ingredients.filter(
    (ingredient) => (ingredient.added === true && ingredient.edited === true) || ingredient.added === true
  );

  return (
    <div className={styles[`${item.station === selectedStation ? "item-highlight-font" : "item-font"}`]}>
      <div className={styles[`${item.station === selectedStation ? "item-highlight" : "item"}`]}>{item.name}</div>
      <div className={styles["ingredients-wrapper"]}>
        {ingredientsSelected &&
          ingredientsSelected.map((ingredient) => {
            return (
              <div
                key={ingredient.ingredientId}
                className={styles[`${ingredient.edited ? (ingredient.selected ? undefined : "line-through") : undefined}`]}
              >
                <span> {ingredient.ingredient} </span>
              </div>
            );
          })}
        {ingredientsNotSelected.length > 0 && (
          <div className={styles["not-selected"]}>
            <div className={styles["remove-ingredient-icon"]}>
              <BiErrorCircle />
            </div>
            <div>
              {ingredientsNotSelected.map((ingredient) => {
                return (
                  <div
                    key={ingredient.ingredientId}
                    className={styles[`${ingredient.edited ? (ingredient.selected ? "line-through" : undefined) : undefined}`]}
                  >
                    No {ingredient.ingredient}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {ingredientsAdded.length > 0 && (
          <div className={styles["added"]}>
            <div className={styles["added-ingredient-icon"]}>
              <BiPlus />
            </div>
            <div>
            {ingredientsAdded.map((ingredient) => {
              return (
                <div
                  key={ingredient.ingredientId}
                  className={
                    styles[`${ingredient.edited ? (ingredient.added ? (ingredient.selected ? undefined : "line-through") : undefined) : undefined}`]
                  }
                >
                  Add {ingredient.ingredient}
                </div>
              );
            })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
