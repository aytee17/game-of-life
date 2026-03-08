export const READY = "READY";
export const PAUSED = "PAUSED";
export const RUNNING = "RUNNING";
export const INERT = "PERMANENT STASIS";
export const INITIAL = "INITIAL";

export const phaseToEmoji = {
    READY: "✅",
    RUNNING: "🏃🏽‍♀️",
    "PERMANENT STASIS": "🗿",
    INITIAL: "🏁"
};

export const phaseMessage = {
    READY: "Press Play to run the simulation",
    RUNNING: "You can reset the board at anytime",
    INITIAL: "Draw on the board to get started",
    "PERMANENT STASIS": "Press Reset to start drawing again"
};
