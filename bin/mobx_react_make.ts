import { execSync } from "child_process";
import path from 'path';
import fs from 'fs'

const run = async () => {
    execSync(
        [
            "cross-env",
            "TS_NODE_SKIP_PROJECT=true",
            "ts-node bin/pre_load_configuration.ts",
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
    execSync(
        [
            "cross-env",
            "tsc -p .",
        ].join(" "),
        {
            stdio: "inherit",
            cwd: path.join(__dirname, "../lib"),
        }
    );
    const folderNameList = await fs.promises.readdir(path.join(__dirname, ".."));
    for (const folderName of folderNameList) {
        if (["output", "node_modules"].includes(folderName)) {
            continue;
        }
        await fs.promises.cp(path.join(__dirname, "..", folderName), path.join(__dirname, "..", "output", folderName), { recursive: true });
    }
    const packageJsonFilePath = path.join(__dirname, "..", "output", "package.json");
    const packageJsonString = await fs.promises.readFile(packageJsonFilePath, "utf8");
    const packageJson = JSON.parse(packageJsonString);
    delete packageJson.devDependencies;
    await fs.promises.writeFile(packageJsonFilePath, JSON.stringify(packageJson));
    execSync(
        [
            "npm publish",
        ].join(" "),
        {
            stdio: "inherit",
            cwd: path.join(__dirname, "../output"),
        }
    );
    await fs.promises.rm(path.join(__dirname, "..", "output"), { recursive: true, force: true })
};

export default run();