import { capitalize } from "lodash";
import { useContext } from "react";
import { stationContext } from "../context/StationContext";
import styles from "../styles/Header.module.css";

const stations: Station[] = ["expeditor", "bar", "salad", "fry", "grill"];

export default function Header() {
  const { selectedStation, setSelectedStation } = useContext(stationContext);

  const handleStationSelect = (stationToChangeTo: Station) => {
    setSelectedStation(stationToChangeTo);
  };

  return (
    <header className={styles["header-background"]}>
      {stations.map((station) => {
        return (
          <div
            onClick={() => handleStationSelect(station)}
            className={styles[`${station === selectedStation ? "station-button-selected" : "station-button"}`]}
          >
            {capitalize(station)}
          </div>
        );
      })}
    </header>
  );
}
