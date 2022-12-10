import { Client } from "../../client";
import { Memoize } from "common";

export abstract class BaseRoom {
    public constructor(protected readonly client: Client, protected readonly room: Room) {}

    public get name(): string {
        return this.room.name;
    }

    public get spawns(): StructureSpawn[] {
        return this.room.find(FIND_MY_SPAWNS);
    }

    public get sources(): Source[] {
        return this.room.find(FIND_SOURCES, {
            filter: (s: Source) => s.energy > 0
        });
    }

    public get minerals(): Mineral[] {
        return this.room.find(FIND_MINERALS);
    }

    public get controller(): StructureController | undefined {
        return this.room.controller;
    }

    public get energyAvailable(): number {
        return this.room.energyAvailable;
    }

    public get energyCapacityAvailable(): number {
        return this.room.energyCapacityAvailable;
    }

    public get storage(): StructureStorage | undefined {
        return this.room.storage;
    }

    public get terminal(): StructureTerminal | undefined {
        return this.room.terminal;
    }

    @Memoize()
    public get towers(): StructureTower[] {
        return this.room.find<StructureTower>(FIND_MY_STRUCTURES, {
            filter: (s: Structure) => s.structureType === STRUCTURE_TOWER
        });
    }

    @Memoize()
    public get constructionSites(): ConstructionSite[] {
        return this.room.find(FIND_MY_CONSTRUCTION_SITES);
    }

    @Memoize()
    public get hostiles(): Creep[] {
        return this.room.find(FIND_HOSTILE_CREEPS);
    }

    @Memoize()
    public get repairableStructures(): Structure[] {
        return this.room.find(FIND_STRUCTURES, {
            filter: (s: Structure) => s.hits < s.hitsMax
        });
    }

    public abstract run(): void;
}
