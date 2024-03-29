import { execSync } from "child_process";
import path from 'path';

async function main() {
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
      "tsc --project tsconfig.build.cjs.json",
    ].join(" "),
    {
      stdio: "inherit",
      cwd: path.join(__dirname, ".."),
    }
  );
  execSync(
    [
      "tsc --project tsconfig.build.es.json",
    ].join(" "),
    {
      stdio: "inherit",
      cwd: path.join(__dirname, ".."),
    }
  );
  process.exit();
}

export default main()