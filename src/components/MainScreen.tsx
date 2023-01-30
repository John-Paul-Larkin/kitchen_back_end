import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import db from "../firebase/firebaseconfig";
import useFirestore from "../hooks/useFirestore";
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

  // console.log("oo", openOrders);
  // console.log("tu", timeUpOrders);

  const sendFirestore = useFirestore();

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

      // const fifteenMinutes = 900000;

      // timeUp.filter((order) => new Date().getTime() - order.timeOrderPlaced! > fifteen);

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
