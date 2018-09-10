import React from "react";
import flatten from "lodash.flatten";
import CRC32 from "crc-32";
import Board from "./Board";
import Controls from "./Controls";
import { PAUSED, RUNNING, INITIAL, READY, INERT } from "./Phases";
import { DOWN, LEFT, RIGHT } from "./Directions";
import mode from "./PenMode";

export default class GameOfLife extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            board: this.initBoard(),
            phase: INITIAL,
            penMode: mode.DRAW,
            savedBoards: [],
            interval: undefined,
            intervalDuration: this.props.interval,
            prevStateChecksum: undefined,
            loadOld: false
        };
    }

    changePenMode = penMode => () => {
        this.setState({ penMode });
    };

    handleIntervalChange = event => {
        let { value } = event.target;
        if (!isNaN(value) && value.length <= 4) {
            this.changeIntervalDuration(value);
        }
    };

    changeIntervalDuration = value => {
        this.setState({ intervalDuration: value });
    };

    initBoard() {
        const { width, height } = this.props;
        const board = [];
        for (let i = 0; i < width; i++) {
            const row = [];
            for (let j = 0; j < height; j++) {
                row[j] = 0;
            }
            board[i] = row;
        }
        return board;
    }

    run = () => {
        const update = {
            prevStateChecksum: CRC32.buf(flatten(this.state.board)),
            phase: RUNNING
        };
        if (!this.state.loadOld) {
            update.savedBoards = [this.state.board, ...this.state.savedBoards];
        } else {
            update.loadOld = false;
        }
        this.setState({ ...update });
    };

    loadNextBoard = (board, checksum) =>
        this.setState({ board, prevStateChecksum: checksum });

    storeInterval = interval => this.setState({ interval });

    stopUpdating = () => {
        clearInterval(this.state.interval);
        this.setState({ interval: undefined });
    };

    stasis = () => {
        this.stopUpdating();
        this.setState({ phase: INERT });
    };

    resume = () => {
        this.setState({ phase: RUNNING });
    };

    pause = () => {
        this.stopUpdating();
        this.setState({ phase: PAUSED });
    };

    stop = () => {
        this.stopUpdating();
        this.resetBoard();
    };

    loadBoard = i => () =>
        this.setState({
            board: this.state.savedBoards[i],
            loadOld: true,
            phase: READY
        });

    shiftCells = direction => () => {
        let nextBoard;
        if (direction === LEFT || direction == RIGHT) {
            let temp = 0;
            nextBoard = this.state.board.map((row, y) => {
                if (direction === LEFT) row.reverse();
                const newRow = row.map((value, x) => {
                    let newValue = temp;
                    temp = value;
                    if (x === 0) return 0;
                    return newValue;
                });
                if (direction === LEFT) newRow.reverse();

                for (let x in newRow) {
                    row[x] = newRow[x];
                }
                return row;
            });
        } else {
            const row = new Array(this.props.width).fill(0);
            nextBoard = this.state.board;
            if (direction === DOWN) {
                nextBoard.unshift(row);
                nextBoard.pop();
            } else {
                nextBoard.push(row);
                nextBoard.shift();
            }
        }
        this.drawNextBoardEdit(nextBoard);
    };

    isEmpty = board => {
        for (let row in board) {
            for (let value in board[row]) {
                let cell = board[row][value];
                if (cell === 1) return false;
            }
        }
        return true;
    };

    drawNextBoardEdit = board => {
        const phase = this.isEmpty(board) ? INITIAL : READY;
        this.setState({ board, phase });
    };

    resetBoard() {
        const clearedBoard = this.state.board.map(row => row.map(() => 0));
        this.setState({ board: clearedBoard, phase: INITIAL, loadOld: false });
    }

    render() {
        const {
            board,
            phase,
            savedBoards,
            prevStateChecksum,
            intervalDuration,
            penMode
        } = this.state;
        return (
            <React.Fragment>
                <Board
                    width={this.props.width}
                    height={this.props.height}
                    board={board}
                    phase={phase}
                    prevStateChecksum={prevStateChecksum}
                    stop={this.stop}
                    stasis={this.stasis}
                    loadNextBoard={this.loadNextBoard}
                    storeInterval={this.storeInterval}
                    drawNextBoardEdit={this.drawNextBoardEdit}
                    intervalDuration={intervalDuration}
                    stopUpdating={this.stopUpdating}
                    penMode={penMode}
                />
                <Controls
                    phase={phase}
                    savedBoards={savedBoards}
                    loadBoard={this.loadBoard}
                    shiftCells={this.shiftCells}
                    run={this.run}
                    stop={this.stop}
                    updatePhase={this.updatePhase}
                    intervalDuration={intervalDuration}
                    changeIntervalDuration={this.changeIntervalDuration}
                    handleIntervalChange={this.handleIntervalChange}
                    penMode={penMode}
                    changePenMode={this.changePenMode}
                />
            </React.Fragment>
        );
    }
}
