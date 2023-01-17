import db from "../firebase/firebaseconfig";

import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import Orders from "./Orders";

export default function Test() {
  // const unsub = onSnapshot(doc(db, "orders"), (doc) => {
  //   console.log("Current data: ", doc.data());
  // });

  //   const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //     console.log("new");
  //     querySnapshot.forEach((doc) => {
  //       console.log(doc.data());
  //       //   time.push(doc.data().timeOrderPlaced);
  //     });
  //   });

  const [orders, setOrders] = useState<OrderDetails[]>([]);

  useEffect(() => {
    const q = query(collection(db, "orders"), where("orderStatus", "==", "pending"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let openOrders: OrderDetails[] = [];

      querySnapshot.forEach((doc) => {
        openOrders.push(doc.data() as OrderDetails);
      });

      setOrders([...openOrders]);
    });

    return () => unsubscribe();
  }, []);

  return <div>{orders && orders.map((order) => <Orders key={order.orderId} order={order} />)}</div>;
}
