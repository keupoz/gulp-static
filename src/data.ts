import { recursive as recursiveMerge } from "merge";
import path from "path";
import YAML from "yaml";
import { plugin } from "./plugin";

export function data(container: any) {
    return plugin("json-data", (chunk, encoding, callback) => {
        const contents = chunk.contents.toString(encoding),
            json = chunk.extname === ".json" ? JSON.parse(contents) : YAML.parse(contents),
            parsedPath = path.parse(chunk.relative),
            result = {} as any;

        path.join(parsedPath.dir, parsedPath.name)
            .split(path.sep)
            .reduce((prev, curr, index, arr) => {
                return prev[curr] = index === arr.length - 1 ? json : {};
            }, result);

        recursiveMerge(container, result);

        callback(null, chunk);
    });
}
