import SASS from "sass";
import { plugin } from "./plugin";

export function sass(options: SASS.Options = {}) {
    return plugin("sass", function (chunk, encoding, callback) {
        const contents = chunk.contents.toString(encoding),
            result = SASS.renderSync({
                ...options,

                data: contents,
                includePaths: [chunk.dirname],
                sourceMap: false
            });

        chunk.contents = result.css;
        chunk.extname = ".css";

        callback(null, chunk);
    });
}
