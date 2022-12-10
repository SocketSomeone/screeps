import { BaseCreep } from "./base.creep";
import { CreepRole } from "../enums";

export class BuilderCreep extends BaseCreep {
    public readonly role = CreepRole.Builder;

    public can(): boolean {
        return this.creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0;
    }

    public run(): void {
        const target = this.creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if (target) {
            if (this.creep.build(target) === ERR_NOT_IN_RANGE) {
                this.creep.moveTo(target);
            }
        }
    }
}
