import { motion } from "framer-motion";
import { useContext } from "react";
import { useTimer } from "react-timer-hook";
import { stationContext } from "../context/StationContext";
import useFirestore from "../hooks/useFirestore";
import styles from "../styles/MainScreen.module.css";
import Items from "./Items";
import Stopwatch from "./Stopwatch";

export default function OrdersTimeUp({ order, tablesWithMultipleOrders }: { order: OrderDetails; tablesWithMultipleOrders: MultipleTable[] }) {
  const sendFirestore = useFirestore();
  const fiveMinutes = 300000;

  // sets a timer which automatically moves the order status to ready after 5 minutes
  // if the user has not clicked the button
  const timeToAutoSwitchToReady = new Date(order.timeTimeUp! + fiveMinutes);
  useTimer({
    expiryTimestamp: timeToAutoSwitchToReady,
    onExpire: () => {
      sendFirestore({ orderID: order.orderId, type: "setReady" });
    },
  });

  const { selectedStation } = useContext(stationContext);

  let itemsToDisplay = order.orderItemDetails;

  // Sorts the order to display a particular stations items at the top
  // no bar items on kitchen docket - no food items on bar docket etc

  if (selectedStation === "bar") {
    itemsToDisplay = itemsToDisplay.filter((item) => item.station === "bar");
  } else if (selectedStation !== "expeditor") {
    itemsToDisplay = itemsToDisplay.filter((item) => item.station !== "bar");
    // Sorts the order to display a particular stations items at the top
    itemsToDisplay.sort((a, b) => {
      return Number(b.station === selectedStation) - Number(a.station === selectedStation);
    });
  } else if (selectedStation === "expeditor") {
    itemsToDisplay.sort((a, b) => {
      //display drinks at the bottom for the expeditor
      return Number(a.station === "bar") - Number(b.station === "bar");
    });
  }

  // button which sets order status to ready
  const handleOrderUpClick = () => {
    sendFirestore({ orderID: order.orderId, type: "setReady" });
  };

  //Starts the stopwatch from the moment the timer ends
  const swStartTime = new Date(order.timeTimeUp!);

  // const initial = { opacity: 0 };
  // const animate = { opacity: 1 };
  const exit = { opacity: 0, x: 50, height: 120, width: 90 };
  // const transition = { duration: 3 };
  // const transition2 = { duration: 0.1 };
  const transition = { height: { duration: 2 }, width: { duration: 2 }, opacity: { duration: 0.25 } };

  // if this is order is on a table with mutiple orders
  // display a colored dot identifying it as such
  let isMultipleTables = false;
  let multipleTableDotColor = "";
  tablesWithMultipleOrders.forEach((table) => {
    if (table.tableNumber === order.tableNumber) {
      isMultipleTables = true;
      multipleTableDotColor = table.color;
    }
  });

  // initial={initial} animate={animate} exit={exit} transition={transition}

  return (
    <>
      {itemsToDisplay.length > 0 && (
        <motion.div exit={exit} transition={transition} className={styles["single-order-timeUp"]}>
          <div className={styles["timeUp-order-heading"]}>
            {isMultipleTables && (
              <div
                className={styles["dot-time-up"]}
                style={{
                  backgroundColor: multipleTableDotColor,
                }}
              ></div>
            )}
            <div className={styles["order-timer"]}>
              <Stopwatch startTime={swStartTime} />
            </div>
            <span className={styles["order-table"]}>
              <span>
                Table {order.tableNumber}
                <span> - {order.server}</span>
              </span>
            </span>
          </div>
          {itemsToDisplay &&
            itemsToDisplay.map((item) => {
              return (
                <div key={item.itemId}>
                  <Items item={item} />
                </div>
              );
            })}
          <button className={styles["ready-button"]} onClick={handleOrderUpClick}>
            Order up
          </button>
        </motion.div>
      )}
    </>
  );
}
