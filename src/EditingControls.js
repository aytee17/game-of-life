import React from "react";
import style from "./Controls.scss";
import Button from "./Button";
import { UP, DOWN, LEFT, RIGHT } from "./Directions";
import mode from "./PenMode";
import {
    UpIcon,
    PenIcon,
    EraserIcon,
    RightIcon,
    LeftIcon,
    DownIcon
} from "./Icons";

const EditingControls = ({
    arrowDisabled,
    shiftCells,
    changePenMode,
    penPressed,
    eraserPressed
}) => {
    return (
        <div>
            <div style={{ paddingLeft: "13px", fontSize: "15px" }}>Editing</div>
            <div className={style["keys"]}>
                <Button
                    title="[←] Shift cells left"
                    disabled={arrowDisabled}
                    onClick={shiftCells(LEFT)}
                >
                    <LeftIcon disabled={arrowDisabled} />
                </Button>
                <Button
                    title="[↓] Shift cells down"
                    disabled={arrowDisabled}
                    onClick={shiftCells(DOWN)}
                >
                    <DownIcon disabled={arrowDisabled} />
                </Button>
                <Button
                    title="[↑] Shift cells up"
                    disabled={arrowDisabled}
                    onClick={shiftCells(UP)}
                >
                    <UpIcon disabled={arrowDisabled} />
                </Button>
                <Button
                    title="[→] Shift cells right"
                    disabled={arrowDisabled}
                    onClick={shiftCells(RIGHT)}
                >
                    <RightIcon disabled={arrowDisabled} />
                </Button>
            </div>
            <div>
                <div className={style["toggle"]}>
                    <Button
                        title="[D]raw"
                        round
                        pressed={penPressed}
                        onClick={changePenMode(mode.DRAW)}
                    >
                        <PenIcon pressed={penPressed} />
                    </Button>
                    <Button
                        title="[E]raser"
                        round
                        pressed={eraserPressed}
                        onClick={changePenMode(mode.ERASE)}
                    >
                        <EraserIcon pressed={eraserPressed} />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default EditingControls;
