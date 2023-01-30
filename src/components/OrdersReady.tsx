import { useTimer } from "react-timer-hook";
import useFirestore from "../hooks/useFirestore";
import Stopwatch from "./Stopwatch";
import styles from "../styles/MainScreen.module.css";

export default function OrdersReady({ order }: { order: OrderDetails }) {
  // button which sets order status to closed
  const sendFirestore = useFirestore();
  const handleOrderUpClick = () => {
    sendFirestore({ orderID: order.orderId, type: "setClosed" });
  };

  // sets a timer which automatically moves the order status to closed after 5 minutes
  // if the user has not clicked the button
  const fiveMinutes = 300000;
  const timeToAutoSwitchToReady = new Date(order.timeReady! + fiveMinutes);
  useTimer({
    expiryTimestamp: timeToAutoSwitchToReady,
    onExpire: () => {
      sendFirestore({ orderID: order.orderId, type: "setClosed" });
    },
  });

  //Starts the stopwatch from the moment the timer ends
  const swStartTime = new Date(order.timeTimeUp!);

  return (
    <div className={styles["single-order-ready"]}>
      <Stopwatch startTime={swStartTime} />
      <span>
        Table {order.tableNumber}
        <span> - {order.server}</span>
      </span>

      <button className={styles["ready-button"]} onClick={handleOrderUpClick}>
        Order gone
      </button>
    </div>
  );
}
