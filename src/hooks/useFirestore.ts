import { doc, updateDoc } from "firebase/firestore";
import db from "../firebase/firebaseconfig";

interface FireUpdateStatus {
  orderID: string;
  type: "updateStatus";
  currentStatus: OrderStatus;
}

type Firestore = FireUpdateStatus;

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
    }
  };

  return sendFirestore;
}
