import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import db from "../firebase/firebaseconfig";
import styles from "../styles/MainScreen.module.css";
import Header from "./Header";
import Orders from "./Orders";

export default function MainScreen() {
  const [openOrders, setOpenOrders] = useState<OrderDetails[]>([]);
  const [timeUpOrders, setTimeUpOrders] = useState<OrderDetails[]>([]);

  useEffect(() => {
    const q = query(collection(db, "orders"), where("orderStatus", "==", "pending"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let orders: OrderDetails[] = [];

      querySnapshot.forEach((doc) => {
        orders.push(doc.data() as OrderDetails);
      });

      const open = orders.filter((order) => order.timeOrderPlaced! + 600000 > new Date().getTime());
      const timeUp = orders.filter((order) => order.timeOrderPlaced! + 600000 < new Date().getTime());

      // openOrders.sort((a, b) => {
      //   return b.timeOrderPlaced! - a.timeOrderPlaced!;
      // });

      setOpenOrders([...open]);
      setTimeUpOrders([...timeUp]);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className={styles["main-screen"]}>
      <Header />
      <div  className={styles["orders-wrapper"]}>
        <div className={styles["open-orders-wrapper"]}>{openOrders && openOrders.map((order) => <Orders key={order.orderId} order={order} />)}</div>
        <div className={styles["timeup-orders-wrapper"]}>
          {timeUpOrders && timeUpOrders.map((order) => <Orders key={order.orderId} order={order} />)}
        </div>
      </div>
    </div>
  );
}
