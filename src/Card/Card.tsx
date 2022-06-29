import classNames from "classnames";
import { forwardRef } from "react";

import styles from "./Card.module.css";

export const Card = forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div className={classNames(className, styles.card)} {...props} ref={ref} />
));
