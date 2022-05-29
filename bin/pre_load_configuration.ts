import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const run = async () => {
    await deletePackageLockFile();
    await deleteBuildFolder();
    execSync(
        [
            "cross-env",
            "npm_config_package_lock=false",
            "npm install",
        ].join(" "),
        {
            stdio: "inherit",
        }
    );
};

const deletePackageLockFile = async () => {
    const filePathOfPackageLockFile = path.join(__dirname, "..", "package-lock.json");
    await fs.promises.rm(filePathOfPackageLockFile, { recursive: true, force: true });
};

const deleteBuildFolder = async () => {
    const folderPath = path.join(__dirname, "..", "dist");
    await fs.promises.rm(folderPath, { recursive: true, force: true });
};

export default run();