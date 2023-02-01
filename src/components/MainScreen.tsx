import { collection, doc, getDocs, onSnapshot, query, where, writeBatch } from "firebase/firestore";
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
    function changeOrdersStatusOnInintialLoad(orders: OrderDetails[]) {
      const timeNow = new Date().getTime();
      const fiveMinutes = 300000;
      const tenMinutes = 600000;
      const fifteenMinutes = 900000;
      const twentyMinutes = 1200000;

      const batch = writeBatch(db);

      orders.forEach((order) => {
        const docRef = doc(db, "orders", order.orderId);

        switch (order.orderStatus) {
          case "pending": {
            if (timeNow - order.timeOrderPlaced! > twentyMinutes) {
              //set time out - ready and closed
              batch.update(docRef, {
                orderStatus: "closed",
                timeTimeUp: order.timeOrderPlaced! + tenMinutes,
                timeReady: order.timeOrderPlaced! + fifteenMinutes,
                timeClosed: order.timeOrderPlaced! + twentyMinutes,
              });
            } else if (timeNow - order.timeOrderPlaced! > fifteenMinutes) {
              //set time out - ready
              batch.update(docRef, {
                orderStatus: "ready",
                timeTimeUp: order.timeOrderPlaced! + tenMinutes,
                timeReady: order.timeOrderPlaced! + fifteenMinutes,
              });
            } else if (timeNow - order.timeOrderPlaced! > tenMinutes) {
              //set time out
              batch.update(docRef, {
                orderStatus: "time up",
                timeTimeUp: order.timeOrderPlaced! + tenMinutes,
              });
            }
            break;
          }
          case "time up": {
            if (timeNow - order.timeTimeUp! > tenMinutes) {
              //set ready and closed
              batch.update(docRef, {
                orderStatus: "closed",
                timeReady: order.timeTimeUp! + fiveMinutes,
                timeClosed: order.timeTimeUp! + tenMinutes,
              });
            } else if (timeNow - order.timeTimeUp! > fiveMinutes) {
              //set ready
              batch.update(docRef, {
                orderStatus: "ready",
                timeReady: order.timeTimeUp! + fiveMinutes,
              });
            }

            break;
          }
          case "ready": {
            if (timeNow - order.timeReady! > fiveMinutes) {
              // set closed
              batch.update(docRef, {
                orderStatus: "closed",
                timeClosed: order.timeReady! + fiveMinutes,
              });
            }
            break;
          }
          default:
            console.log("shouldnt get here");
        }
      });

      batch
        .commit()
        .then(() => console.log("ok"))
        .then((error) => console.log("FB batch error", error));
    }

    const getDocuments = async () => {
      const orders: OrderDetails[] = [];
      const q = query(collection(db, "orders"), where("orderStatus", "!=", "closed"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        orders.push(doc.data() as OrderDetails);
      });
      if (orders.length > 0) {
        changeOrdersStatusOnInintialLoad(orders);
      }
    };
    getDocuments();
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
