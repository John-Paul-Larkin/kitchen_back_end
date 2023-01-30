import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import db from "../firebase/firebaseconfig";
import styles from "../styles/MainScreen.module.css";
import Header from "./Header";
import OrdersClosed from "./OrdersClosed";
import OrdersReady from "./OrdersReady";
import OrdersTimeline from "./OrdersTimeline";
import Orders from "./OrdersTimeUp";

export default function MainScreen() {
  const [openOrders, setOpenOrders] = useState<OrderDetails[]>([]);
  const [timeUpOrders, setTimeUpOrders] = useState<OrderDetails[]>([]);
  const [readyOrders, setReadyOrders] = useState<OrderDetails[]>([]);
  const [closedOrders, setClosedOrders] = useState<OrderDetails[]>([]);

  console.log("oo", openOrders);
  console.log("tu", timeUpOrders);

  // const openOrders = useAppSelector(state=>state.openOrders)
  // const dispatch = useAppDispatch()

  useEffect(() => {
    // const q = query(collection(db, "orders"), where("orderStatus", "==", "pending"));
    const q = query(collection(db, "orders"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let orders: OrderDetails[] = [];

      querySnapshot.forEach((doc) => {
        orders.push(doc.data() as OrderDetails);
      });

      // const open = orders.filter((order) => order.timeOrderPlaced! + 600000 > new Date().getTime());
      const open = orders.filter((order) => order.orderStatus === "pending");
      const timeUp = orders.filter((order) => order.orderStatus === "time up");
      const ready = orders.filter((order) => order.orderStatus === "ready");
      const closed = orders.filter((order) => order.orderStatus === "closed");

      open.sort((a, b) => {
        return b.timeOrderPlaced! - a.timeOrderPlaced!;
      });

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
        {/* <div className={styles["open-orders-wrapper"]}>{openOrders && openOrders.map((order) => <Orders key={order.orderId} order={order} />)}</div> */}
        <div className={styles["timeup-orders-wrapper"]}>
          {timeUpOrders && timeUpOrders.map((order) => <Orders key={order.orderId} order={order} />)}
        </div>
        <div className={styles["ready-orders-wrapper"]}>
          {readyOrders && readyOrders.map((order) => <OrdersReady key={order.orderId} order={order} />)}
          {closedOrders && closedOrders.map((order) => <OrdersClosed key={order.orderId} order={order} />)}
        </div>
      </div>
    </div>
  );
}
