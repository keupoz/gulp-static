import { glob } from "glob";
import { posix } from "path";
import { render } from "pug";
import { initIcons } from "./fontawesome";
import { markdown } from "./markdown";
import { plugin } from "./plugin";

const icon = initIcons();

export function pug(data: any, pretty: boolean) {
    return plugin("pug", (chunk, encoding, callback) => {
        const contents = chunk.contents.toString(encoding),
            rendered = render(contents, {
                pretty,

                cache: true,
                filename: chunk.path,

                filters: {
                    markdown(template: string) {
                        return markdown(template, false);
                    }
                },

                locals: {
                    data, icon, markdown,

                    glob(pattern: string) {
                        return glob.sync(pattern).map((path) => posix.join("/", path));
                    }
                }
            });

        chunk.contents = Buffer.from(rendered, encoding);
        chunk.extname = ".html";

        callback(null, chunk);
    });
}
