import { TaskState } from "../enums";

export interface Task {
    readonly id: string;
    readonly name: string;
    readonly state: TaskState;
    readonly priority: number;
}
