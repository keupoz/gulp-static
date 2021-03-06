import { minify, Options } from "html-minifier";
import { plugin } from "./plugin";

export function htmlMinifier(options: Options = {}) {
    return plugin("html-minifier", (chunk, encoding, callback) => {
        const contents = chunk.contents.toString(encoding),
            minified = minify(contents, options);

        chunk.contents = Buffer.from(minified, encoding);

        callback(null, chunk);
    });
}
