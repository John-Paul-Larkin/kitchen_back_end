import { collection, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import db from "../firebase/firebaseconfig";
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

  useEffect(() => {
    // const q = query(collection(db, "orders"), where("orderStatus", "==", "pending"));
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

  return (
    <div className={styles["main-screen"]}>
      <Header />
      <div className={styles["orders-wrapper"]}>
        <OrdersTimeline openOrders={openOrders} countOfTimeUp={timeUpOrders.length} />
        <div className={styles["timeup-orders-wrapper"]}>
          {timeUpOrders && timeUpOrders.map((order) => <OrdersTimeUp key={order.orderId} order={order} />)}
        </div>
        <div className={styles["ready-closed-sidebar"]}>
          <div className={styles["ready-orders-heading"]}>Ready orders</div>
          <div className={styles["ready-list"]}>{readyOrders && readyOrders.map((order) => <OrdersReady key={order.orderId} order={order} />)}</div>

          <div className={styles["closed-orders-sidebar"]}>
            <div className={styles["closed-orders-heading"]}>Closed orders</div>
            {closedOrders && closedOrders.map((order) => <OrdersClosed key={order.orderId} order={order} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
