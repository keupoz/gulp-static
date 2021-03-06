import PluginError from "plugin-error";
import { Transform } from "stream";
import { obj, TransformCallback } from "through2";
import File, { isVinyl } from "vinyl";

export type PluginFunction = (
    this: Transform,
    chunk: File.BufferFile,
    encoding: BufferEncoding,
    callback: TransformCallback) => void;

export function plugin(name: string, run: PluginFunction) {
    return obj(function (chunk, encoding, callback) {
        if (!isVinyl(chunk)) return callback(new PluginError(name, "Received non-vinyl chunk"));

        if (chunk.isStream()) return callback(new PluginError(name, "Streaming is not supported"));
        else if (chunk.isNull()) return callback(null, chunk);
        else if (chunk.isBuffer()) {
            try {
                return run.call(this, chunk, encoding, callback);
            } catch (err) {
                return callback(new PluginError(name, err));
            }
        } else return callback(new PluginError(name, "Unexpected condition"));
    });
}

export type PluginEmptyFunction = (
    this: Transform,
    chunk: File,
    encoding: BufferEncoding,
    callback: TransformCallback) => void;

export function pluginEmpty(name: string, run: PluginEmptyFunction) {
    return obj(function (chunk, encoding, callback) {
        if (!isVinyl(chunk)) return callback(new PluginError(name, "Received non-vinyl chunk"));

        try {
            return run.call(this, chunk, encoding, callback);
        } catch (err) {
            return callback(new PluginError(name, err));
        }
    });
}
