import MarkdownIt from "markdown-it";

function slugify(text: string) {
    return encodeURIComponent(text.replace(/\s+/g, "-").replace(/(!|\?)/g, "").toLowerCase());
}

const md = new MarkdownIt({
    html: false,
    linkify: true,
    typographer: true
});

md.use(require("markdown-it-attrs"));

md.use(require("markdown-it-anchor"), {
    slugify,
    permalink: true,
    permalinkBefore: true,
    permalinkSymbol: "§"
});

md.use(require("markdown-it-toc-done-right"), {
    slugify,
    listType: "ul"
});

export function markdown(template: string, inline = true) {
    return inline ? md.renderInline(template) : md.render(template);
}
