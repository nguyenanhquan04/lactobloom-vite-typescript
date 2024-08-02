import React from "react";

interface DateTimeDisplayProps {
    value: number;
    type: string;
}

const DateTimeDisplay: React.FC<DateTimeDisplayProps> = ({ value, type }) => {
    return (
        <span className="cdown">
            {value} <p>{type}</p>
        </span>
    );
};

export default DateTimeDisplay;