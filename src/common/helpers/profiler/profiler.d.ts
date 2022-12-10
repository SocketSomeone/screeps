interface Memory {
    profiler: ProfilerMemory;
}

interface ProfilerMemory {
    data: { [name: string | symbol]: ProfilerData };
    start?: number;
    total: number;
}

interface ProfilerData {
    calls: number;
    time: number;
}

interface ScreepsProfiler {
    clear(): string;

    output(): string;

    start(): string;

    status: string;

    stop(): string;

    toString(): string;
}
