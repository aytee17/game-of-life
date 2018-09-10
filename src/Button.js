import React from "react";
import style from "./Button.scss";
import cs from "classnames";

class Button extends React.PureComponent {
    render() {
        const {
            children,
            pressed,
            greyed,
            disabled,
            round,
            ...props
        } = this.props;
        const className = cs(style["button"], {
            [style["pressed"]]: pressed,
            [style["greyed"]]: disabled,
            [style["round"]]: round
        });

        return (
            <button
                className={className}
                disabled={disabled || pressed}
                {...props}
            >
                {children}
            </button>
        );
    }
}

export default Button;
