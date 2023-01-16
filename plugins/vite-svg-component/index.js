import { createFilter } from '@rollup/pluginutils';
import * as fs from 'fs';
import { transformWithEsbuild } from 'vite';

const removeExistsFillAttr = (code) => code.replace(/(fill=")(?!(none))[^"]*"/g, '');

export default function viteSvgComponent(options = {}) {
  const {
    exportAsDefault,
    svgrOptions,
    esbuildOptions,
    include = '**/*.svg*',
    exclude,
  } = options;
  const filter = createFilter(include, exclude);
  return {
    name: 'vite:svg-component',
    async transform(code, id) {
      if (filter(id)) {
        const { transform } = await import('@svgr/core');
        let svgCode = await fs.promises.readFile(
          id.replace(/\?.*$/, ''),
          'utf8',
        );

        if (!/\?keepFill$/.test(id)) {
          svgCode = removeExistsFillAttr(svgCode);
        }

        const componentCode = await transform(svgCode, svgrOptions, {
          filePath: id,
          caller: {
            previousExport: exportAsDefault ? null : code,
          },
        });

        const res = await transformWithEsbuild(componentCode, id, {
          loader: 'jsx',
          ...esbuildOptions,
        });

        return {
          code: res.code,
          map: null,
        };
      }
    },
  };
}
