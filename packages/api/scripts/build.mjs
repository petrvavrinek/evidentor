import path from "node:path";
import esbuild from "esbuild";
import pino from "pino";
import pretty from "pino-pretty"

const logger = pino(pretty());

const projectDir = path.resolve(import.meta.dirname, "..");

const main = async () => {
  logger.info("Starting build");
  const measure = performance.measure("build_start");

  try {

    const options = {
      entryPoints: [path.resolve(projectDir, "src", "main.ts")],
      outdir: path.resolve(projectDir, "build"),
      bundle: true,
      minify: false,
      platform: "node",
      format: "esm",
      tsconfig: "./tsconfig.json"
    }
    const result = await esbuild.build(options);
    logger.info(`Build done in ${measure.duration} ms
      Output directory: ${options.outdir}
      Number of generated files: ${result.outputFiles?.length ?? 0}`
    );

  } catch (e) {
    logger.error(e?.message ?? e);
  }

}

main();