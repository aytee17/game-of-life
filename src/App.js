import React, { Component } from "react";
import style from "./App.scss";
import cs from "classnames";
import CRC32 from "crc-32";
import flatten from "lodash.flatten";
import snapshot from "html2canvas";

export const App = () => (
    <div className={style["app"]}>
        <Board width={50} height={50} />
    </div>
);

const INITIAL = "START";
const PAUSED = "PAUSED";
const RUNNING = "RUNNING";
const INERT = "PERMANENT STASIS";

class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            board: this.initBoard(),
            initialStates: [],
            phase: INITIAL,
            interval: undefined,
            prevStateCode: undefined,
            loadOld: false
        };
    }

    setSnapshot = snapshot => {
        const node = document.querySelector("#snapshot");
        node.replaceChild(snapshot, node.firstChild);
    };

    run = () => {
        const { phase } = this.state;
        switch (phase) {
            case RUNNING:
            case INERT:
                return;
            case INITIAL:
                this.setState({ phase: RUNNING }, () => {
                    const update = {
                        prevStateCode: CRC32.buf(flatten(this.state.board))
                    };
                    if (!this.state.loadOld) {
                        update.initialStates = [
                            this.state.board,
                            ...this.state.initialStates
                        ];
                        snapshot(document.querySelector("." + style["board"]), {
                            //width: 120,
                            //height: 120
                        }).then(this.setSnapshot);
                    } else {
                        this.setState({ loadOld: false });
                    }
                    this.setState(update, () => {
                        const interval = setInterval(() => {
                            const {
                                nextBoard,
                                emptyBoard,
                                checksum
                            } = this.getNextBoard();
                            const sameBoard =
                                checksum === this.state.prevStateCode;
                            if (emptyBoard) {
                                this.stop();
                            } else if (sameBoard) {
                                this.stasis();
                            } else {
                                this.setState({
                                    board: nextBoard,
                                    prevStateCode: checksum
                                });
                            }
                        }, 300);
                        this.setState({ interval });
                    });
                });
                break;
        }
    };

    stopUpdating = () => {
        clearInterval(this.state.interval);
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

    outOfBounds(x, y) {
        if (x < 0 || y < 0 || x >= this.props.width || y >= this.props.height)
            return true;
        return false;
    }

    countNeighbours(x, y) {
        let count = 0;
        let { board } = this.state;
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
                    const neighbour = board[displaceY][displaceX];
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
        const nextBoard = this.state.board.map((row, y) => {
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

    loadBoard = i => () =>
        this.setState({ board: this.state.initialStates[i], loadOld: true });

    resetBoard() {
        const clearedBoard = this.state.board.map(row => row.map(() => 0));
        this.setState({ board: clearedBoard, phase: INITIAL });
    }

    toggle(value) {
        return value === 0 ? 1 : 0;
    }

    toggleCell = (cX, cY) => event => {
        const dragging = event.type === "mouseover" && event.buttons === 1;
        const clicking = event.type === "click";
        if (clicking || dragging) {
            const nextBoard = this.state.board.map((row, y) => {
                if (y === cY) {
                    row[cX] = dragging ? 1 : this.toggle(row[cX]);
                    return row;
                }
                return row;
            });
            this.setState({
                board: nextBoard
            });
        }
    };

    renderBoard() {
        return this.state.board.map((row, y) => {
            return row.map((value, x) => {
                const key = x + y * this.props.height;
                return (
                    <Cell
                        key={key}
                        value={value}
                        toggle={this.toggleCell}
                        phase={this.state.phase}
                        x={x}
                        y={y}
                    />
                );
            });
        });
    }

    renderInitialStateLoaders() {
        const length = this.state.initialStates.length;
        return [...Array(length).keys()].map(i => (
            <button onClick={this.loadBoard(i)} />
        ));
    }

    render() {
        return (
            <React.Fragment>
                <div className={style["board"]}>{this.renderBoard()}</div>
                <div>
                    <button onClick={this.run}>Start</button>
                    <button onClick={this.stop}>Reset</button>
                    {this.state.phase}
                    <div>{this.renderInitialStateLoaders()}</div>
                    <div id="snapshot">
                        <i />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

class Cell extends React.PureComponent {
    render() {
        const classNames = cs(style["cell"], {
            [style["fill"]]: this.props.value
        });
        const { phase, toggle, x, y } = this.props;
        const toggleCell = phase === INITIAL ? toggle(x, y) : undefined;
        return (
            <div
                className={classNames}
                onClick={toggleCell}
                onMouseOver={toggleCell}
            />
        );
    }
}
export default App;
