import path from "node:path";

import { FileStorage } from "@flystorage/file-storage";
import { LocalStorageAdapter } from "@flystorage/local-fs";
import findPackageJson from "find-package-json";

// Find monorepo package.json
const packageJsonFinder = findPackageJson("..");

let rootDirectory = process.env.STORAGE_ROOT_DIR;
if (!rootDirectory) {
	const monorepoPackageJsonPath = packageJsonFinder.next().filename;

	if (!monorepoPackageJsonPath)
		throw new Error("Missing STORAGE_ROOT_DIR environment variable");

	rootDirectory = path.join(path.dirname(monorepoPackageJsonPath), "storage");
}

export const storageDirectory = rootDirectory;
export const storage = new FileStorage(new LocalStorageAdapter(rootDirectory));
