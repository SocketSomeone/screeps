import { BaseCreep } from "./creeps/base.creep";
import { Client } from "../client";
import { CreepRole } from "./enums";
import { Creeps } from "./creeps";
import { profile } from "../common";

declare global {
    interface CreepMemory {
        uuid: number;
        role: CreepRole;
        room: string;
        working: boolean;
    }
}

@profile
export class CreepsManager {
    public readonly creeps = new Map<Creep, BaseCreep>();

    public constructor(private readonly client: Client) {
        for (const creep of Object.values(Game.creeps)) {
            const role = creep.memory.role ?? CreepRole.Harvester;
            this.creeps.set(creep, new Creeps[role](client, creep));
        }
    }

    // public static createCreeps() {
    //     for (const spawnName in Game.spawns) {
    //         const spawn = Game.spawns[spawnName];
    //         HarvesterCreep.createIfNeed(spawn);
    //         UpgraderRole.createIfNeed(spawn);
    //         BuilderRole.createIfNeed(spawn);
    //         RepairerRole.createIfNeed(spawn);
    //     }
    // }

    public getCreepsByRole(role: CreepRole) {
        return _.filter([...this.creeps.values()], creep => creep.role === role);
    }

    public getHarvesters() {
        return this.getCreepsByRole(CreepRole.Harvester);
    }

    public run() {
        for (const creep of Object.values(Game.creeps)) {
            this.creeps.get(creep)?.run();
        }
    }
}
