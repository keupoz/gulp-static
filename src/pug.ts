import { glob } from "glob";
import { posix } from "path";
import { compile } from "pug";
import { initIcons } from "./fontawesome";
import { markdown, slugify } from "./markdown";
import { plugin } from "./plugin";

const icon = initIcons();

export function pug(data: any, isProduction: boolean) {
    return plugin("pug", (chunk, encoding, callback) => {
        const contents = chunk.contents.toString(encoding),
            template = compile(contents, {
                cache: false,
                filename: chunk.path,
                pretty: isProduction,

                filters: {
                    markdown(template: string) {
                        return markdown(template, false);
                    }
                }
            }),
            root = isProduction && "site" in data && "root" in data.site ? String(data.site.root) : "/",
            rendered = template({
                data, icon, markdown, slugify,

                r(literals: TemplateStringsArray, ...values: any[]) {
                    let result = "";

                    for (let i = 0; i < values.length; i++) {
                        result += String(literals[i]) + String(values[i]);
                    }

                    result += literals[literals.length - 1];

                    return posix.join(root, result);
                },

                glob(pattern: string) {
                    return glob.sync(pattern).map((path) => posix.join(root, path));
                }
            });

        chunk.contents = Buffer.from(rendered, encoding);
        chunk.extname = ".html";

        callback(null, chunk);
    });
}
