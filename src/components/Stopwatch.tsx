import { differenceInSeconds } from "date-fns";
import { useStopwatch } from "react-timer-hook";

export default function Stopwatch({ startTime }: { startTime: Date }) {
  const stopwatchOffset = new Date();
  const timeNow = new Date();

  stopwatchOffset.setSeconds(stopwatchOffset.getSeconds() + differenceInSeconds(timeNow, startTime));

  const { seconds, minutes } = useStopwatch({ autoStart: true, offsetTimestamp: stopwatchOffset });

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
