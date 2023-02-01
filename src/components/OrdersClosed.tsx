import { motion } from "framer-motion";
import styles from "../styles/MainScreen.module.css";

export default function OrdersClosed({ order }: { order: OrderDetails }) {
  const handleShowClosedOrder = () => {};

  const timeOrderClosed = new Date(order.timeClosed!).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }).substring(0, 5);
  const timeOrderPlaced = new Date(order.timeOrderPlaced!).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }).substring(0, 5);
  const diff = new Date(order.timeClosed! - order.timeOrderPlaced!).getMinutes();

  const initial = { opacity: 0, scale: 0.9, y: -30 };
  const animate = { opacity: 1, scale: 1, y: 0 };
  const transition = { duration: 0.6 };

  return (
    <motion.div initial={initial} animate={animate} transition={transition} className={styles["single-order-closed"]} onClick={handleShowClosedOrder}>
      <span>
        <div> Table {order.tableNumber}</div>
        <div> {order.server}</div>
        <div>{timeOrderPlaced}</div>
        <div>{timeOrderClosed}</div>
        <div>{diff}</div>
      </span>
    </motion.div>
  );
}
