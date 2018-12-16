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
import Code from "./Code";
import SavedBoardItem from "./SavedBoardItem";
import Status from "./Status";

class Controls extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    onClick = index => event => {
        this.props.savedBoards[index].ref.current.select();
        document.execCommand("copy");
    };

    renderInitialStateLoaders() {
        const length = this.props.savedBoards.length;
        const disabled = ![READY, INITIAL].includes(this.props.phase);
        return (
            <div>
                {this.props.savedBoards.map((el, index) => (
                    <SavedBoardItem key={index} disabled={disabled}>
                        <div onClick={this.props.loadBoard(index)}>
                            {length - index}
                        </div>
                    </SavedBoardItem>
                ))}
            </div>
        );
    }

    onBlur = event => {
        let { value } = event.target;
        value = value < 100 ? 100 : value;
        this.props.changeIntervalDuration(value);
    };

    render() {
        const {
            phase,
            shiftCells,
            run,
            stop,
            penMode,
            loadOld,
            savedBoards
        } = this.props;
        const arrowDisabled = phase !== READY;
        const startDisabled = phase !== READY;
        const resetDisabled = ![READY, RUNNING, INERT].includes(phase);
        const penPressed = penMode === mode.DRAW;
        const eraserPressed = penMode === mode.ERASE;

        const empty = loadOld < 0;
        let ref, board, link;
        if (!empty) {
            ref = savedBoards[loadOld].ref;
            board = savedBoards[loadOld].board;
            link = `http://${window.location.hostname}:8080?b=${board}`;
            console.log(link);
        }
        return (
            <div>
                <Status phase={phase} />
                <Code
                    ref={ref}
                    value={board}
                    link={link}
                    onClick={this.onClick(loadOld)}
                    empty={empty}
                />
                <div className={style["running-controls"]}>
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
                        <div style={{ fontSize: "12px" }}>Cycle Every</div>
                        <input
                            className={style["interval"]}
                            type="number"
                            value={this.props.intervalDuration}
                            onChange={this.props.handleIntervalChange}
                            min={100}
                            max={9999}
                            onBlur={this.onBlur}
                        />
                        <span> ms</span>
                    </div>
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
                <div className={style["saved-boards"]}>
                    Previous Boards
                    {this.renderInitialStateLoaders()}
                </div>
            </div>
        );
    }
}

export default Controls;
