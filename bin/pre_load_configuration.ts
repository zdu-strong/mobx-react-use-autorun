import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const run = async () => {
    await deletePackageLockFile();
    await deleteBuildFolder();
    await deleteOutputFolder();
    execSync(
        [
            "npm install",
            "--no-package-lock",
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

async function deleteOutputFolder(){
    const folderPath = path.join(__dirname, "..", "output");
    await fs.promises.rm(folderPath, { recursive: true, force: true });
}

export default run();