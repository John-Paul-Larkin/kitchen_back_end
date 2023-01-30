import styles from "../styles/MainScreen.module.css";

export default function OrdersClosed({ order }: { order: OrderDetails }) {
  const handleShowClosedOrder = () => {};

  const timeOrderClosed = new Date(order.timeClosed!).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }).substring(0, 5);

  console.log("toc", timeOrderClosed);

  return (
    <div className={styles["single-order-closed"]} onClick={handleShowClosedOrder}>
      <span>
        <div> Table {order.tableNumber}</div>
        <div> {order.server}</div>
        <div>{timeOrderClosed}</div>
      </span>
    </div>
  );
}
