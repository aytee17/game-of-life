import React from "react";
import { READY, RUNNING, INERT, INITIAL } from "./Phases";
import mode from "./PenMode";
import Status from "./Status";
import Code from "./Code";
import PlayControls from "./PlayControls";
import EditingControls from "./EditingControls";
import SavedBoards from "./SavedBoards";

class Controls extends React.PureComponent {
    render() {
        const {
            phase,
            shiftCells,
            run,
            stop,
            penMode,
            loadOld,
            savedBoards,
            loadBoard,
            intervalDuration,
            handleIntervalChange,
            changePenMode
        } = this.props;

        const arrowDisabled = phase !== READY;
        const startPressed = phase === RUNNING;
        const startDisabled = phase !== READY;
        const resetDisabled = ![READY, RUNNING, INERT].includes(phase);
        const savedBoardsDisabled = ![READY, INITIAL].includes(phase);
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
                <Code ref={ref} value={board} link={link} empty={empty} />
                <PlayControls
                    startPressed={startPressed}
                    startDisabled={startDisabled}
                    run={run}
                    startDisabled={startDisabled}
                    resetDisabled={resetDisabled}
                    stop={stop}
                    intervalDuration={intervalDuration}
                    handleIntervalChange={handleIntervalChange}
                />
                <EditingControls
                    arrowDisabled={arrowDisabled}
                    shiftCells={shiftCells}
                    changePenMode={changePenMode}
                    penPressed={penPressed}
                    eraserPressed={eraserPressed}
                />
                <SavedBoards
                    savedBoards={savedBoards}
                    loadBoard={loadBoard}
                    disabled={savedBoardsDisabled}
                    activeIndex={loadOld}
                />
            </div>
        );
    }
}

export default Controls;
