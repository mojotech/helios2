const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const PnpWebpackPlugin = require('pnp-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

module.exports = {
  mode: 'development',
  output: {
    filename: 'js/[name]-[contenthash].js',
    chunkFilename: 'js/[name]-[contenthash].chunk.js',
    hotUpdateChunkFilename: 'js/[id]-[hash].hot-update.js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/',
    pathinfo: true,
  },
  resolve: {
    extensions: [
      '.jsx',
      '.js',
      '.sass',
      '.scss',
      '.css',
      '.module.sass',
      '.module.scss',
      '.module.css',
      '.png',
      '.svg',
      '.gif',
      '.jpeg',
      '.jpg',
    ],
    plugins: [PnpWebpackPlugin],
    alias: {
      '@root': __dirname,
      '@app': path.resolve(__dirname, 'app'),
      '@javascript': path.resolve(__dirname, 'app/javascript'),
      '@lib': path.resolve(__dirname, 'app/javascript/lib'),
      '@components': path.resolve(__dirname, 'app/javascript/components'),
      '@widgets': path.resolve(__dirname, 'app/javascript/components/widgets'),
      '@messages': path.resolve(
        __dirname,
        'app/javascript/components/widgets/messages',
      ),
      '@numbers': path.resolve(
        __dirname,
        'app/javascript/components/widgets/numbers',
      ),
      '@weather': path.resolve(
        __dirname,
        'app/javascript/components/widgets/weather',
      ),
      '@twitter': path.resolve(
        __dirname,
        'app/javascript/components/widgets/twitter',
      ),
      '@hocs': path.resolve(__dirname, 'app/javascript/components/hocs'),
      '@assets': path.resolve(__dirname, 'app/assets'),
      '@images': path.resolve(__dirname, 'app/assets/images'),
      '@icons': path.resolve(__dirname, 'app/assets/images/icons'),
    },
    modules: [path.resolve(__dirname, 'app/javascript'), 'node_modules'],
  },
  resolveLoader: {
    modules: ['node_modules'],
    plugins: [PnpWebpackPlugin.moduleLoader(module)],
  },
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
  cache: true,
  devtool: 'cheap-module-source-map',
  devServer: {
    clientLogLevel: 'none',
    compress: true,
    quiet: false,
    disableHostCheck: true,
    host: '0.0.0.0',
    port: 5000,
    https: false,
    hot: false,
    contentBase: path.resolve(__dirname, 'public'),
    inline: true,
    useLocalIp: false,
    public: 'localhost:5000',
    publicPath: '/',
    historyApiFallback: {
      disableDotRule: true,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    overlay: true,
    stats: {
      entrypoints: false,
      errorDetails: false,
      modules: false,
      moduleTrace: false,
    },
    watchOptions: {
      ignored: '**/node_modules/**',
    },
    proxy: [
      {
        context: [
          '/admin',
          '/assets',
          '/graphiql',
          '/graphql',
          '/events',
          '/web_hooks',
        ],
        target: process.env.BACKEND_URI,
      },
    ],
  },
  entry: {
    application: path.resolve(__dirname, 'app/javascript/packs/application.js'),
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        parser: {
          requireEnsure: false,
        },
      },
      {
        test: new RegExp(
          '(.jpg|.jpeg|.png|.gif|.tiff|.ico|.svg|.eot|.otf|.ttf|.woff|.woff2)$',
          'i',
        ),
        use: [
          {
            loader: 'file-loader',
            options: {
              name: function(file) {
                if (file.includes('app/javascript')) {
                  return 'media/[path][name]-[hash].[ext]';
                }
                return 'media/[folder]/[name]-[hash:8].[ext]';
              },
              context: 'app/javascript',
            },
          },
        ],
      },
      {
        test: new RegExp('\\.(css)$', 'i'),
        use: [
          {
            loader: 'style-loader',
            options: {
              hmr: false,
              sourceMap: true,
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 2,
              localIdentName: '[name]__[local]___[hash:base64:5]',
              modules: false,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: __dirname,
              },
              sourceMap: true,
            },
          },
        ],
        sideEffects: true,
        exclude: new RegExp('\\.module\\.[a-z]+$', ''),
      },
      {
        test: new RegExp('\\.(scss|sass)$', 'i'),
        use: [
          {
            loader: 'style-loader',
            options: {
              hmr: false,
              sourceMap: true,
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 2,
              localIdentName: '[name]__[local]___[hash:base64:5]',
              modules: false,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: __dirname,
              },
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
        sideEffects: true,
        exclude: new RegExp('\\.module\\.[a-z]+$', ''),
      },
      {
        test: new RegExp('\\.(css)$', 'i'),
        use: [
          {
            loader: 'style-loader',
            options: {
              hmr: false,
              sourceMap: true,
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 2,
              localIdentName: '[name]__[local]___[hash:base64:5]',
              modules: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: __dirname,
              },
              sourceMap: true,
            },
          },
        ],
        sideEffects: false,
        include: new RegExp('\\.module\\.[a-z]+$', ''),
      },
      {
        test: new RegExp('\\.(scss|sass)$', 'i'),
        use: [
          {
            loader: 'style-loader',
            options: {
              hmr: false,
              sourceMap: true,
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 2,
              localIdentName: '[name]__[local]___[hash:base64:5]',
              modules: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: __dirname,
              },
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
        sideEffects: false,
        include: new RegExp('\\.module\\.[a-z]+$', ''),
      },
      {
        test: new RegExp('\\.(js|mjs)$', ''),
        include: new RegExp('node_modules', ''),
        exclude: new RegExp(
          '(?:@?babel(?:\\/|\\\\{1,2}|-).+)|regenerator-runtime|core-js|webpack',
          '',
        ),
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              presets: [
                [
                  '@babel/preset-env',
                  {
                    modules: false,
                  },
                ],
              ],
              cacheDirectory: 'tmp/cache/webpacker/babel-loader-node-modules',
              cacheCompression: false,
              compact: false,
              sourceMaps: false,
            },
          },
        ],
      },
      {
        test: new RegExp('\\.(js|jsx|mjs)?(\\.erb)?$', ''),
        include: [path.resolve(__dirname, 'app/javascript')],
        exclude: new RegExp('node_modules', ''),
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: 'tmp/cache/webpacker/babel-loader-node-modules',
              cacheCompression: false,
              compact: false,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Helios2',
    }),
    new webpack.EnvironmentPlugin(JSON.parse(JSON.stringify(process.env))),
    new CaseSensitivePathsPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name]-[contenthash:8].css',
      chunkFilename: 'css/[name]-[contenthash:8].chunk.css',
    }),
    new WebpackAssetsManifest({
      integrity: false,
      entrypoints: true,
      writeToDisk: true,
      publicPath: '/',
    }),
  ],
};
