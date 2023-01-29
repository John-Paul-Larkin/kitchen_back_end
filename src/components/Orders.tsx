// import { isArray, isEqual, isObject, transform } from "lodash";

// import isArray from "lodash/isArray"
import styles from "../styles/MainScreen.module.css";

// import { doc, onSnapshot } from "firebase/firestore";
import { useContext, useState } from "react";
// import { inspect } from "util";
import { stationContext } from "../context/StationContext";
import Items from "./Items";
import Stopwatch from "./Stopwatch";
import Timer from "./Timer";

export default function Orders({ order }: { order: OrderDetails }) {
  // useEffect(() => {
  //   const unsubscribe = onSnapshot(doc(db, "orders", order.orderId), (doc) => {
  //     const data = doc.data() as OrderDetails;

  //   console.log("here");

  // const diff = difference(order, data);
  //   console.log("here 2");

  //   console.log(diff);

  //   if (Object.keys(diff).length !== 0) {
  //     console.log("inspect", inspect(diff, { showHidden: true, depth: null, colors: true }));
  //     console.log("diff   ", diff);
  //     console.log("order  ", order);
  //     // if (diff.hasOwnProperty("orderItemDetails")) {
  //     if (diff.orderItemDetails.ingredients.selected) {
  //       console.log("changed to", diff.orderItemDetails.ingredients.selected);
  //     }
  //   }
  // });

  //   return () => unsubscribe();
  // }, [order]);

  const { selectedStation } = useContext(stationContext);

  const [isShowStopWatch, setIsShowStopWatch] = useState(false);

  // Sorts the order to display a particular stations items at the top
  order.orderItemDetails.sort((a, b) => {
    return Number(b.station === selectedStation) - Number(a.station === selectedStation);
  });

  const finishTime = new Date(order.timeOrderPlaced! + 600000);

  return (
    <div className={styles["single-order"]}>
      {!isShowStopWatch && <Timer setIsShowStopWatch={setIsShowStopWatch} finishTime={finishTime} />}
      {isShowStopWatch && <Stopwatch startTime={finishTime} />}
      <span>
        Table {order.tableNumber}
        <span> - {order.server}</span>
      </span>

      {order &&
        order.orderItemDetails.map((item) => {
          return (
            <div key={item.itemId}>
              <Items item={item} />
            </div>
          );
        })}
      <button className={styles["ready-button"]}>Order up</button>
    </div>
  );
}

// function difference(origObj: OrderDetails, newObj: OrderDetails) {
//   function changes(newObj: any, origObj: any) {
//     let arrayIndexCounter = 0;
//     return transform(newObj, function (result: any, value, key) {
//       if (!isEqual(value, origObj[key])) {
//         let resultKey = isArray(origObj) ? arrayIndexCounter++ : key;
//         result[resultKey] = isObject(value) && isObject(origObj[key]) ? changes(value, origObj[key]) : value;
//       }
//     });
//   }
//   return changes(newObj, origObj);
// }
