import React from "react";
import style from "./Controls.scss";
import Button from "./Button";
import { UP, DOWN, LEFT, RIGHT } from "./Directions";
import { READY, RUNNING, INERT, INITIAL } from "./Phases";
import mode from "./PenMode";
import {
    UpIcon,
    PenIcon,
    EraserIcon,
    ResetIcon,
    RunIcon,
    RightIcon,
    LeftIcon,
    DownIcon
} from "./Icons";

class Controls extends React.Component {
    constructor(props) {
        super(props);
    }

    renderInitialStateLoaders() {
        const length = this.props.savedBoards.length;
        const disabled = ![READY, INITIAL].includes(this.props.phase);
        return [...Array(length).keys()].map(i => (
            <button
                key={i}
                disabled={disabled}
                onClick={this.props.loadBoard(i)}
            />
        ));
    }

    onBlur = event => {
        let { value } = event.target;
        value = value < 100 ? 100 : value;
        this.props.changeIntervalDuration(value);
    };

    render() {
        const { phase, shiftCells, run, stop, penMode } = this.props;
        const arrowDisabled = phase !== READY;
        const startDisabled = phase !== READY;
        const resetDisabled = ![READY, RUNNING, INERT].includes(phase);
        const penPressed = penMode === mode.DRAW;
        const eraserPressed = penMode === mode.ERASE;
        return (
            <div>
                Status: {this.props.phase}
                <br />
                <div className={style["toggle"]}>
                    <Button
                        title="[P]lay"
                        pressed={phase === RUNNING}
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
                    Period:{" "}
                    <input
                        type="number"
                        value={this.props.intervalDuration}
                        onChange={this.props.handleIntervalChange}
                        min={100}
                        max={9999}
                        onBlur={this.onBlur}
                    />
                    ms
                </div>
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
                            onClick={this.props.changePenMode(mode.DRAW)}
                        >
                            <PenIcon pressed={penPressed} />
                        </Button>
                        <Button
                            title="[E]raser"
                            round
                            pressed={eraserPressed}
                            onClick={this.props.changePenMode(mode.ERASE)}
                        >
                            <EraserIcon pressed={eraserPressed} />
                        </Button>
                    </div>
                </div>
                <div>{this.renderInitialStateLoaders()}</div>
            </div>
        );
    }
}

export default Controls;
