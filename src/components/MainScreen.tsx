import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import db from "../firebase/firebaseconfig";
import styles from "../styles/MainScreen.module.css";
import Header from "./Header";
import Orders from "./Orders";

export default function MainScreen() {
  const [orders, setOrders] = useState<OrderDetails[]>([]);

  useEffect(() => {
    const q = query(collection(db, "orders"), where("orderStatus", "==", "pending"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let openOrders: OrderDetails[] = [];

      querySnapshot.forEach((doc) => {
        openOrders.push(doc.data() as OrderDetails);
      });

      openOrders.sort((a, b) => {
        return a.timeOrderPlaced! - b.timeOrderPlaced!;
      });

      setOrders([...openOrders]);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className={styles["main-screen"]}>
      <Header />
      <div className={styles["orders-wrapper"]}>{orders && orders.map((order) => <Orders key={order.orderId} order={order} />)}</div>
    </div>
  );
}
