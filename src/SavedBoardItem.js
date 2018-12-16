import React from "react";
import style from "./SavedBoardItem.scss";

const SavedBoardItem = ({ children }) => {
    return <div className={style["item"]}>{children}</div>;
};

export default SavedBoardItem;
