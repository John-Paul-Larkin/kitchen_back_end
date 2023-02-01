import { motion } from "framer-motion";
import { useContext } from "react";
import { stationContext } from "../context/StationContext";
import useFirestore from "../hooks/useFirestore";
import styles from "../styles/MainScreen.module.css";
import Items from "./Items";
import Timer from "./Timer";

interface orderDetailsWithGap extends OrderDetails {
  gapInPixels: number;
}

export default function OrdersPending({ order }: { order: orderDetailsWithGap }) {
  const { selectedStation } = useContext(stationContext);

  // Sorts the order to display a particular stations items at the top
  order.orderItemDetails.sort((a, b) => {
    return Number(b.station === selectedStation) - Number(a.station === selectedStation);
  });

  const tenMinutes = 600000;
  const timerFinishTime = new Date(order.timeOrderPlaced! + tenMinutes);

  const timeOrderPlaced = new Date(order.timeOrderPlaced!).toLocaleTimeString().substring(0, 5);

  // button which sets order status to ready
  const sendFirestore = useFirestore();
  const handleOrderUpClick = () => {
    sendFirestore({ orderID: order.orderId, type: "setTimeUp", currentStatus: order.orderStatus });
  };

  return (
    <div className={styles["single-order-pending"]} style={{ left: order.gapInPixels }}>
      <div className={styles["single-order-header"]}>
        <div className={styles["order-timer"]}>
          <Timer finishTime={timerFinishTime} order={order} />
        </div>
        <span className={styles["order-table"]}>
          <span>
            <span>Table {order.tableNumber}</span>
            <span> - {order.server} - </span>
            <span>{timeOrderPlaced}</span>
          </span>
        </span>
      </div>

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
