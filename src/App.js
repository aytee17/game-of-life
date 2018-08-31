import React, { Component } from "react";
import style from "./App.scss";
import cs from "classnames";

export const App = () => (
    <div className={style["app"]}>
        <Board width={50} height={50} />
        <div>hihihi</div>
    </div>
);

const STOPPED = 0;
const RUNNING = 1;

class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            board: this.initBoard(),
            phase: STOPPED,
            interval: undefined
        };
    }
    componentDidMount() {
        setTimeout(() => this.run(), 5000);
    }
    run = () => {
        this.setState({ phase: RUNNING }, () => {
            const interval = setInterval(() => {
                const board = this.transformCells();
                this.setState({ board });
            }, 1000);
            this.setState({ interval });
        });
    };

    outOfBounds = (x, y) => {
        if (x < 0 || y < 0 || x >= this.props.width || y >= this.props.height)
            return true;
        return false;
    };

    countNeighbours = (x, y) => {
        let count = 0;
        let { board } = this.state;
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                const yDirection = y + i;
                const xDirection = x + j;
                if (this.outOfBounds(xDirection, yDirection) || x === y) {
                    continue;
                } else {
                    const neighbour = board[yDirection][xDirection];
                    if (neighbour) {
                        count++;
                    }
                    if (count > 3) return count;
                }
            }
        }
        return count;
    };

    transform = (alive, x, y) => {
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
    };

    transformCells = () =>
        this.state.board.map((row, y) =>
            row.map((value, x) => this.transform(value, x, y))
        );

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

    resetBoard = () => {
        const clearedBoard = this.state.board.map(row => row.map(() => 0));
        this.setState({ board: clearedBoard });
    };

    toggle = value => {
        return value === 0 ? 1 : 0;
    };

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

    renderBoard = () => {
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
    };

    render() {
        return <div className={style["board"]}>{this.renderBoard()}</div>;
    }
}

class Cell extends React.PureComponent {
    render() {
        const classNames = cs(style["cell"], {
            [style["fill"]]: this.props.value
        });
        const { phase, toggle, x, y } = this.props;
        const toggleCell = phase === RUNNING ? undefined : toggle(x, y);
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
