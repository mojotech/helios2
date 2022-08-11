const chokidar = require('chokidar');
const esbuild = require('esbuild');
const liveServer = require('live-server');
const proxy = require('proxy-middleware');
const url = require('url');
const path = require('path');
const copyStaticFiles = require('esbuild-copy-static-files');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const envObject = Object.entries(process.env);
const envObjectFormatted = envObject.map((item) => [
  `process.env.${item[0]}`,
  JSON.stringify(item[1]),
]);
const defineWithoutGlobal = Object.fromEntries(envObjectFormatted);
const define = Object.assign(defineWithoutGlobal, { global: 'window' });

const frontendUrl = new URL(process.env.FRONTEND_URL);
const backendUrl = new URL(process.env.BACKEND_URL);

const watchDirectories = [
  './*.{js,json,env}',
  'app/javascript/**/*.{js,jsx,json,html}',
];

const buildConfig = {
  color: true,
  logLevel: 'info',
  entryPoints: ['app/javascript/packs/application.js'],
  bundle: true,
  minify: true,
  outfile: 'server-phoenix/priv/static/assets/application.js',
  define,
  publicPath: '/assets',
  plugins: [
    copyStaticFiles({
      src: 'node_modules/@handtracking.io/yoha/models',
      dest: 'server-phoenix/priv/static/assets/yoha',
      recursive: true,
    }),
    //  Ideally this is one .../dist/*.wasm
    copyStaticFiles({
      src: 'node_modules/@tensorflow/tfjs-backend-wasm/dist/tfjs-backend-wasm.wasm',
      dest: 'server-phoenix/priv/static/assets/tensor/tfjs-backend-wasm.wasm',
      recursive: false,
    }),
    copyStaticFiles({
      src: 'node_modules/@tensorflow/tfjs-backend-wasm/dist/tfjs-backend-wasm-simd.wasm',
      dest: 'server-phoenix/priv/static/assets/tensor/tfjs-backend-wasm-simd.wasm',
      recursive: false,
    }),
    copyStaticFiles({
      src: 'node_modules/@tensorflow/tfjs-backend-wasm/dist/tfjs-backend-wasm-threaded-simd.wasm',
      dest: 'server-phoenix/priv/static/assets/tensor/tfjs-backend-wasm-threaded-simd.wasm',
      recursive: false,
    }),
  ],
  metafile: true,
  external: ['node_modules'],
  loader: {
    '.js': 'jsx',
    '.mjs': 'jsx',
    '.png': 'file',
    '.sass': 'file',
    '.css': 'css',
    '.scss': 'css',
    '.module.sass': 'css',
    '.module.scss': 'css',
    '.module.css': 'css',
    '.gif': 'file',
    '.jpeg': 'file',
    '.jpg': 'file',
    '.html': 'text',
    '.svg': 'file',
    '.eot': 'file',
    '.woff': 'file',
    '.woff2': 'file',
    '.ttf': 'file',
  },
  incremental: process.argv.includes('--serve'),
};

const buildServer = async (options = {}) => {
  esbuild
    .build({
      ...options,
    })
    // eslint-disable-next-line
    .catch((err) => console.error(err));
};

async function serve() {
  const result = await esbuild.build(buildConfig);

  chokidar
    .watch(watchDirectories, { awaitWriteFinish: true, ignoreInitial: true })
    .on('all', async (eventName, eventPath) => {
      // eslint-disable-next-line
      console.log(`${eventPath} ${eventName}`);
      await result.rebuild();
    });

  liveServer.start({
    root: 'server-phoenix/priv/static/',
    file: 'index.html',
    open: false,
    port: parseInt(frontendUrl.port, 10),
    middleware: [
      proxy({
        ...url.parse(`${frontendUrl}/graphiql`),
        port: backendUrl.port,
        route: '/graphiql',
      }),
      proxy({
        ...url.parse(`${frontendUrl}/graphql`),
        port: backendUrl.port,
        route: '/graphql',
      }),
      proxy({
        ...url.parse(`${frontendUrl}/admin`),
        port: backendUrl.port,
        route: '/admin',
      }),
      proxy({
        ...url.parse(`${frontendUrl}/torch`),
        port: backendUrl.port,
        route: '/torch',
      }),
      proxy({
        ...url.parse(`${frontendUrl}/assets`),
        port: backendUrl.port,
        route: '/assets',
      }),
      proxy({
        ...url.parse(`${frontendUrl}/events`),
        port: backendUrl.port,
        route: '/events',
      }),
      proxy({
        ...url.parse(`${frontendUrl}/images`),
        port: backendUrl.port,
        route: '/images',
      }),
    ],
    logLevel: 0,
  });
}

if (!process.argv.includes('--serve')) {
  buildServer(buildConfig);
} else {
  serve();

  // eslint-disable-next-line
  console.log(`[esbuild] Serving on port ${frontendUrl.port}...`);
}
