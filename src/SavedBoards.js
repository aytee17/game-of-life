import React from "react";
import style from "./SavedBoards.scss";
import cs from "classnames";
import SavedBoardItem from "./SavedBoardItem";
import ToolTip from "react-tooltip";
import { InfoIcon } from "./Icons";

const SavedBoards = ({ savedBoards, loadBoard, disabled, activeIndex }) => {
    const length = savedBoards.length;
    const classNames = cs(style["saved-boards"], {
        [style["disabled"]]: disabled
    });

    return (
        <div style={{ width: "220px" }}>
            <div className={style["saved-boards-title"]}>
                Previous Boards
                <span
                    className={style["info"]}
                    data-tip="<span style='text-transform:none'><ul style='margin:4px 0;padding-left:16px'><li>Everything you draw will be saved here</li><li>Modifying a saved board will create a new one</li><li>Refreshing the page will erase everything</li></ul></span>"
                    data-html={true}
                >
                    <InfoIcon />
                    <ToolTip place="right" type="dark" effect="solid" />
                </span>
            </div>
            <div className={classNames}>
                {savedBoards.map((board, index) => (
                    <SavedBoardItem
                        key={index}
                        onClick={loadBoard(index)}
                        active={index === activeIndex}
                    >
                        {length - index}
                    </SavedBoardItem>
                ))}
            </div>
        </div>
    );
};

export default SavedBoards;
