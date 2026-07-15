import fs from "node:fs/promises";
import * as esbuild from "esbuild";
import vuePlugin from "esbuild-plugin-vue3";
import * as sass from "sass";

async function build() {
    const pkg = JSON.parse(await fs.readFile("package.json", "utf8"));
    const { peerDependencies } = pkg;

    const options = {
        entryPoints: ["src/index.ts"],
        outdir: "dist/cjs",
        bundle: true,
        platform: "browser",
        logLevel: "info",
        plugins: [vuePlugin()],
        external: ["vue", "typescript", ...Object.keys(peerDependencies)],
    };

    await esbuild.build({
        ...options,
        outdir: "dist/cjs",
        format: "cjs",
    });

    const result = await esbuild.build({
        ...options,
        outdir: "dist/esm",
        format: "esm",
        metafile: true,
    });
    console.log(await esbuild.analyzeMetafile(result.metafile));

    const sassResult = await sass.compileAsync("main.scss");
    await fs.writeFile("dist/main.css", sassResult.css, "utf8");

    const pkgJson = (type) => JSON.stringify({ type }, null, 2);
    await fs.writeFile("dist/cjs/package.json", pkgJson("commonjs"), "utf8");
    await fs.writeFile("dist/esm/package.json", pkgJson("module"), "utf8");
}

try {
    await build();
} catch (err) {
    console.error(err);
    process.exitCode = 1;
}
