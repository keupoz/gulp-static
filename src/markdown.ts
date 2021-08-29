import MarkdownIt from "markdown-it";
import anchor from "markdown-it-anchor";
// @ts-ignore
import attrs from "markdown-it-attrs";
import toc from "markdown-it-toc-done-right";
import slug from "slug";

export function slugify(text: string) {
    return slug(text);
}

const md = new MarkdownIt({
    html: false,
    linkify: true,
    typographer: true
});

md.use(attrs);

md.use(anchor, {
    slugify,
    permalink: anchor.permalink.ariaHidden({
        placement: "before",
        space: true,
        symbol: "#"
    })
});

md.use(toc, {
    slugify,
    listType: "ul"
});

export function markdown(template: string, inline = true) {
    return inline ? md.renderInline(template) : md.render(template);
}
