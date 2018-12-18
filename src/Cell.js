import React from "react";
import style from "./Cell.scss";
import cs from "classnames";
import { INITIAL, READY } from "./Phases";

export default class Cell extends React.PureComponent {
    render() {
        let styleName =
            this.props.intervalDuration > 120 ? "cell" : "cell-no-transition";

        const classNames = cs(style[styleName], {
            [style["fill"]]: this.props.value
        });
        const { phase, toggle, x, y } = this.props;
        const toggleCell = [INITIAL, READY].includes(phase)
            ? toggle(x, y)
            : undefined;
        return (
            <div
                className={classNames}
                onClick={toggleCell}
                onMouseOver={toggleCell}
            />
        );
    }
}
