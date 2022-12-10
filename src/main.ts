import { ErrorMapper, Profiler } from "common/helpers";
import { Client } from "./client";

declare global {
    interface Memory {
        uuid: number;
        log: any;
        towersIds: Id<StructureTower>[];
    }

    interface FlagMemory {
        [name: string]: any;
    }
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace NodeJS {
        interface Global {
            log: any;
            Profiler: ScreepsProfiler;
        }
    }
}

global.Profiler = Profiler.init();

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => new Client().loop());
