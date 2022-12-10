import { Client } from "../client";

export class ScreepsSpawn {
    public constructor(private readonly client: Client, private readonly spawn: StructureSpawn) {}

    public get name(): string {
        return this.spawn.name;
    }

    public get room(): Room {
        return this.spawn.room;
    }

    public get energy(): number {
        return this.spawn.energy;
    }

    public get energyCapacity(): number {
        return this.spawn.energyCapacity;
    }
}
