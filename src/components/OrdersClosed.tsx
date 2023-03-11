import { motion } from "framer-motion";
import { useState } from "react";
import styles from "../styles/MainScreen.module.css";
import Items from "./Items";

export default function OrdersClosed({ order }: { order: OrderDetails }) {
  const timeOrderClosed = new Date(order.timeClosed!).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }).substring(0, 5);
  const timeOrderPlaced = new Date(order.timeOrderPlaced!).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }).substring(0, 5);
  const diff = new Date(order.timeClosed! - order.timeOrderPlaced!).getMinutes();

  const initial = { opacity: 0, scale: 0.9, y: -30 };
  const animate = { opacity: 1, scale: 1, y: 0 };
  const transition = { duration: 0.6 };

  const [isShowDetails, setIsShowDetails] = useState(false);

  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={transition}
      className={styles["single-order-closed"]}
      onHoverStart={() => setIsShowDetails(true)}
      onHoverEnd={() => setIsShowDetails(false)}
    >
      <span>
        <div> Table {order.tableNumber}</div>
        <div> {order.server}</div>
        <div>Placed - {timeOrderPlaced}</div>
        <div>Closed - {timeOrderClosed}</div>
        <div>{diff}</div>
      </span>
      {isShowDetails && (
        <div className={styles["closed-order-hover"]}>
          <div> Table {order.tableNumber}</div>
          <div> {order.server}</div>
          <div>Order placed at - {timeOrderPlaced}</div>
          <div>Order closed at - {timeOrderClosed}</div>
          <div>{diff}</div>
          {order.orderItemDetails &&
            order.orderItemDetails.map((item) => {
              return (
                <div key={item.itemId}>
                  {" "}
                  <Items item={item} />
                </div>
              );
            })}
        </div>
      )}
    </motion.div>
  );
}
