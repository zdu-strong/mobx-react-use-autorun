import { execSync } from "child_process";
import path from 'path';

const run = async () => {
  execSync(
    [
      "npx -y -p typescript -p ts-node ts-node --skipProject",
      "bin/pre_load_configuration.ts",
    ].join(" "),

    {
      stdio: "inherit",
      cwd: path.join(__dirname, ".."),
    }
  );
  execSync(
    [
      "tsc -p .",
    ].join(" "),
    {
      stdio: "inherit",
      cwd: path.join(__dirname, "../lib"),
    }
  );
};

export default run();