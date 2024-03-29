import { dict, object, string } from "@mojotech/json-type-validation";
import { readFileSync } from "fs";
import YAML from "yaml";

const ICON_PLACEHOLDER = "exclamation-circle";

const iconsDecoder = dict(object({
    unicode: string()
}));

export function initIcons() {
    const configPath = require.resolve("@fortawesome/fontawesome-free/metadata/icons.yml"),
        contents = readFileSync(configPath, { encoding: "utf-8" }),
        config = YAML.parse(contents);

    const ICONS = iconsDecoder.runWithException(config);

    /**
     * Find FontAwesome free icon by name.
     * Search for icons here: https://fontawesome.com/icons?d=gallery&m=free
     * @param name FontAwesome Free icon name
     * @returns Found or fallback icon
     */
    function icon(name: string) {
        const icon = name in ICONS ? ICONS[name] : ICONS[ICON_PLACEHOLDER];

        if (icon === undefined) {
            throw new Error(`Couldn't get icon neither "${name}" nor "${ICON_PLACEHOLDER}" placeholder`);
        }

        return `&#x${icon.unicode};`;
    }

    return icon;
}
