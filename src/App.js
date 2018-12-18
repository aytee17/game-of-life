import React, { Component } from "react";
import style from "./App.scss";
import GameOfLife from "./GameOfLife";
import { hot } from "react-hot-loader";

export const App = () => (
    <div className={style["app"]}>
        <GameOfLife width={50} height={50} interval={150} />
    </div>
);

export default hot(module)(App);
