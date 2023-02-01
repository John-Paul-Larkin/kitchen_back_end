import { motion } from "framer-motion";
import { useEffect } from "react";
import { useTimer } from "react-timer-hook";
import useFirestore from "../hooks/useFirestore";
import styles from "../styles/MainScreen.module.css";
import Stopwatch from "./Stopwatch";

export default function OrdersReady({ order }: { order: OrderDetails }) {
  const fiveMinutes = 300000;
  const sendFirestore = useFirestore();

  // sets a timer which automatically moves the order status to closed after 5 minutes
  // if the user has not clicked the button
  const timeToAutoSwitchToReady = new Date(order.timeReady! + fiveMinutes);
  useTimer({
    expiryTimestamp: timeToAutoSwitchToReady,
    onExpire: () => {
      sendFirestore({ orderID: order.orderId, type: "setClosed" });
    },
  });

  // button which sets order status to closed
  const handleOrderUpClick = () => {
    sendFirestore({ orderID: order.orderId, type: "setClosed" });
  };

  //Starts the stopwatch from the moment the timer ends
  const swStartTime = new Date(order.timeTimeUp!);

  const initial = { opacity: 0, scale: 0.9, x: -20 };
  const animate = { opacity: 1, scale: 1, x: 0 };
  const exit = { opacity: 0, scale: 0.9, y: 30 };
  const transition = { duration: 1 };

  return (
    <motion.div exit={exit} transition={transition} initial={initial} animate={animate} className={styles["single-order-ready"]}>
      <Stopwatch startTime={swStartTime} />
      <span>
        Table {order.tableNumber}
        <span> - {order.server}</span>
      </span>

      <button className={styles["ready-button"]} onClick={handleOrderUpClick}>
        Order gone
      </button>
    </motion.div>
  );
}
