import { CreepsManager } from "./creeps";
import { RoomsManager } from "./rooms";
import { SpawnManager } from "./spawns";
import { TasksManager } from "./tasks";
import { logger } from "./common";

export class Client {
    public readonly creeps = new CreepsManager(this);

    public readonly tasks = new TasksManager(this);

    public readonly rooms = new RoomsManager(this);

    public readonly spawns = new SpawnManager(this);

    public constructor() {
        this.init();
    }

    private init(): void {
        this.loop();
    }

    public loop(): void {
        logger.info(
            `T: ${Game.time} | CPU: ${Game.cpu.getUsed()}/${Game.cpu.limit} | Bucket: ${Game.cpu.bucket} | GCL: ${
                Game.gcl.level
            } | GCL Progress: ${Game.gcl.progress}/${Game.gcl.progressTotal}`
        );

        if (!Memory.uuid || Memory.uuid >= Number.MAX_SAFE_INTEGER) {
            Memory.uuid = 0;
        }

        this.creeps.run();
        this.rooms.run();

        this.clearMemory();
    }

    private clearMemory(): void {
        for (const name in Memory.creeps) {
            if (!(name in Game.creeps)) {
                logger.info(`Clearing non-existing creep memory: ${name}`);
                delete Memory.creeps[name];
            }
        }
    }

    public static metrics(): void {
        const cpu = Game.cpu.getUsed();
        const bucket = Game.cpu.bucket;
        const gcl = Game.gcl.level;
        const gclProgress = Game.gcl.progress;
    }
}
