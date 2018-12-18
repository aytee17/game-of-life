import React from "react";
import style from "./Controls.scss";
import Button from "./Button";
import { ResetIcon, RunIcon } from "./Icons";

const PlayControls = ({
    startPressed,
    startDisabled,
    run,
    resetDisabled,
    stop,
    intervalDuration,
    handleIntervalChange,
    changeIntervalDuration
}) => {
    const lowerLimit = 16;
    function onBlur(event) {
        let { value } = event.target;
        value = value < lowerLimit ? lowerLimit : value;
        changeIntervalDuration(value);
    }

    return (
        <div>
            <div style={{ paddingLeft: "13px", fontSize: "15px" }}>
                Controls
            </div>
            <div className={style["running-controls"]}>
                <div className={style["toggle"]}>
                    <Button
                        title="[P]lay"
                        pressed={startPressed}
                        disabled={startDisabled}
                        onClick={run}
                    >
                        <RunIcon disabled={startDisabled} />
                    </Button>

                    <Button
                        title="[R]eset"
                        disabled={resetDisabled}
                        onClick={stop}
                    >
                        <ResetIcon disabled={resetDisabled} />
                    </Button>
                </div>
                <div>
                    <div style={{ fontSize: "12px" }}>Cycle Every</div>
                    <input
                        className={style["interval"]}
                        type="number"
                        value={intervalDuration}
                        onChange={handleIntervalChange}
                        min={lowerLimit}
                        max={9999}
                        step={10}
                        onBlur={onBlur}
                    />
                    <span> ms</span>
                </div>
            </div>
        </div>
    );
};

export default PlayControls;
