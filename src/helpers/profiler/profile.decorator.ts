/* eslint-disable */

import { Profiler } from "./profiler.helper";

export function profile(target: Function): void;
export function profile(target: object, key: string | symbol, _descriptor: TypedPropertyDescriptor<Function>): void;
export function profile(
    target: object | Function,
    key?: string | symbol,
    _descriptor?: TypedPropertyDescriptor<Function>
): void {
    if (!__PROFILER_ENABLED__) {
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
    Reflect.ownKeys(ctor.prototype).forEach(k => {
        wrapFunction(ctor.prototype, k, className);
    });
}

function wrapFunction(obj: object, key: PropertyKey, className?: string) {
    const descriptor = Reflect.getOwnPropertyDescriptor(obj, key);
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

    // set a tag, so we don't wrap a function twice
    const savedName = `__${key.toString()}__`;
    if (Reflect.has(obj, savedName)) {
        return;
    }

    Reflect.set(obj, savedName, originalFunction);

    // /////////

    Reflect.set(obj, key, function (this: any, ...args: any[]) {
        if (Profiler.isEnabled()) {
            const start = Game.cpu.getUsed();
            const result = originalFunction.apply(this, args);
            const end = Game.cpu.getUsed();
            record(memKey, end - start);
            return result;
        }
        return originalFunction.apply(this, args);
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
