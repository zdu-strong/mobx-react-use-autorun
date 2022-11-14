import { execSync } from "child_process";
import path from 'path';

const run = async () => {
    execSync(
        [
            "npx -y ts-node --skipProject",
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
};

export default run();