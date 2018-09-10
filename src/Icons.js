import React from "react";

const color = "#2e2e2e";

const SVG = ({ children, disabled }) => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={disabled ? "grey" : color}
    >
        {children}
    </svg>
);

export const PenIcon = ({ pressed }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={"orange"}>
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
        <path d="M0 0h24v24H0z" fill="none" />
    </svg>
);

export const EraserIcon = ({ pressed }) => (
    <svg width="24" height="24" viewBox="-4 -4 24 24" fill={"pink"}>
        <rect width="16" height="16" rx="3" ry="3" />
    </svg>
);

export const ResetIcon = ({ disabled }) => (
    <SVG disabled={disabled}>
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
    </SVG>
);

export const RunIcon = ({ disabled }) => (
    <SVG disabled={disabled}>
        <path d="M8 5v14l11-7z" />
        <path d="M0 0h24v24H0z" fill="none" />
    </SVG>
);

export const UpIcon = ({ disabled }) => (
    <SVG disabled={disabled}>
        <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
        <path d="M0 0h24v24H0z" fill="none" />
    </SVG>
);

export const DownIcon = ({ disabled }) => (
    <SVG disabled={disabled}>
        <path d="M7.41,8.59L12,13.17l4.59-4.58L18,10l-6,6l-6-6L7.41,8.59z" />
        <path fill="none" d="M0,0h24v24H0V0z" />
    </SVG>
);

export const LeftIcon = ({ disabled }) => (
    <SVG disabled={disabled}>
        <path d="M15.41,16.59L10.83,12l4.58-4.59L14,6l-6,6l6,6L15.41,16.59z" />
        <path fill="none" d="M0,0h24v24H0V0z" />
    </SVG>
);

export const RightIcon = ({ disabled }) => (
    <SVG disabled={disabled}>
        <path d="M8.59,16.59L13.17,12L8.59,7.41L10,6l6,6l-6,6L8.59,16.59z" />
        <path fill="none" d="M0,0h24v24H0V0z" />
    </SVG>
);
