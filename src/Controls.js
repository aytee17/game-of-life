import React from "react";
import { UP, DOWN, LEFT, RIGHT } from "./Directions";
import { READY, RUNNING, INERT } from "./Phases";

class Controls extends React.Component {
    constructor(props) {
        super(props);
    }

    renderInitialStateLoaders() {
        const length = this.props.savedBoards.length;
        return [...Array(length).keys()].map(i => (
            <button key={i} onClick={this.props.loadBoard(i)} />
        ));
    }

    render() {
        const { phase, shiftCells, run, stop } = this.props;
        const disabled = phase !== READY;
        const startDisabled = phase !== READY;
        const resetDisabled = ![READY, RUNNING, INERT].includes(phase);
        return (
            <div>
                {this.props.phase}
                <br />
                <button disabled={startDisabled} onClick={run}>
                    Start
                </button>
                <button disabled={resetDisabled} onClick={stop}>
                    Reset
                </button>
                <br />
                <button disabled={disabled} onClick={shiftCells(LEFT)}>
                    Shift Left
                </button>

                <button disabled={disabled} onClick={shiftCells(DOWN)}>
                    Shift Down
                </button>
                <button disabled={disabled} onClick={shiftCells(UP)}>
                    Shift Up
                </button>
                <button disabled={disabled} onClick={shiftCells(RIGHT)}>
                    Shift Right
                </button>

                <div>{this.renderInitialStateLoaders()}</div>
            </div>
        );
    }
}

export default Controls;
