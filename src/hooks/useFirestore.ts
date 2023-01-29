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
interface FireUpdateStatus {
  orderID: string;
  type: "updateStatus";
  currentStatus: OrderStatus;
}

type Firestore = FireUpdateStatus | FireSetReadyStatus | FireSetClosedStatus;

export default function useFirestore() {
  const sendFirestore = async (input: Firestore) => {
    if (input.type === "updateStatus") {
      if (input.currentStatus === "pending") {
        try {
          await updateDoc(doc(db, "orders", input.orderID), {
            orderStatus: "time up",
          });
        } catch (error) {
          console.log(error);
        }
      }
    } else if (input.type === "setReady") {
      try {
        await updateDoc(doc(db, "orders", input.orderID), {
          orderStatus: "ready",
        });
      } catch (error) {
        console.log(error);
      }
    } else if (input.type === "setClosed") {
      try {
        await updateDoc(doc(db, "orders", input.orderID), {
          orderStatus: "closed",
        });
      } catch (error) {
        console.log(error);
      }
    }

















  };

  return sendFirestore;
}
