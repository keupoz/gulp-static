import { Plugin, rollup, RollupCache } from "rollup";
import { plugin } from "./plugin";

let cache: RollupCache;

export function gulpRollup(plugins?: Plugin[]) {
    return plugin("rollup", async (chunk, encoding, callback) => {
        const bundle = await rollup({
            cache, plugins,
            input: chunk.path
        });

        if (bundle.cache !== undefined) cache = bundle.cache;

        const chunks = await bundle.generate({
            format: "iife"
        });

        chunk.contents = Buffer.from(chunks.output[0].code, encoding);
        chunk.extname = ".js";

        callback(null, chunk);
    }, true);
}
