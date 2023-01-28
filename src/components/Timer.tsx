import { useTimer } from "react-timer-hook";

export default function Timer({
  setIsShowStopWatch,
  finishTime,
}: {
  setIsShowStopWatch: React.Dispatch<React.SetStateAction<boolean>>;
  finishTime: Date;
}) {
  const { seconds, minutes } = useTimer({
    expiryTimestamp: finishTime,
    onExpire: () => {
      setIsShowStopWatch(true);
    },
  });


  let extraDigit:null|string = null;

  if(seconds < 10 ) {
    extraDigit = '0'
  }

  return (
    <div>
      {minutes}:{extraDigit}{seconds}
    </div>
  );
}
