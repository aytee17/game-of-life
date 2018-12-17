import React, { useState } from "react";
import style from "./CodeLoader.scss";
import Button from "./Button";
import base64 from "base-64";
import pako from "pako";

const CodeLoader = ({ width, height, loadBoardFromUser, disabled }) => {
    const [code, setCode] = useState("");
    const [validCoordinates, setValidCoordinates] = useState(false);
    const [coordinates, setCoordinates] = useState([]);

    const validValue = max => value =>
        Number.isInteger(value) && value >= 0 && value < max;

    const validY = validValue(height);
    const validX = validValue(width);

    function isValidCoordinates(coordinates) {
        if (!Array.isArray(coordinates)) {
            return false;
        }
        if (coordinates.length > width * height) {
            return false;
        }
        coordinates.forEach(coordinate => {
            if (!Array.isArray(coordinate)) {
                return false;
            }
            if (coordinate.length !== 2) {
                return false;
            }
            if (!validX(coordinate[1]) || !validY(coordinate[0])) {
                return false;
            }
        });
        return true;
    }

    const handleChange = event => {
        const { value } = event.target;
        setCode(value);

        try {
            const coordinates = JSON.parse(
                pako.inflate(base64.decode(value), {
                    to: "string"
                })
            );
            if (isValidCoordinates(coordinates)) {
                setValidCoordinates(true);
                setCoordinates(coordinates);
            } else {
                setValidCoordinates(false);
            }
        } catch (error) {
            setValidCoordinates(false);
            return;
        }
    };

    return (
        <div>
            <div className={style["title"]}>Load Code</div>
            <div className={style["controls"]}>
                <textarea
                    className={style["code"]}
                    value={code}
                    onChange={handleChange}
                    spellCheck={false}
                    disabled={disabled}
                />
                <Button
                    disabled={!validCoordinates || disabled}
                    onClick={() => {
                        setCode("");
                        setValidCoordinates(false);
                        loadBoardFromUser(coordinates);
                    }}
                >
                    Load
                </Button>
            </div>
        </div>
    );
};

export default CodeLoader;
