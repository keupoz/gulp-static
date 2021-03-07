import typescript from "@rollup/plugin-typescript";
import nodeExternals from "rollup-plugin-node-externals";
import { terser } from "rollup-plugin-terser";

const isProduction = process.env.NODE_ENV === "production";

/** @type {import("rollup").RollupOptions} */
const config = {
    input: "src/index.ts",
    output: {
        file: "dist/index.js",
        format: "commonjs"
    },
    plugins: [
        nodeExternals({
            deps: true
        }),
        typescript(),
        isProduction && terser()
    ],
    treeshake: isProduction
};

// tslint:disable-next-line: no-default-export
export default config;
