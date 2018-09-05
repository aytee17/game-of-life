import React, { Component } from "react";
import style from "./App.scss";
import GameOfLife from "./GameOfLife";

export const App = () => (
    <div className={style["app"]}>
        <GameOfLife width={50} height={50} />
    </div>
);

export default App;
