import { collection, doc, getDocs, query, where, writeBatch } from "firebase/firestore";
import db from "../firebase/firebaseconfig";

export default function useChangeOrdersStatusOnInintialLoad() {
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
  return () => getDocuments();
}
