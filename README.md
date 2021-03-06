# @keupoz/gulp-static

This my personal Gulp config for bundling static websites.

It uses Gulp, Pug, MarkdownIt, Sass and TypeScript.

## Tasks

### `dev`

Initializes `development` environment enabling sourcemaps for CSS and JS, watches for changes and starts `browser-sync` server.

### `build`

Initializes `production` environment enabling minifiers for HTML, CSS and JS and builds the project.

## Structure

```
project
+- dist/
|  +- output_is_here
+- data/
|  +- file.json
|  +- file.yaml
+- assets/
|  +- subdir/
|  +- any_assets
+- src/
   +- scripts/
   |  +- subdirs_are_not_compiled/
   |  +- index.ts
   +- styles/
   |  +- subdirs_are_not_compiled/
   |  +- index.scss
   +- templates/
      +- pages/
         +- about/
         |  +- contacts.md
         |  +- index.pug
         +- index.pug
```

## Entries

Entries name of which starts with underscore (`_`) are ignored.

## Templates

**Entry**: `src/templates/pages/**/*.pug`
**Task**: `templates:full`

### Data

**Entry**: `data/\*_/_.{json,y?(a)ml}`
**Task**: `data`

All data is merged recursively. So you can have a dir and a file called the same name.

## Styles

**Entry**: `src/styles/*.scss`
**Task**: `styles`

## Scripts

**Entry**: `src/scipts/*.ts`
**Task**: `scripts`
