import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import db from "../firebase/firebaseconfig";
import styles from "../styles/MainScreen.module.css";
import Header from "./Header";
import Orders from "./Orders";
import OrdersTimeline from "./OrdersTimeline";

export default function MainScreen() {
  const [openOrders, setOpenOrders] = useState<OrderDetails[]>([]);
  const [timeUpOrders, setTimeUpOrders] = useState<OrderDetails[]>([]);

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

      console.log(orders);

      // const open = orders.filter((order) => order.timeOrderPlaced! + 600000 > new Date().getTime());
      const open = orders.filter((order) => order.orderStatus === "pending");

      // const timeUp = orders.filter((order) => order.timeOrderPlaced! + 600000 < new Date().getTime());
      const timeUp = orders.filter((order) => order.orderStatus === "time up");

      open.sort((a, b) => {
        return b.timeOrderPlaced! - a.timeOrderPlaced!;
      });

      console.log("tuu", timeUp);

      setOpenOrders([...open]);
      setTimeUpOrders([...timeUp]);
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
      </div>
    </div>
  );
}
