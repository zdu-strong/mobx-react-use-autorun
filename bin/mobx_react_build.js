const path = require("path")
const { execSync } = require("child_process")

async function main() {
  execSync(
    [
      "node",
      "bin/pre_load_configuration.js",
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

module.exports = main()