const isProd = process.env.NODE_ENV === "production";

const Tool = require('./devtool/tools')
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// Modify MiniCssExtractPlugin for `server-env`
class ServerMiniCssExtractPlugin extends MiniCssExtractPlugin {
  getCssChunkObject(mainChunk) {
    return {};
  }
}

module.exports = {
  devtool: isProd
    ? 'source-map'
    : 'cheap-module-eval-source-map',
  mode: isProd ? "production" : "development",
  resolve: {
    extensions: [".js", ".css"],
    alias: {
      "@": Tool.rootPath('src'),
      "&": Tool.rootPath('common'),
    }
  },
  module: {
    rules: [
      // 针对.vue单文件组件
      {
        test: /\.vue$/i,
        loader: "vue-loader",
        options: {
          compilerOptions: {
            preserveWhitespace: false,
          },
          extractCSS: isProd
        },
      },
      {
        test: /\.m?js$/,
        exclude: (file) => (/node_modules/.test(file) &&
          !/\.vue\.js/.test(file)),
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-transform-runtime"]
          },
        },
      },
      // `.sass` use separate rule for indent.
      {
        test: /\.sass$/,
        use: [
          isProd ? ServerMiniCssExtractPlugin.loader : 'vue-style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              indentedSyntax: true,
              // sass-loader version >= 8
              sassOptions: {
                indentedSyntax: true
              }
            }
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: [require("autoprefixer")({})],
            },
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          isProd ? ServerMiniCssExtractPlugin.loader : 'vue-style-loader',
          'css-loader',
          'sass-loader',
          {
            loader: "postcss-loader",
            options: {
              plugins: [require("autoprefixer")({})],
            },
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          isProd ? ServerMiniCssExtractPlugin.loader : 'vue-style-loader',
          'css-loader',
          {
            loader: "postcss-loader",
            options: {
              plugins: [require("autoprefixer")({})],
            },
          }
        ]
      },
      // 针对小于2k的静态图片 -> base64
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/i,
        loader: "url-loader",
        options: {
          limit: 2048,
        },
      },
      // 针对小于8k的特殊静态资源
      {
        test: /\.(eot|woff|woff2|ttf|otf)(\?.*)?$/i,
        loader: "file-loader",
        options: {
          limit: 8192,
          name: "[path][name].[ext]",
          outputPath: "static/",
        },
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new ServerMiniCssExtractPlugin()
  ]
};
