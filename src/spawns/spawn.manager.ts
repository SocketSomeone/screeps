import { Client } from "../client";
import { ScreepsSpawn } from "./spawn";

declare global {
    interface SpawnMemory {
        [name: string]: any;
    }
}

export class SpawnManager {
    public readonly cache = new WeakMap<StructureSpawn, ScreepsSpawn>();

    public constructor(private readonly client: Client) {
        for (const spawn of Object.values(Game.spawns)) {
            this.cache.set(spawn, new ScreepsSpawn(client, spawn));
        }
    }
}
