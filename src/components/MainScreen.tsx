import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
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

  // const sendFirestore = useFirestore();
  // function changeTimeStatusOnInintialLoad({ timeUp, ready, open }: { timeUp: OrderDetails[]; ready: OrderDetails[]; open: OrderDetails[] }) {
  //   console.log("here");
  //   const fiveMinutes = 300000;
  //   const tenMinutes = 600000;

  //   const timeNow = new Date().getTime();

  //   open
  //     .filter((order) => order.timeOrderPlaced! - timeNow > tenMinutes)
  //     .forEach((order) => {
  //       sendFirestore({ orderID: order.orderId, timeOrderPlaced: order.timeOrderPlaced!, type: "setTimeUpOnInit" });
  //     });
  //   timeUp
  //     .filter((order) => order.timeTimeUp! - timeNow > fiveMinutes)
  //     .forEach((order) => {
  //       sendFirestore({ orderID: order.orderId, type: "setReady" });
  //     });
  //   ready
  //     .filter((order) => order.timeReady! - timeNow > fiveMinutes)
  //     .forEach((order) => {
  //       sendFirestore({ orderID: order.orderId, type: "setClosed" });
  //     });
  // }

  useEffect(() => {
    function changeOrdersStatusOnInintialLoad(orders: OrderDetails[]) {
      const timeNow = new Date().getTime();
      const fiveMinutes = 300000;
      const tenMinutes = 600000;
      const fifteenMinutes = 900000;
      const twentyMinutes = 1200000;

      orders.forEach((order) => {
        if (order.orderStatus === "pending") {
          if (timeNow - order.timeOrderPlaced! > twentyMinutes) {
            //set time out - ready and closed
          } else if (timeNow - order.timeOrderPlaced! > fifteenMinutes) {
            //set time out - ready
          } else if (timeNow - order.timeOrderPlaced! > tenMinutes) {
            //set time out
          }
        } else if (order.orderStatus === "time up") {
          if (timeNow - order.timeTimeUp! > tenMinutes) {
            //set ready and closed
          } else if (timeNow - order.timeTimeUp! > fiveMinutes) {
            //set ready
          }
        } else if (order.orderStatus === "ready") {
          if (timeNow - order.timeReady! > fiveMinutes) {
            // set closed
          }
        }
      });
    }

    const orders: OrderDetails[] = [];

    const getDocuments = async () => {
      const q = query(collection(db, "orders"), where("orders", "!=", "closed"));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        orders.push(doc.data() as OrderDetails);
      });
    };
    getDocuments();
    changeOrdersStatusOnInintialLoad(orders);
  }, []);


  

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

      // changeTimeStatusOnInintialLoad({ open, timeUp, ready });

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
