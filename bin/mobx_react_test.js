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
      "react-scripts test  --watchAll=false",
    ].join(" "),
    {
      stdio: "inherit",
      cwd: path.join(__dirname, ".."),
    }
  );
  process.exit();
}

module.exports = main()