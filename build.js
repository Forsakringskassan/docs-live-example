const fs = require("node:fs/promises");
const esbuild = require("esbuild");
const vuePlugin = require("esbuild-plugin-vue3");
const sass = require("sass");

async function build() {
    const pkg = JSON.parse(await fs.readFile("package.json", "utf-8"));
    const { peerDependencies } = pkg;

    const result = await esbuild.build({
        entryPoints: ["src/index.ts"],
        outdir: "dist",
        bundle: true,
        format: "cjs",
        platform: "node",
        logLevel: "info",
        metafile: true,
        plugins: [vuePlugin()],
        external: ["vue", "typescript", ...Object.keys(peerDependencies)],
    });
    console.log(await esbuild.analyzeMetafile(result.metafile));

    const sassResult = await sass.compileAsync("main.scss");
    await fs.writeFile("dist/main.css", sassResult.css, "utf-8");
}

build().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
