/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });
    
    // Increase the size limit for assets
    config.performance = {
      ...config.performance,
      maxAssetSize: 1000000, // 1 MB
      maxEntrypointSize: 1000000, // 1 MB
    };
    
    return config;
  },
};

export default nextConfig;