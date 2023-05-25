import { collection, onSnapshot, query } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import db from "../firebase/firebaseconfig";
import useChangeOrdersStatusOnInintialLoad from "../hooks/useChangeOrdersStatusOnInintialLoad";
import styles from "../styles/MainScreen.module.css";
import Header from "./Header";
import OrdersClosed from "./OrdersClosed";
import OrdersReady from "./OrdersReady";
import OrdersTimeUp from "./OrdersTimeUp";
import OrdersTimeline from "./OrdersTimeline";

export default function MainScreen() {
  const [openOrders, setOpenOrders] = useState<OrderDetails[]>([]);
  const [timeUpOrders, setTimeUpOrders] = useState<OrderDetails[]>([]);
  const [readyOrders, setReadyOrders] = useState<OrderDetails[]>([]);
  const [closedOrders, setClosedOrders] = useState<OrderDetails[]>([]);
  const [tablesWithMultipleOrders, settablesWithMultipleOrders] = useState<MultipleTable[]>([]);
  const [showNoOrdersMessage, setShowNoOrdersMessage] = useState(false);

  const changeOrdersStatusOnInintialLoad = useChangeOrdersStatusOnInintialLoad();
  useEffect(() => {
    // Queries all the open orders and updates the timing status. ie closes time out orders,
    // or moves open orders to ready, depending on the elapsed time since app was last run.
    changeOrdersStatusOnInintialLoad();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // sets a listener for any new orders
    // splits the orders by timing status, and sets state for each group
    const q = query(collection(db, "orders"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let orders: OrderDetails[] = [];
      querySnapshot.forEach((doc) => {
        orders.push(doc.data() as OrderDetails);
      });

      const open = orders.filter((order) => order.orderStatus === "pending").sort((a, b) => b.timeOrderPlaced! - a.timeOrderPlaced!);
      const timeUp = orders.filter((order) => order.orderStatus === "time up").sort((a, b) => b.timeTimeUp! - a.timeTimeUp!);
      const ready = orders.filter((order) => order.orderStatus === "ready").sort((a, b) => b.timeReady! - a.timeReady!);
      const closed = orders.filter((order) => order.orderStatus === "closed").sort((a, b) => b.timeClosed! - a.timeClosed!);

      if (open.length > 0 || timeUp.length > 0 || ready.length > 0) {
       // If there are no open orders we should display a message
      // linking the user to the POS app.
        setShowNoOrdersMessage(true);
      }

      setOpenOrders([...open]);
      setTimeUpOrders([...timeUp]);
      setReadyOrders([...ready]);
      setClosedOrders([...closed]);
      settablesWithMultipleOrders(checkForMultipleOrdersOnSingleTable({ orders }));
    });

    return () => unsubscribe();
  }, []);

  const initial = { height: "auto" };
  const animate = { height: "auto", opacity: 1 };
  const transition = { duration: 4 };

  const countOfOpenOrders = openOrders.length + timeUpOrders.length + readyOrders.length;

  return (
    <div className={styles["main-screen"]}>
      <Header countOfOpenOrders={countOfOpenOrders} />
      <div className={styles["orders-wrapper"]}>
        <OrdersTimeline showNoOrdersMessage={showNoOrdersMessage} openOrders={openOrders} countOfTimeUp={timeUpOrders.length} tablesWithMultipleOrders={tablesWithMultipleOrders} />
        <div className={styles["timeup-orders-wrapper"]}>
          <AnimatePresence>
            {timeUpOrders &&
              timeUpOrders.map((order) => <OrdersTimeUp tablesWithMultipleOrders={tablesWithMultipleOrders} key={order.orderId} order={order} />)}
          </AnimatePresence>
        </div>
        <div className={styles["ready-closed-sidebar"]}>
          <div className={styles["ready-orders-heading"]}>Ready orders</div>
          <div className={styles["ready-list"]}>
            <AnimatePresence>{readyOrders && readyOrders.map((order) => <OrdersReady key={order.orderId} order={order} />)}</AnimatePresence>
          </div>
          <motion.div initial={initial} animate={animate} transition={transition} className={styles["closed-orders-sidebar"]}>
            <div className={styles["closed-orders-heading"]}>Closed orders</div>
            {closedOrders && closedOrders.map((order) => <OrdersClosed key={order.orderId} order={order} />)}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function checkForMultipleOrdersOnSingleTable({ orders }: { orders: OrderDetails[] }) {
  // iterates through all the open orders, finds tables which have multiple orders
  // and for each table returns an object with the table number and a colour
  // which will be displayed as an indicator to the user

  let tables = orders.filter((order) => order.orderStatus !== "closed").map((order) => order.tableNumber);
  const tableSet = new Set<string>();
  const colors = ["yellow", "red", "blue", "green", "white", "orange", "pink", "brown", "coral", "cyan"];

  tables.sort().forEach((tableNumber, index, arr) => {
    if (index < arr.length && tableNumber === arr[index + 1]) {
      tableSet.add(tableNumber);
    }
  });

  return [...Array.from(tableSet)].map((tableNumber, index) => {
    return {
      tableNumber: tableNumber,
      color: colors[index],
    };
  });
}
