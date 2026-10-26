const path = require("path");
const RemoveEmptyScriptsPlugin = require("webpack-remove-empty-scripts");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    mode: isProduction ? "production" : "development",
    devtool: isProduction ? false : "eval-cheap-source-map",

    entry: {
      bundle: path.resolve(__dirname, "assets/js/index.js"),
      accueil: path.resolve(__dirname, "assets/sass/pages/accueil.scss"),
    },

    output: {
      path: path.resolve(__dirname, "assets/dist"),
      filename: "js/[name].js",
      chunkFilename: "js/[name].[contenthash:8].js",
      publicPath: "auto",
      clean: true,
    },

    resolve: {
      extensions: [".js"],
      alias: {
        "@js": path.resolve(__dirname, "assets/js"),
        "@sass": path.resolve(__dirname, "assets/sass"),
      },
    },

    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              presets: [
                [
                  "@babel/preset-env",
                  {
                    bugfixes: true,
                    modules: false,
                  },
                ],
              ],
            },
          },
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                sourceMap: !isProduction,
              },
            },
            {
              loader: "sass-loader",
              options: {
                implementation: require("sass"),
                sourceMap: !isProduction,
              },
            },
          ],
        },
        {
          test: /\.(woff2?|ttf|eot|otf)$/i,
          type: "asset/resource",
          generator: {
            filename: "fonts/[name][ext]",
          },
        },
        {
          test: /\.(png|jpe?g|gif|svg|webp|avif)$/i,
          type: "asset/resource",
          generator: {
            filename: "images/[name][ext]",
          },
        },
      ],
    },

    plugins: [
      new RemoveEmptyScriptsPlugin(),
      new MiniCssExtractPlugin({
        filename: "css/[name].css",
        chunkFilename: "css/[name].[contenthash:8].css",
      }),
    ],

    optimization: {
      minimize: isProduction,
      minimizer: ["...", new CssMinimizerPlugin()],
      splitChunks: {
        chunks: "async",
      },
      runtimeChunk: false,
    },

    cache: {
      type: "filesystem",
    },

    watchOptions: {
      ignored: /node_modules/,
    },

    performance: {
      hints: false,
    },

    stats: {
      colors: true,
      assets: true,
      modules: false,
      children: false,
      errorDetails: true,
    },
  };
};
