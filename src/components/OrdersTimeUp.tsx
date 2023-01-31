import { motion } from "framer-motion";
import { useContext, useEffect } from "react";
import { useTimer } from "react-timer-hook";
import { stationContext } from "../context/StationContext";
import useFirestore from "../hooks/useFirestore";
import styles from "../styles/MainScreen.module.css";
import Items from "./Items";
import Stopwatch from "./Stopwatch";

export default function OrdersTimeUp({ order }: { order: OrderDetails }) {
  const sendFirestore = useFirestore();
  const fiveMinutes = 300000;

  // useEffect(() => {
  //   // on initial render, if order has been timeUp for more than five minutes, set the status to ready
  //   const timeNow = new Date().getTime();
  //   if (timeNow - order.timeTimeUp! > fiveMinutes) {
  //     sendFirestore({ orderID: order.orderId, type: "setReady" });
  //   }
  // }, []);

  // sets a timer which automatically moves the order status to ready after 5 minutes
  // if the user has not clicked the button
  const timeToAutoSwitchToReady = new Date(order.timeTimeUp! + fiveMinutes);
  useTimer({
    expiryTimestamp: timeToAutoSwitchToReady,
    onExpire: () => {
      sendFirestore({ orderID: order.orderId, type: "setReady" });
    },
  });

  // Sorts the order to display a particular stations items at the top
  const { selectedStation } = useContext(stationContext);
  order.orderItemDetails.sort((a, b) => {
    return Number(b.station === selectedStation) - Number(a.station === selectedStation);
  });

  // button which sets order status to ready
  const handleOrderUpClick = () => {
    sendFirestore({ orderID: order.orderId, type: "setReady" });
  };

  //Starts the stopwatch from the moment the timer ends
  const swStartTime = new Date(order.timeTimeUp!);

  // const initial = { color: "white" };
  // const animate = { color: "black" };
  // const transition = { repeat: Infinity, duration: 1 };

  return (
    <div className={styles["single-order-timeUp"]}>
      <Stopwatch startTime={swStartTime} />
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
      <span>
        {" "}
        time up - 
        {new Date(order.timeTimeUp!).toLocaleTimeString()}
      </span>
      <span>
        {" "}
        ready -
        {new Date(order.timeReady!).toLocaleTimeString()}
      </span>
    </div>
  );
}

// initial={initial} animate={animate} transition={transition}
