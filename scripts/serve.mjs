import { cp, rm } from "node:fs/promises";
import esbuild from "esbuild";

await rm("public", { recursive: true, force: true });
await cp("dist/main.css", "public/main.css");
await cp("node_modules/vue/dist/vue.esm-browser.js", "public/vue.js");
await cp(
    "node_modules/prettier/standalone.mjs",
    "public/prettier/standalone.mjs",
);
await cp(
    "node_modules/prettier/plugins/html.mjs",
    "public/prettier/plugins/html.mjs",
);

const ctx = await esbuild.context({
    entryPoints: ["./src/local/index.html", "./src/local/index.js"],
    bundle: true,
    format: "esm",
    outdir: "public",
    loader: { ".html": "copy" },
    platform: "browser",
    external: ["vue", "prettier/standalone", "prettier/plugins/html"],
});

const { hosts, port } = await ctx.serve({
    servedir: "public",
    host: "0.0.0.0",
    port: 8080,
});

console.log(`Serving on http://${hosts[0]}:${port}`);
