import classnames from "classnames";
import React from "react";
import { Card } from "../Card/Card";
import { CurrentDayData, LocationData, WithClassName } from "../types";

import styles from "./CurrentDay.module.css";

type CurrentDayProps = {
    day?: CurrentDayData | null;
    location?: LocationData | null;
} & WithClassName;

export const CurrentDay: React.FC<CurrentDayProps> = ({
    day,
    location,
    className,
}) => {
    if (day == null || location == null) {
        return null;
    }

    return (
        <Card className={classnames(styles.current, className)}>
            <div className={styles.body}>
                <p className={styles.data}>
                    {new Date(day.last_updated_epoch * 1000).toLocaleString(
                        "en-us",
                        {
                            month: "short",
                            day: "numeric",
                            weekday: "long",
                        }
                    )}
                </p>
                <h1 className={styles.city}>{location.name}</h1>
                <p className={styles.data}>{day.temp_c}C˚</p>
                <p className={styles.data}>{day.wind_kph} km/h</p>
            </div>
            <div className={styles.img}>
                <img src={day.condition.icon} alt={day.condition.text} />
            </div>
        </Card>
    );
};
