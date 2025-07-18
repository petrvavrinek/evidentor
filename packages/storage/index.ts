import { FileStorage } from "@flystorage/file-storage";
import { LocalStorageAdapter } from "@flystorage/local-fs";
import findPackageJson from "find-package-json";

// Find monorepo package.json
const packageJsonFinder = findPackageJson("..");

const rootDirectory =
	process.env.STORAGE_ROOT_DIR ?? packageJsonFinder.next().filename;
if (!rootDirectory)
	throw new Error("Missing STORAGE_ROOT_DIR environment variable");

export const storageDirectory = rootDirectory;
export const storage = new FileStorage(new LocalStorageAdapter(rootDirectory));
