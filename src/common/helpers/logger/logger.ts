/* eslint-disable */

import { SourceMapConsumer } from "source-map";
import { LogLevel } from "./log-level.enum";

// <caller> (<source>:<line>:<column>)
const stackLineRe = /([^ ]*) \(([^:]*):([0-9]*):([0-9]*)\)/;

interface SourcePos {
    compiled: string;
    final: string;
    original: string | undefined;
    caller: string | undefined;
    path: string | undefined;
    line: number | undefined;
}

export function resolve(fileLine: string): SourcePos {
    const split = _.trim(fileLine).match(stackLineRe);
    if (!split || !Logger.sourceMap) {
        return { compiled: fileLine, final: fileLine } as SourcePos;
    }

    const pos = { column: parseInt(split[4], 10), line: parseInt(split[3], 10) };

    const original = Logger.sourceMap.originalPositionFor(pos);
    const line = `${split[1]} (${original.source}:${original.line})`;
    const out = {
        caller: split[1],
        compiled: fileLine,
        final: line,
        line: original.line,
        original: line,
        path: original.source
    };

    return out;
}

function color(str: string, color: string): string {
    return `<font color='${color}'>${str}</font>`;
}

function tooltip(str: string, tooltip: string): string {
    return `<abbr title='${tooltip}'>${str}</abbr>`;
}

function link(href: string, title: string): string {
    return `<a href='${href}' target="_blank">${title}</a>`;
}

function time(): string {
    return color(Game.time.toString(), "gray");
}

export class Logger {
    public static sourceMap: any;

    public static loadSourceMap() {
        try {
            const map = require("main.js.map");
            if (map) {
                Logger.sourceMap = new SourceMapConsumer(map);
            }
        } catch (err) {
            console.log("failed to load source map", err);
        }
    }

    public get level(): number {
        return Memory.log.level;
    }

    public set level(value: number) {
        Memory.log.level = value;
    }

    public get showSource(): boolean {
        return Memory.log.showSource;
    }

    public set showSource(value: boolean) {
        Memory.log.showSource = value;
    }

    public get showTick(): boolean {
        return Memory.log.showTick;
    }

    public set showTick(value: boolean) {
        Memory.log.showTick = value;
    }

    private _maxFileString = 0;

    constructor() {
        _.defaultsDeep(Memory, {
            log: {
                level: LogLevel.DEBUG,
                showTick: true
            }
        });
    }

    public trace(error: Error): Logger {
        if (this.level >= LogLevel.ERROR && error.stack) {
            console.log(this.resolveStack(error.stack));
        }

        return this;
    }

    public error(...args: any[]) {
        if (this.level >= LogLevel.ERROR) {
            console.log.apply(this, this.buildArguments(LogLevel.ERROR).concat([].slice.call(args)));
        }
    }

    public warning(...args: any[]) {
        if (this.level >= LogLevel.WARNING) {
            console.log.apply(this, this.buildArguments(LogLevel.WARNING).concat([].slice.call(args)));
        }
    }

    public info(...args: any[]) {
        if (this.level >= LogLevel.INFO) {
            console.log.apply(this, this.buildArguments(LogLevel.INFO).concat([].slice.call(args)));
        }
    }

    public debug(...args: any[]) {
        if (this.level >= LogLevel.DEBUG) {
            console.log.apply(this, this.buildArguments(LogLevel.DEBUG).concat([].slice.call(args)));
        }
    }

    private buildArguments(level: number): string[] {
        const out: string[] = [];
        switch (level) {
            case LogLevel.ERROR:
                out.push(color("ERROR  ", "red"));
                break;
            case LogLevel.WARNING:
                out.push(color("WARNING", "yellow"));
                break;
            case LogLevel.INFO:
                out.push(color("INFO   ", "green"));
                break;
            case LogLevel.DEBUG:
                out.push(color("DEBUG  ", "gray"));
                break;
            default:
                break;
        }
        if (this.showTick) {
            out.push(time());
        }
        return out;
    }

    private resolveStack(stack: string): string {
        if (!Logger.sourceMap) {
            return stack;
        }

        return _.map(stack.split("\n").map(resolve), "final").join("\n");
    }

    private adjustFileLine(visibleText: string, line: string): string {
        const newPad = Math.max(visibleText.length, this._maxFileString);
        this._maxFileString = newPad;

        return `|${_.padRight(line, line.length + this._maxFileString - visibleText.length, " ")}|`;
    }
}

Logger.loadSourceMap();

export const logger = new Logger();

global.log = logger;
