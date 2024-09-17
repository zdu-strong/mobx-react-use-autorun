import { execSync } from "child_process";
import path from 'path';

async function main() {
  execSync(
    [
      "npx -y tsx",
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
  process.exit();
}

export default main()