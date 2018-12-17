import React from "react";
import style from "./SavedBoards.scss";
import cs from "classnames";
import SavedBoardItem from "./SavedBoardItem";

const SavedBoards = ({ savedBoards, loadBoard, disabled, activeIndex }) => {
    const length = savedBoards.length;
    const classNames = cs(style["saved-boards"], {
        [style["disabled"]]: disabled
    });

    return (
        <div style={{ width: "220px" }}>
            <div className={style["saved-boards-title"]}>Previous Boards</div>
            <div className={classNames}>
                {length > 0 ? (
                    savedBoards.map((board, index) => (
                        <SavedBoardItem
                            key={index}
                            onClick={loadBoard(index)}
                            active={index === activeIndex}
                        >
                            {length - index}
                        </SavedBoardItem>
                    ))
                ) : (
                    <div style={{ fontSize: "13px" }}>
                        <ul>
                            <li>Everything you draw will be saved here.</li>
                            <li>
                                Modifying a saved board will create a new one.
                            </li>
                            <li>Refreshing the page will erase everything.</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedBoards;
