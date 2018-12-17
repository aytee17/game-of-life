import React from "react";
import flatten from "lodash.flatten";
import CRC32 from "crc-32";
import Board from "./Board";
import Controls from "./Controls";
import { PAUSED, RUNNING, INITIAL, READY, INERT } from "./Phases";
import { DOWN, LEFT, RIGHT } from "./Directions";
import mode from "./PenMode";
import pako from "pako";
import base64 from "base-64";

function getQueryVariable(variable) {
    const query = window.location.search.substring(1);
    const vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return false;
}

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
            loadOld: -1
        };
    }

    getCRC32 = board => CRC32.buf(flatten(board));

    componentDidMount() {
        const compressedBoard = getQueryVariable("b");
        if (compressedBoard) {
            const board = this.decompress(compressedBoard);
            this.setBoard(board);
        }
    }

    setBoard = board =>
        this.setState({
            board,
            loadOld: -1,
            phase: READY
        });

    loadBoardFromUser = coordinates => {
        const board = this.createBoardFromCells(coordinates);
        this.setBoard(board);
    };

    getLivingCells = board => {
        const coordinates = [];
        board.map((row, y) => {
            row.map((value, x) => {
                if (value === 1) {
                    coordinates.push([y, x]);
                }
            });
        });
        return coordinates;
    };

    createBoardFromCells = coordinates => this.initBoard(coordinates);

    compress = board =>
        base64.encode(
            pako.deflate(JSON.stringify(this.getLivingCells(board)), {
                to: "string"
            })
        );

    decompress = compressedBoard =>
        this.createBoardFromCells(
            JSON.parse(
                pako.inflate(base64.decode(compressedBoard), { to: "string" })
            )
        );

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

    initBoard(coordinates) {
        const loadFromCoords = coordinates !== undefined;
        let iterator;
        let next;
        if (loadFromCoords) {
            iterator = coordinates.values();
            next = iterator.next();
        }

        const { width, height } = this.props;
        const board = [];
        for (let i = 0; i < width; i++) {
            const row = [];
            for (let j = 0; j < height; j++) {
                let value;
                if (loadFromCoords) {
                    if (
                        !next.done &&
                        i === next.value[0] &&
                        j === next.value[1]
                    ) {
                        value = 1;
                        next = iterator.next();
                    }
                } else {
                    value = 0;
                }
                row[j] = value;
            }
            board[i] = row;
        }
        return board;
    }

    saveBoard = () => {
        const prevBoards = this.state.savedBoards;
        return [
            {
                name: prevBoards.length,
                ref: React.createRef(),
                board: this.compress(this.state.board)
            },
            ...prevBoards
        ];
    };

    setSavedBoardName = (index, name) =>
        this.setState({
            savedBoardNames: { ...this.savedBoardNames, [index]: name }
        });

    getSavedBoardName = index => this.savedBoardNames[index];

    run = () => {
        const { loadOld, savedBoards } = this.state;
        const update = {
            prevStateChecksum: this.getCRC32(this.state.board),
            phase: RUNNING
        };

        if (loadOld >= 0) {
            if (
                this.getCRC32(this.decompress(savedBoards[loadOld].board)) !==
                update.prevStateChecksum
            ) {
                update.loadOld = 0;
                update.savedBoards = this.saveBoard();
            }
        } else {
            update.loadOld = 0;
            update.savedBoards = this.saveBoard();
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
            board: this.decompress(this.state.savedBoards[i].board),
            loadOld: i,
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
                return newRow;
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
        this.setState({ board: clearedBoard, phase: INITIAL, loadOld: -1 });
    }

    render() {
        const {
            board,
            phase,
            savedBoards,
            prevStateChecksum,
            intervalDuration,
            penMode,
            loadOld
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
                    width={this.props.width}
                    height={this.props.height}
                    phase={phase}
                    savedBoards={savedBoards}
                    loadBoard={this.loadBoard}
                    loadBoardFromUser={this.loadBoardFromUser}
                    loadOld={loadOld}
                    shiftCells={this.shiftCells}
                    run={this.run}
                    stop={this.stop}
                    updatePhase={this.updatePhase}
                    intervalDuration={intervalDuration}
                    changeIntervalDuration={this.changeIntervalDuration}
                    handleIntervalChange={this.handleIntervalChange}
                    penMode={penMode}
                    changePenMode={this.changePenMode}
                    setSavedBoardName={this.setSavedBoardName}
                    getSavedBoardName={this.getSavedBoardName}
                />
            </React.Fragment>
        );
    }
}
