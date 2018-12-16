import React, { useState } from "react";
import style from "./Code.scss";
import cs from "classnames";
import { CopyIcon, LinkIcon } from "./Icons";
import ToolTip from "react-tooltip";
import x from "./CustomToolTipStyle.css";

const Code = React.forwardRef(({ onClick, value, link, empty }, ref) => {
    const classNames = cs(style["holder"], {
        [style["empty"]]: empty,
        [style["show-time"]]: !empty
    });

    const linkRef = React.createRef();

    function copyCode() {
        ref.current.select();
        document.execCommand("copy");
    }

    function copyLink() {
        linkRef.current.select();
        document.execCommand("copy");
    }

    return (
        <div className={classNames}>
            <div className={style["message"]}>Link to this board!</div>
            <div className={style["controls"]}>
                <input
                    ref={ref}
                    className={style["board-code"]}
                    value={value}
                    onClick={onClick}
                    readOnly={true}
                    spellCheck={false}
                />
                <Button
                    toolTip="Get code"
                    successTip="Code copied!"
                    action={copyCode}
                >
                    <CopyIcon />
                </Button>

                <Button
                    toolTip="Get link"
                    successTip="Link copied!"
                    action={copyLink}
                >
                    <LinkIcon />
                </Button>
            </div>
            <textarea
                ref={linkRef}
                value={link}
                readOnly={true}
                style={{
                    position: "absolute",
                    left: "-1000px",
                    top: "-1000px"
                }}
            />
        </div>
    );
});

function Button({ children, toolTip, successTip, action }) {
    const [clicked, setClicked] = useState(false);

    const onClick = () => {
        action();
        setClicked(true);
        setTimeout(() => setClicked(false), 1000);
    };

    const tip = clicked ? successTip : toolTip;
    const key = clicked ? 0 : 1;

    return (
        <div
            key={key}
            className={style["button"]}
            onClick={onClick}
            data-tip={tip}
        >
            {children}
            <ToolTip
                key={key}
                place="top"
                type={clicked ? "success" : "dark"}
                effect="solid"
            />
        </div>
    );
}

export default Code;
