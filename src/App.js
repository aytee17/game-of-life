import React, { Component } from "react";
import style from "./App.scss";
import GameOfLife from "./GameOfLife";
import { GitHubIcon } from "./Icons";
import { hot } from "react-hot-loader";

export const App = () => (
    <div className={style["wrapper"]}>
        <div className={style["container"]}>
            <header className={style["header"]}>
                <div className={style["header-top"]}>
                    <div className={style["header-title"]}>Conway's Game of Life</div>
                    <a
                        className={style["github-link"]}
                        href="https://github.com/aytee17/game-of-life"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <GitHubIcon />
                    </a>
                </div>
                <p className={style["header-body"]}>
                    A cellular automaton where cells live or die based on how many
                    neighbours they have. Draw a pattern on the grid and press Play
                    to watch it evolve.
                </p>
            </header>
            <div className={style["app"]}>
                <GameOfLife width={50} height={50} interval={150} />
            </div>
            <footer className={style["footer"]}>
                <div className={style["footer-title"]}>The Rules</div>
                <ol className={style["rules"]}>
                    <li>A live cell with fewer than 2 live neighbours dies (underpopulation)</li>
                    <li>A live cell with 2 or 3 live neighbours survives</li>
                    <li>A live cell with more than 3 live neighbours dies (overpopulation)</li>
                    <li>A dead cell with exactly 3 live neighbours becomes alive (reproduction)</li>
                </ol>
            </footer>
        </div>
    </div>
);

export default hot(module)(App);
