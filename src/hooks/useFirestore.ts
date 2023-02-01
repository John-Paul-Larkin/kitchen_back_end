import { doc, updateDoc } from "firebase/firestore";
import db from "../firebase/firebaseconfig";

interface FireSetClosedStatus {
  orderID: string;
  type: "setClosed";
}

interface FireSetReadyStatus {
  orderID: string;
  type: "setReady";
}
interface FireSetTimeUp {
  orderID: string;
  type: "setTimeUp";
  currentStatus: OrderStatus;
}

type Firestore = FireSetTimeUp | FireSetReadyStatus | FireSetClosedStatus;

export default function useFirestore() {
  const sendFirestore = async (input: Firestore) => {
    if (input.type === "setTimeUp") {
      if (input.currentStatus === "pending") {
        try {
          await updateDoc(doc(db, "orders", input.orderID), {
            orderStatus: "time up",
            timeTimeUp: new Date().getTime(),
          });
        } catch (error) {
          console.log(error);
        }
      }

      // try {
      //   await updateDoc(doc(db, "orders", input.orderID), {
      //     orderStatus: "ready",
      //     timeReady: new Date().getTime(),
      //   });
      //   console.log('sss')
      // } catch (error) {
      //   console.log(error);
      // }
    } else if (input.type === "setClosed") {
      try {
        await updateDoc(doc(db, "orders", input.orderID), {
          orderStatus: "closed",
          timeClosed: new Date().getTime(),
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return sendFirestore;
}
