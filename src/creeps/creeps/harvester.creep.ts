import { BaseCreep } from "./base.creep";
import { CreepRole } from "../enums";
import { profile } from "../../common";

@profile
export class HarvesterCreep extends BaseCreep {
    public readonly role = CreepRole.Harvester;

    public get hasFreeCapacity() {
        return this.creep.store.getFreeCapacity() > 0;
    }

    public get transferTarget(): StructureExtension | StructureSpawn | StructureTower | null {
        return this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: structure => {
                return (
                    (structure.structureType === STRUCTURE_EXTENSION ||
                        structure.structureType === STRUCTURE_SPAWN ||
                        structure.structureType === STRUCTURE_TOWER) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0 &&
                    structure.my
                );
            }
        });
    }

    public can() {
        if (this.hasFreeCapacity) {
            return true;
        }

        return !!this.transferTarget;
    }

    public run() {
        const creep = this.creep;

        if (this.hasFreeCapacity) {
            const sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[creep.memory.uuid]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[creep.memory.uuid], { visualizePathStyle: { stroke: "#ffaa00" } });
            }
            return;
        }

        if (!this.transferTarget) return;

        if (creep.transfer(this.transferTarget, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(this.transferTarget, { visualizePathStyle: { stroke: "#ffffff" } });
        }
    }
}
