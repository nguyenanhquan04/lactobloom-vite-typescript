import clsx from "clsx";
import React from "react";
import useCountdown from "../../hooks/use-countdown";
import DateTimeDisplay from "./date-time-display"

interface CountdownTimerProps {
    date: string;
    className: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ date, className }) => {
    const [days, hours, minutes, seconds] = useCountdown(date);

    return (
        <div
            className={clsx("timer timer-style", className)}
        >
            <DateTimeDisplay value={days} type="days" />
            <DateTimeDisplay value={hours} type="hours" />
            <DateTimeDisplay value={minutes} type="minutes" />
            <DateTimeDisplay value={seconds} type="secs" />
        </div>
    );
};


export default CountdownTimer;