import React from "react";
import cs from "classnames";
import CRC32 from "crc-32";
import { RUNNING, READY, INERT } from "./Phases";
import Cell from "./Cell";
import style from "./Board.scss";
import mode from "./PenMode";

class Board extends React.Component {
    componentDidUpdate(prevProps) {
        if (prevProps.phase === READY && this.props.phase === RUNNING) {
            const interval = setInterval(this.run, this.props.intervalDuration);
            this.props.storeInterval(interval);
        } else if (
            prevProps.intervalDuration !== this.props.intervalDuration &&
            this.props.phase === RUNNING
        ) {
            this.props.stopUpdating();
            const interval = setInterval(this.run, this.props.intervalDuration);
            this.props.storeInterval(interval);
        }
    }

    run = () => {
        const { nextBoard, emptyBoard, checksum } = this.getNextBoard();
        const sameBoard = checksum === this.props.prevStateChecksum;
        if (emptyBoard) {
            this.props.stop();
        } else if (sameBoard) {
            this.props.stasis();
        } else {
            this.props.loadNextBoard(nextBoard, checksum);
        }
    };

    outOfBounds(x, y) {
        if (x < 0 || y < 0 || x >= this.props.width || y >= this.props.height)
            return true;
        return false;
    }

    countNeighbours(x, y) {
        let count = 0;
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                const displaceY = y + i;
                const displaceX = x + j;
                if (
                    this.outOfBounds(displaceX, displaceY) ||
                    (displaceX === x && displaceY === y)
                ) {
                    continue;
                } else {
                    const neighbour = this.props.board[displaceY][displaceX];
                    if (neighbour) {
                        count++;
                    }
                    if (count > 3) return count;
                }
            }
        }
        return count;
    }

    transform(alive, x, y) {
        const count = this.countNeighbours(x, y);
        if (alive) {
            if (count === 1) {
                return 0;
            } else if (count === 2 || count === 3) {
                return 1;
            } else {
                return 0;
            }
        } else {
            if (count === 3) {
                return 1;
            } else {
                return 0;
            }
        }
    }

    getNextBoard() {
        let emptyBoard = true;
        let stream = [];
        const nextBoard = this.props.board.map((row, y) => {
            const nextRow = row.map((value, x) => {
                const nextValue = this.transform(value, x, y);
                if (emptyBoard && nextValue === 1) {
                    emptyBoard = false;
                }
                return nextValue;
            });
            stream = stream.concat(nextRow);
            return nextRow;
        });
        const checksum = emptyBoard ? undefined : CRC32.buf(stream);
        return { emptyBoard, nextBoard, checksum };
    }

    toggleValue = value => (value === 0 ? 1 : 0);

    toggleCell = (cX, cY) => event => {
        const dragging = event.type === "mouseover" && event.buttons === 1;
        const clicking = event.type === "click";

        if (clicking || dragging) {
            const nextBoard = this.props.board.map((row, y) => {
                if (y === cY) {
                    row[cX] = dragging
                        ? this.props.penMode
                        : this.props.penMode === mode.ERASE
                        ? 0
                        : this.toggleValue(row[cX]);
                }
                return row;
            });
            this.props.drawNextBoardEdit(nextBoard);
        }
    };

    renderBoard() {
        return this.props.board.map((row, y) => {
            return row.map((value, x) => {
                const key = x + y * this.props.height;
                return (
                    <Cell
                        key={key}
                        intervalDuration={this.props.intervalDuration}
                        value={value}
                        toggle={this.toggleCell}
                        phase={this.props.phase}
                        x={x}
                        y={y}
                    />
                );
            });
        });
    }

    render() {
        const { phase, penMode } = this.props;
        const classNames = cs(style["board"], {
            [style["running"]]: phase === RUNNING || phase === INERT,
            [style["pen"]]: penMode === mode.DRAW,
            [style["eraser"]]: penMode === mode.ERASE
        });
        return <div className={classNames}>{this.renderBoard()}</div>;
    }
}

export default Board;
