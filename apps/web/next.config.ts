import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	output: "standalone",
	experimental: {},
	eslint: {
		ignoreDuringBuilds: true,
	},
	transpilePackages: ["@evidentor/ui"],
};

export default nextConfig;
