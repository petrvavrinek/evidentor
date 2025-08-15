import path from "node:path";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
	/* config options here */
	output: "standalone",
	experimental: {},
	eslint: {
		ignoreDuringBuilds: true,
	},
	transpilePackages: ["@evidentor/ui"],
	// There is issue with monorepo building. See more https://github.com/oven-sh/bun/issues/17310
	outputFileTracingRoot: path.resolve(__dirname, '../../'),
	trailingSlash: true,
	skipTrailingSlashRedirect: true
};


const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
