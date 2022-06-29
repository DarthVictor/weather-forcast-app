import classnames from "classnames";
import React from "react";
import { Card } from "../Card/Card";
import { ForecastDayData, WithClassName } from "../types";

import styles from "./Forecast.module.css";

type ForecastProps = {
    forecast?: ForecastDayData[] | null;
} & WithClassName;

export const Forecast: React.FC<ForecastProps> = ({ forecast, className }) => {
    if (forecast == null || forecast.length === 0) {
        return null;
    }

    return (
        <Card className={classnames(styles.forecast, className)}>
            {forecast.map(({ day, date_epoch }) => (
                <div key={date_epoch} className={styles.day}>
                    <p className={styles.data}>
                        {new Date(date_epoch * 1000).toLocaleString("en-us", {
                            month: "short",
                            day: "numeric",
                        })}
                    </p>

                    <div className={styles.img}>
                        <img
                            src={day.condition.icon}
                            alt={day.condition.text}
                        />
                    </div>
                    <p className={styles.data}>min {day.mintemp_c}C˚</p>
                    <p className={styles.data}>max {day.maxtemp_c}C˚</p>
                </div>
            ))}
        </Card>
    );
};
