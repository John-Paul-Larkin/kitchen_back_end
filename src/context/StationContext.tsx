import { createContext, ReactNode, useState } from "react";

export default function StationContext({ children }: { children: ReactNode }) {
  const [selectedStation, setSelectedStation] = useState<Station>("expeditor");

  const contextValues = {
    selectedStation,
    setSelectedStation,
  };

  return <stationContext.Provider value={contextValues}>{children}</stationContext.Provider>;
}

export const stationContext = createContext({} as ContextProvider);
