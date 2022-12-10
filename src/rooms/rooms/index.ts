import { BaseRoom } from "./base.room";
import { FriendlyRoom } from "./friendly.room";
import { RoomState } from "../enums";
import { Type } from "common";

export const Rooms: Record<RoomState, Type<BaseRoom>> = {
    [RoomState.Friendly]: FriendlyRoom,
    [RoomState.Hostile]: FriendlyRoom,
    [RoomState.Neutral]: FriendlyRoom
};
