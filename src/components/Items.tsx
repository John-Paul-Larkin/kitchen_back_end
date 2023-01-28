import { useContext } from "react";
import { stationContext } from "../context/StationContext";
import styles from "../styles/MainScreen.module.css";

export default function Items({ item }: { item: MenuItem }) {
  const { selectedStation } = useContext(stationContext);

  
    const ingredientsNotSelected = item.ingredients.filter((item) => item.selected === false);
    const ingredientsSelected = item.ingredients.filter((item) => item.selected === true && item.added !== true);
    const ingredientsAdded = item.ingredients.filter((item) => item.added === true);
  
  return (
    <div>
      <div className={styles[`${item.station === selectedStation ? "item" : "item-highlight"}`]}>{item.name}</div>

      {ingredientsSelected &&
        ingredientsSelected.map((ingredient) => {
          return (
            <div key={ingredient.ingredientId}>
              <span> {ingredient.ingredient} </span>
            </div>
          );
        })}

      {ingredientsNotSelected.length > 0 && (
        <div className={styles["not-selected"]}>
          {ingredientsNotSelected.map((ingredient) => {
            return <div key={ingredient.ingredientId}>No {ingredient.ingredient}</div>;
          })}
        </div>
      )}

      {ingredientsAdded.length > 0 && (
        <div className={styles["added"]}>
          {ingredientsAdded.map((ingredient) => {
            return <div key={ingredient.ingredientId}>Add {ingredient.ingredient}</div>;
          })}
        </div>
      )}
    </div>
  );
}
