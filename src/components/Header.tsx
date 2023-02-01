import { capitalize } from "lodash";
import { useContext } from "react";
import { stationContext } from "../context/StationContext";
import styles from "../styles/Header.module.css";
import Clock from "./Clock";

const stations: Station[] = ["expeditor", "bar", "salad", "fry", "grill"];

export default function Header({ countOfOpenOrders }: { countOfOpenOrders: number }) {
  const { selectedStation, setSelectedStation } = useContext(stationContext);

  const handleStationSelect = (stationToChangeTo: Station) => {
    setSelectedStation(stationToChangeTo);
  };

  return (
    <header className={styles["header-background"]}>
      {stations.map((station) => {
        return (
          <div
            key={station}
            onClick={() => handleStationSelect(station)}
            className={styles[`${station === selectedStation ? "station-button-selected" : "station-button"}`]}
          >
            {capitalize(station)}
          </div>
        );
      })}
      <div className={styles["clock-container"]}>
        <span className={styles["order-count"]}>{countOfOpenOrders} open orders</span>
        <Clock />
      </div>
    </header>
  );
}
