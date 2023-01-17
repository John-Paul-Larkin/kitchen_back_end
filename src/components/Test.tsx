import db from "../firebase/firebaseconfig";

import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { cursorTo } from "readline";

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

    // const unsubscribe = onSnapshot(q, (snapshot) => {
    //   let data: OrderDetails[] = [];

    //   snapshot.docChanges().forEach((change) => {
    //     if (change.type === "added") {
    //       // console.log("change ", change.doc.data());
    //       const dl = change.doc.data() as OrderDetails;
    //       data.push(dl);
    //       //  setOrders([...data]);
    //     }
    //     if (change.type === "modified") {
    //       console.log("Modified city: ", change.doc.data());
    //     }
    //     if (change.type === "removed") {
    //       console.log("Removed city: ", change.doc.data());
    //     }
    //   });
    //   // console.count();
    //   //   console.log(data);
    //   setOrders((curr) => [...curr, ...data]);
    // });

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let data: OrderDetails[] = [];

      querySnapshot.forEach((doc) => {
        data.push(doc.data() as OrderDetails);
      });
      setOrders([...data]);
    });

    return () => unsubscribe();
  }, []);

  console.log(orders);

  return (
    <div>
      Test
      {orders &&
        orders.map((order) => (
          <div key={order.orderId}>
            {order.tableNumber}
            <div>
              {order.orderItemDetails &&
                order.orderItemDetails.map((item) => {
                  return <div key={item.itemId}>{item.name}</div>;
                })}
            </div>
            <div>------------</div>
          </div>
        ))}
    </div>
  );
}
