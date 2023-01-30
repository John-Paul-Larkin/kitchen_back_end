import styles from "../styles/MainScreen.module.css";

export default function OrdersClosed({ order }: { order: OrderDetails }) {
  const handleShowClosedOrder = () => {};

  return (
    <div className={styles["single-order-closed"]} onClick={handleShowClosedOrder}>
      <span>
        <span> Table {order.tableNumber}</span>
        <span> - {order.server}</span>
      </span>
    </div>
  );
}
