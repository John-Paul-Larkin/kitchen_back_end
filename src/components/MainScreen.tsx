import { collection, onSnapshot, query } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import db from "../firebase/firebaseconfig";
import useChangeOrdersStatusOnInintialLoad from "../hooks/useChangeOrdersStatusOnInintialLoad";
import styles from "../styles/MainScreen.module.css";
import Header from "./Header";
import OrdersClosed from "./OrdersClosed";
import OrdersReady from "./OrdersReady";
import OrdersTimeline from "./OrdersTimeline";
import OrdersTimeUp from "./OrdersTimeUp";

export default function MainScreen() {
  const [openOrders, setOpenOrders] = useState<OrderDetails[]>([]);
  const [timeUpOrders, setTimeUpOrders] = useState<OrderDetails[]>([]);
  const [readyOrders, setReadyOrders] = useState<OrderDetails[]>([]);
  const [closedOrders, setClosedOrders] = useState<OrderDetails[]>([]);

  const changeOrdersStatusOnInintialLoad = useChangeOrdersStatusOnInintialLoad();
  useEffect(() => {
    // Runs only once, when the app initializes. Queries all the open orders
    // and updates the timing status. ie closes time out orders,
    // or moves open orders to ready, depending on the time scale
    // since app was last run.
    changeOrdersStatusOnInintialLoad();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
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

      setOpenOrders([...open]);
      setTimeUpOrders([...timeUp]);
      setReadyOrders([...ready]);
      setClosedOrders([...closed]);
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
        <OrdersTimeline openOrders={openOrders} countOfTimeUp={timeUpOrders.length} />
        <div className={styles["timeup-orders-wrapper"]}>
          <AnimatePresence>{timeUpOrders && timeUpOrders.map((order) => <OrdersTimeUp key={order.orderId} order={order} />)}</AnimatePresence>
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
