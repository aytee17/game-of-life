import React, { Component } from "react";
import style from "./App.scss";
import flatten from "lodash.flatten";
import CRC32 from "crc-32";
import Board from "./Board";
import Controls from "./Controls";
import { PAUSED, RUNNING, INITIAL, READY, INERT } from "./Phases";
import { DOWN, LEFT, RIGHT } from "./Directions";

export const App = () => (
    <div className={style["app"]}>
        <GameOfLife width={50} height={50} />
    </div>
);

class GameOfLife extends Component {
    constructor(props) {
        super(props);
        this.state = {
            board: this.initBoard(),
            phase: INITIAL,
            savedBoards: [],
            interval: undefined,
            prevStateChecksum: undefined,
            loadOld: false
        };
    }

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
            prevStateCode: CRC32.buf(flatten(this.state.board)),
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
                if (direction === LEFT) row = row.reverse();
                row = row.map((value, x) => {
                    let newValue = temp;
                    temp = value;
                    if (x === 0) return 0;
                    return newValue;
                });
                if (direction === LEFT) row = row.reverse();
                return row;
            });
        } else {
            const row = new Array(this.props.width).fill(0);
            nextBoard = this.state.board.slice(0);
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

    resetBoard() {
        const clearedBoard = this.state.board.map(row => row.map(() => 0));
        this.setState({ board: clearedBoard, phase: INITIAL });
    }

    render() {
        const { board, phase, savedBoards, prevStateChecksum } = this.state;
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
                />
                <Controls
                    phase={phase}
                    savedBoards={savedBoards}
                    loadBoard={this.loadBoard}
                    shiftCells={this.shiftCells}
                    run={this.run}
                    stop={this.stop}
                    updatePhase={this.updatePhase}
                />
            </React.Fragment>
        );
    }
}

export default App;
