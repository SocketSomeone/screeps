import { ErrorMapper, Profiler, logger } from "helpers";

global.Profiler = Profiler.init();

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
    logger.info(`Current game tick is ${Game.time}`);

    if (!Memory.uuid || Memory.uuid >= Number.MAX_SAFE_INTEGER) {
        Memory.uuid = 0;
    }

    if (Game.time % 100 === 0) {
        for (const name in Memory.creeps) {
            if (!(name in Game.creeps)) {
                logger.info(`Clearing non-existing creep memory: ${name}`);
                delete Memory.creeps[name];
            }
        }
    }
});
