import { Client } from "../../client";
import { CreepRole } from "../enums";

export abstract class BaseCreep {
    public abstract readonly role: CreepRole;

    public constructor(private readonly client: Client, protected readonly creep: Creep) {}

    public get currentRoom(): string {
        return this.creep.room.name;
    }

    public set isWorking(value: boolean) {
        this.creep.memory.working = true;
    }

    public get isWorking(): boolean {
        return this.creep.memory.working;
    }

    public abstract can(): boolean;

    public abstract run(): void;

    public doWork() {
        this.isWorking = this.can();

        if (this.isWorking) {
            this.run();
        }
    }
}
