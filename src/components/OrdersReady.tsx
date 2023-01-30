import styles from "../styles/MainScreen.module.css";

import useFirestore from "../hooks/useFirestore";
import Stopwatch from "./Stopwatch";

export default function OrdersReady({ order }: { order: OrderDetails }) {
  const swStartTime = new Date(order.timeOrderPlaced! + 600000);

  const sendFirestore = useFirestore();

  const handleOrderUpClick = () => {
    sendFirestore({ orderID: order.orderId, type: "setClosed" });
  };

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
