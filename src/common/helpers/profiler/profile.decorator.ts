/* eslint-disable */

import { Profiler } from "./profiler.helper";

export function profile(target: Function): void;
export function profile(target: object, key: string | symbol, _descriptor: TypedPropertyDescriptor<any>): void;
export function profile(
    target: object | Function,
    key?: string | symbol,
    _descriptor?: TypedPropertyDescriptor<any>
): void {
    if (!Profiler.isEnabled()) {
        return;
    }

    if (key) {
        // case of method decorator
        wrapFunction(target, key);
        return;
    }

    // case of class decorator

    const ctor = target as any;
    if (!ctor.prototype) {
        return;
    }

    const className = ctor.name;
    const propertyKeys: Array<PropertyKey> = [
        ...Object.getOwnPropertyNames(ctor.prototype),
        ...Object.getOwnPropertySymbols(ctor.prototype)
    ];
    propertyKeys.forEach(k => {
        wrapFunction(ctor.prototype, k, className);
    });
}

function wrapFunction(obj: object, key: PropertyKey, className?: string) {
    const descriptor = Object.getOwnPropertyDescriptor(obj, key);
    if (!descriptor || descriptor.get || descriptor.set) {
        return;
    }

    if (key === "constructor") {
        return;
    }

    const originalFunction = descriptor.value;
    if (!originalFunction || typeof originalFunction !== "function") {
        return;
    }

    // set a key for the object in memory
    if (!className) {
        className = obj.constructor ? `${obj.constructor.name}` : "";
    }
    const memKey = className + `:${key.toString()}`;

    Object.defineProperty(obj, key, {
        value: function (...args: any[]) {
            const start = Game.cpu.getUsed();
            const result = originalFunction.apply(this, args);
            const end = Game.cpu.getUsed();
            record(memKey, end - start);
            return result;
        }
    });
}

function record(key: string | symbol, time: number) {
    if (!Memory.profiler.data[key]) {
        Memory.profiler.data[key] = {
            calls: 0,
            time: 0
        };
    }
    Memory.profiler.data[key].calls++;
    Memory.profiler.data[key].time += time;
}
