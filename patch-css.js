// Patches a single, known false-positive warning out of Tailwind's
// compiled Preflight reset:
//
//   img,svg,video,canvas,audio,iframe,embed,object {
//     vertical-align: middle;   <-- flagged by VS Code's CSS linter
//     display: block;              as "ignored due to display"
//   }
//
// vertical-align only affects inline/table-cell elements, so it has
// zero visual effect once display:block is also set on the same
// rule — Tailwind ships this combination intentionally as a
// defensive fallback, but editors flag it as dead code. Removing
// vertical-align here changes no rendering behavior; it just quiets
// the warning. This runs automatically after every `build:css` (see
// package.json) so the fix survives future rebuilds instead of
// being silently overwritten by Tailwind's own output.

const fs = require("fs");
const path = require("path");

const cssPath = path.join(__dirname, "output.css");

const OLD_RULE =
    "img,svg,video,canvas,audio,iframe,embed,object{vertical-align:middle;display:block}";

const NEW_RULE =
    "img,svg,video,canvas,audio,iframe,embed,object{display:block}";

let css;

try {

    css = fs.readFileSync(cssPath, "utf8");

} catch (error) {

    console.error(`patch-css: could not read ${cssPath}`, error.message);

    process.exit(1);

}

if (!css.includes(OLD_RULE)) {

    if (css.includes(NEW_RULE)) {

        console.log("patch-css: already patched, nothing to do.");

        process.exit(0);

    }

    console.warn(
        "patch-css: expected Preflight rule not found — Tailwind's " +
        "output may have changed shape (e.g. after a version bump). " +
        "Skipping patch; you may want to re-check this script."
    );

    process.exit(0);

}

css = css.replace(OLD_RULE, NEW_RULE);

fs.writeFileSync(cssPath, css, "utf8");

console.log("patch-css: removed redundant vertical-align from Preflight rule.");
