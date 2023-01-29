// import { isArray, isEqual, isObject, transform } from "lodash";

// import isArray from "lodash/isArray"
import styles from "../styles/MainScreen.module.css";

// import { doc, onSnapshot } from "firebase/firestore";
import { useContext, useState } from "react";
// import { inspect } from "util";
import { stationContext } from "../context/StationContext";
import useFirestore from "../hooks/useFirestore";
import Items from "./Items";
import Stopwatch from "./Stopwatch";
import Timer from "./Timer";

export default function OrdersTimeUp({ order }: { order: OrderDetails }) {
  const { selectedStation } = useContext(stationContext);

  const [isShowStopWatch, setIsShowStopWatch] = useState(false);

  // Sorts the order to display a particular stations items at the top
  order.orderItemDetails.sort((a, b) => {
    return Number(b.station === selectedStation) - Number(a.station === selectedStation);
  });

  const finishTime = new Date(order.timeOrderPlaced! + 600000);

  const sendFirestore = useFirestore();

  const handleOrderUpClick = () => {
    sendFirestore({ orderID: order.orderId, type: "setReady" });
  };

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
      <button className={styles["ready-button"]} onClick={handleOrderUpClick}>
        Order up
      </button>
    </div>
  );
}
