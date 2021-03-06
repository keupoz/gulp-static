import { obj } from "through2";

export function gulpIf(condition: boolean, ifTrue: NodeJS.ReadWriteStream, ifFalse = obj()) {
    return condition ? ifTrue : ifFalse;
}
