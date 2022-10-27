export interface OutputData {
    name: string;
    calls: number;
    cpuPerCall: number;
    callsPerTick: number;
    cpuPerTick: number;
}

export class Profiler implements ScreepsProfiler {
    private static DEFAULTS = {
        data: {},
        total: 0
    };

    public static init(): Profiler {
        if (!Memory.profiler) {
            Memory.profiler = this.DEFAULTS;
        }

        return new Profiler();
    }

    public static isEnabled(): boolean {
        return Memory.profiler.start !== undefined;
    }

    public start() {
        Memory.profiler.start = Game.time;
        return "Profiler started";
    }

    public get status(): string {
        if (Profiler.isEnabled()) {
            return "Profiler is running";
        }
        return "Profiler is stopped";
    }

    public stop() {
        if (!Profiler.isEnabled()) {
            return "Profiler is already stopped";
        }
        const timeRunning = Game.time - Memory.profiler.start!;
        Memory.profiler.total += timeRunning;
        delete Memory.profiler.start;
        return "Profiler stopped";
    }

    public clear() {
        const running = Profiler.isEnabled();
        Memory.profiler = Profiler.DEFAULTS;
        if (running) {
            Memory.profiler.start = Game.time;
        }
        return "Profiler Memory cleared";
    }

    public output() {
        let totalTicks = Memory.profiler.total;
        if (Memory.profiler.start) {
            totalTicks += Game.time - Memory.profiler.start;
        }

        // /////
        // Process data
        let totalCpu = 0; // running count of average total CPU use per tick
        let calls: number;
        let time: number;
        let result: Partial<OutputData>;

        const data = Object.getOwnPropertyNames(Memory.profiler.data).map(key => {
            calls = Memory.profiler.data[key].calls;
            time = Memory.profiler.data[key].time;
            result = {};
            result.name = `${key.toString()}`;
            result.calls = calls;
            result.cpuPerCall = time / calls;
            result.callsPerTick = calls / totalTicks;
            result.cpuPerTick = time / totalTicks;
            totalCpu += result.cpuPerTick;
            return result as OutputData;
        });

        data.sort((lhs, rhs) => rhs.cpuPerTick - lhs.cpuPerTick);

        // /////
        // Format data
        let output = "";

        // get function name max length
        const longestName = _.max(data, d => d.name.length).name.length + 2;

        // // Header line
        output += _.padRight("Function", longestName);
        output += _.padLeft("Tot Calls", 12);
        output += _.padLeft("CPU/Call", 12);
        output += _.padLeft("Calls/Tick", 12);
        output += _.padLeft("CPU/Tick", 12);
        output += _.padLeft("% of Tot\n", 12);

        // //  Data lines
        data.forEach(d => {
            output += _.padRight(`${d.name}`, longestName);
            output += _.padLeft(`${d.calls}`, 12);
            output += _.padLeft(`${d.cpuPerCall.toFixed(2)}ms`, 12);
            output += _.padLeft(`${d.callsPerTick.toFixed(2)}`, 12);
            output += _.padLeft(`${d.cpuPerTick.toFixed(2)}ms`, 12);
            output += _.padLeft(`${((d.cpuPerTick / totalCpu) * 100).toFixed(0)} %\n`, 12);
        });

        // // Footer line
        output += `${totalTicks} total ticks measured`;
        output += `\t\t\t${totalCpu.toFixed(2)} average CPU profiled per tick`;
        console.log(output);
        return "Done";
    }

    public toString(): string {
        return [
            "Profiler.start() - Starts the profiler",
            "Profiler.stop() - Stops/Pauses the profiler",
            "Profiler.status() - Returns whether is profiler is currently running or not",
            "Profiler.output() - Pretty-prints the collected profiler data to the console",
            this.status
        ].join("\n");
    }
}
