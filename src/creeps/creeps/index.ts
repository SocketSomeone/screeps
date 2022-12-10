import { BaseCreep } from "./base.creep";
import { CreepRole } from "../enums";
import { HarvesterCreep } from "./harvester.creep";
import { Type } from "common";

export const Creeps: Record<CreepRole, Type<BaseCreep>> = {
    [CreepRole.Harvester]: HarvesterCreep,
    [CreepRole.Upgrader]: HarvesterCreep,
    [CreepRole.Builder]: HarvesterCreep,
    [CreepRole.Repairer]: HarvesterCreep
};
