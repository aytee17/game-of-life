import React from "react";
import style from "./SavedBoardItem.scss";
import cs from "classnames";

const SavedBoardItem = ({ active, onClick, children }) => {
    const classNames = cs(style["item"], {
        [style["active"]]: active
    });
    return (
        <div className={classNames} onClick={onClick}>
            {children}
        </div>
    );
};

export default SavedBoardItem;
