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
      "react-scripts test  --watchAll=false",
    ].join(" "),
    {
      stdio: "inherit",
      cwd: path.join(__dirname, ".."),
    }
  );
}

export default main()