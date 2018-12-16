import React from "react";
import style from "./Status.scss";
import { phaseToEmoji, phaseMessage } from "./Phases";

function Status({ phase }) {
    return (
        <div className={style["status"]}>
            <div className={style["name"]}>Status</div>
            <div>{phaseToEmoji[phase] + phase}</div>
            <div className={style["message"]}>{phaseMessage[phase]}</div>
        </div>
    );
}

export default Status;
