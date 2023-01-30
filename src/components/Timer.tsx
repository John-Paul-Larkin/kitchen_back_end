import { useTimer } from "react-timer-hook";
import useFirestore from "../hooks/useFirestore";

export default function Timer({ finishTime, order }: { finishTime: Date; order: OrderDetails }) {
  const sendFirestore = useFirestore();

  const { seconds, minutes } = useTimer({
    expiryTimestamp: finishTime,
    onExpire: () => {
      sendFirestore({ orderID: order.orderId, type: "setTimeUp", currentStatus: order.orderStatus });
    },
  });

   // extra digit for formatting under ten seconds
  let extraDigit: null | string = null;
  if (seconds < 10) {
    extraDigit = "0";
  }

  return (
    <div>
      {minutes}:{extraDigit}
      {seconds}
    </div>
  );
}
