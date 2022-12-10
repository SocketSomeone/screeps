import { BaseRoom } from "./rooms/base.room";
import { Client } from "../client";
import { RoomState } from "./enums";
import { Rooms } from "./rooms";

declare global {
    interface RoomMemory {
        sources: any;
        state: RoomState;
    }
}

export class RoomsManager {
    public readonly cache = new WeakMap<Room, BaseRoom>();

    public constructor(private readonly client: Client) {
        for (const room of Object.values(Game.rooms)) {
            const state = room.memory.state ?? RoomState.Friendly;
            this.cache.set(room, new Rooms[state](client, room));
        }
    }

    public run() {
        for (const room of Object.values(Game.rooms)) {
            this.cache.get(room)?.run();
        }
    }
}
