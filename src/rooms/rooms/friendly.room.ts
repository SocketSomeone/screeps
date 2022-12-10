import { BaseRoom } from "./base.room";
import { CreepRole } from "../../creeps/enums";

export class FriendlyRoom extends BaseRoom {
    public run() {
        const harvesters = this.client.creeps.getHarvesters();
        const sources = this.sources;
        let harvestersCount = harvesters.length;
        const maxHarvesters = sources.length * 3;

        if (harvestersCount < maxHarvesters) {
            for (const spawn of this.spawns) {
                spawn.spawnCreep([WORK, CARRY, MOVE], `Harvester - ${harvestersCount++}`, {
                    memory: {
                        uuid: harvestersCount % (maxHarvesters / sources.length),
                        role: CreepRole.Harvester,
                        room: this.name,
                        working: false
                    }
                });
            }
        }
    }
}
