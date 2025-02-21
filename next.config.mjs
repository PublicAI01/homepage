import createMDX from '@next/mdx';
import remarkGfm from 'remark-gfm';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
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

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
  },
});

export default withMDX(nextConfig);
