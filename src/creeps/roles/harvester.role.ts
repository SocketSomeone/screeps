import { CreepRole } from "../enums";

export class HarvesterRole {
    private static isNeedCreate() {
        const harvesters = _.filter(Game.creeps, creep => creep.memory.role === CreepRole.Harvester);
        return harvesters.length < 2;
    }

    public static createIfNeed(spawn: StructureSpawn) {
        if (!this.isNeedCreate()) {
            return;
        }

        const newName = `Harvester${Memory.uuid}`;
        Memory.uuid++;
        spawn.spawnCreep([WORK, CARRY, MOVE], newName, {
            memory: { role: CreepRole.Harvester, room: spawn.room.name, working: false }
        });
    }

    public static run(creep: Creep) {
        if (creep.store.getFreeCapacity() > 0) {
            const sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], { visualizePathStyle: { stroke: "#ffaa00" } });
            }
        } else {
            const targets = creep.room.find(FIND_STRUCTURES, {
                filter: structure => {
                    return (
                        (structure.structureType === STRUCTURE_EXTENSION ||
                            structure.structureType === STRUCTURE_SPAWN ||
                            structure.structureType === STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                    );
                }
            });
            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: "#ffffff" } });
                }
            }
        }
    }
}
