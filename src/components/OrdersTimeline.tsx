import { useEffect, useRef, useState } from "react";
import styles from "../styles/MainScreen.module.css";
import OrdersPending from "./OrdersPending";

export default function OrdersTimeline({
  openOrders,
  countOfTimeUp,
  tablesWithMultipleOrders,
}: {
  openOrders: OrderDetails[];
  countOfTimeUp: number;
  tablesWithMultipleOrders: MultipleTable[];
}) {
  const containerRef = useRef<HTMLInputElement | null>(null);

  const widthOfTimeUpContainer = countOfTimeUp * 190;
  const [width, setWidth] = useState(0);

  const numberOfOrders = openOrders.length;
  const remainingSpace = width - numberOfOrders * 190;

  const [gapsInPixels, setGapsInPixels] = useState<number[]>([]);

  useEffect(() => {
    let gapTime: number[] = [];

    const intervalID = setInterval(() => {
      let totalTime = 0;
      openOrders.forEach((order, index) => {
        const timeNow = new Date().getTime();

        const timeInterval = Math.floor((timeNow - order.timeOrderPlaced!) / 1000);
        if (index === 0) {
          gapTime.push(timeInterval);
          totalTime = timeInterval;
        } else {
          gapTime.push(timeInterval - totalTime);
          totalTime += timeInterval - totalTime;
        }
      });

      const gapTimeAsPercentage = gapTime.map((gap) => (gap / 600) * 100);
      const gapAsPixels = gapTimeAsPercentage.map((gapTime) => (remainingSpace * gapTime) / 100);

      setGapsInPixels([...gapAsPixels]);

      gapTime = [];
    }, 1500);

    return () => clearInterval(intervalID);
  }, [openOrders, remainingSpace]);

  useEffect(() => {
    const widthOfReadySidePanel100px = 0; //Necessary??????????

    const handleResize = () => {
      if (containerRef.current?.clientWidth) {
        setWidth(containerRef.current.clientWidth - widthOfReadySidePanel100px);
      }
    };
    if (containerRef.current?.clientWidth) {
      setWidth(containerRef.current.clientWidth - widthOfReadySidePanel100px);
    }

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [widthOfTimeUpContainer]);

  let gap = 0;

  const openOrdersWithGap = openOrders.map((orders, index) => {
    if (index === 0) {
      gap += gapsInPixels[index];
    } else {
      gap += gapsInPixels[index] + 190;
    }

    return { ...orders, gapInPixels: gap };
  });

  return (
    <div ref={containerRef} className={styles["open-orders-wrapper"]}>
      <div>
        {openOrdersWithGap &&
          openOrdersWithGap.map((order) => <OrdersPending key={order.orderId} order={order} tablesWithMultipleOrders={tablesWithMultipleOrders} />)}
      </div>
    </div>
  );
}
