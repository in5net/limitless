import { build, emptyDir } from 'https://deno.land/x/dnt@0.31.0/mod.ts';

await emptyDir('./npm');

const dirs: string[] = [];
for await (const { name, isDirectory } of Deno.readDir('./src')) {
  if (isDirectory) dirs.push(name);
}

await build({
  entryPoints: [
    './src/mod.ts',
    ...dirs.map(d => `./src/${d}/mod.ts`),
    './src/api/ao3/work/search.ts'
  ],
  outDir: './npm',
  importMap: './import_map.json',
  packageManager: 'bun',
  compilerOptions: {
    target: 'ES2021'
  },
  shims: {
    deno: {
      test: 'dev'
    },
    timers: true,
    undici: true
  },
  package: {
    name: '@in5net/limitless',
    version: Deno.args[0],
    description: 'A TypeScript library',
    author: 'in5net',
    license: 'MIT',
    repository: {
      type: 'git',
      url: 'git+https://github.com/in5net/limitless.git'
    }
  }
});

Deno.copyFileSync('LICENSE', 'npm/LICENSE');
Deno.copyFileSync('README.md', 'npm/README.md');

const json = Deno.readTextFileSync('npm/package.json');
const pkg = JSON.parse(json);
pkg.exports['./*'] = {
  import: {
    default: './esm/*.js',
    types: './types/*.d.ts'
  },
  require: {
    default: './script/*.js',
    types: './types/*.d.ts'
  }
};
Deno.writeTextFileSync('npm/package.json', JSON.stringify(pkg, null, 2));
