import classnames from "classnames";
import React, { useState } from "react";
import { SearchIcon } from "../SearchIcon/SearchIcon";
import { WithClassName } from "../types";

import styles from "./SearchForm.module.css";

type SearchFormProps = {
    onSearch(value: string): void;
    disabled?: boolean;
    placeholder?: string;
} & WithClassName;

// const AUTOCOMPLETE_LIST = ['Grodno', 'Moscow', 'Kiev', 'Miami'];

export const SearchForm: React.FC<SearchFormProps> = ({
    onSearch,
    disabled,
    placeholder,
    className,
}) => {
    const [inputValue, setInputValue] = useState("");

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSearch(inputValue);
            }}
            className={classnames(className, styles.form)}
        >
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={placeholder}
                className={styles.input}
            />

            <button
                disabled={disabled}
                className={styles.button}
                data-testid="search"
            >
                <SearchIcon className={styles.icon} />
            </button>
        </form>
    );
};
