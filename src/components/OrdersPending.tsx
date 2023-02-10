import { useContext } from "react";
import { stationContext } from "../context/StationContext";
import useFirestore from "../hooks/useFirestore";
import styles from "../styles/MainScreen.module.css";
import Items from "./Items";
import Timer from "./Timer";

interface orderDetailsWithGap extends OrderDetails {
  gapInPixels: number;
}

export default function OrdersPending({
  order,
  tablesWithMultipleOrders,
}: {
  order: orderDetailsWithGap;
  tablesWithMultipleOrders: MultipleTable[];
}) {
  const { selectedStation } = useContext(stationContext);

  let itemsToDisplay = order.orderItemDetails;

  // Sorts the order to display a particular stations items at the top
  // no bar items on kitchen docket
  // no food items on bar docket

  if (selectedStation === "bar") {
    itemsToDisplay = itemsToDisplay.filter((item) => item.station === "bar");
  } else if (selectedStation !== "expeditor") {
    itemsToDisplay = itemsToDisplay.filter((item) => item.station !== "bar");
    // Sorts the order to display a particular stations items at the top
    itemsToDisplay.sort((a, b) => {
      return Number(b.station === selectedStation) - Number(a.station === selectedStation);
    });
  } else if (selectedStation === "expeditor") {
    itemsToDisplay.sort((a, b) => {
      //display drinks at the bottom for the expeditor
      return Number(a.station === "bar") - Number(b.station === "bar");
    });
  }

  const tenMinutes = 600000;
  const timerFinishTime = new Date(order.timeOrderPlaced! + tenMinutes);
  const timeOrderPlaced = new Date(order.timeOrderPlaced!).toLocaleTimeString().substring(0, 5);

  // button which sets order status to ready
  const sendFirestore = useFirestore();
  const handleOrderUpClick = () => {
    sendFirestore({ orderID: order.orderId, type: "setReadyFromPending" });

    // sendFirestore({ orderID: order.orderId, type: "setTimeUp", currentStatus: order.orderStatus });
  };

  // if this is order is on a table with mutiple orders
  // display a colored dot identifying it as such
  let isMultipleTables = false;
  let multipleTableDotColor = "";
  tablesWithMultipleOrders.forEach((table) => {
    if (table.tableNumber === order.tableNumber) {
      isMultipleTables = true;
      multipleTableDotColor = table.color;
    }
  });

  return (
    <>
      {itemsToDisplay.length > 0 && (
        <div className={styles["single-order-pending"]} style={{ left: order.gapInPixels }}>
          <div className={styles["single-order-header"]}>
            <div className={styles["order-timer"]}>
              {isMultipleTables && (
                <div
                  className={styles["dot"]}
                  style={{
                    backgroundColor: multipleTableDotColor,
                  }}
                ></div>
              )}
              <Timer finishTime={timerFinishTime} order={order} />
            </div>
            <span className={styles["order-table"]}>
              <span>
                <span>Table {order.tableNumber}</span>
                <span> - {order.server} - </span>
                <span>{timeOrderPlaced}</span>
              </span>
            </span>
          </div>
          {itemsToDisplay &&
            itemsToDisplay.map((item) => {
              return (
                <div key={item.itemId}>
                  {" "}
                  <Items item={item} />
                </div>
              );
            })}
          <button className={styles["ready-button"]} onClick={handleOrderUpClick}>
            Order up
          </button>
        </div>
      )}
    </>
  );
}
