/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg'),
    );

    config.module.rules.push(
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: /react/, // *.svg?react
        use: ['@svgr/webpack'],
      },
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /react/] },
      },
    );

    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};

export default nextConfig;
