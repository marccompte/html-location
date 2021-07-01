const path = require('path');
const glob = require('glob');

const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const PurgeCSSPlugin = require('purgecss-webpack-plugin');
// const WebpackObfuscator = require('webpack-obfuscator');

const PATHS = {
  src: path.join(__dirname, 'source')
}

module.exports = {
  mode: 'development',
  watch: true,
  plugins: [
    new MiniCssExtractPlugin(),
    // new WebpackObfuscator ({
    //     rotateStringArray: true
    // }, ['excluded_bundle_name.js']),
    // new PurgeCSSPlugin({
    //     paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }),
    //   })
  ],
  watchOptions: {
    ignored: path.resolve(__dirname, './node_modules'),
  },
  entry: [
    './source/index.js',  // path to our input file
    // './source/styles.scss'
  ],
  devServer: {
    contentBase: './dist',
    port: 4444,
    host: '0.0.0.0',
    disableHostCheck: true,
  },
  output: {
    filename: 'leaflet-location-component.js',  // output bundle file name
    path: path.resolve(__dirname, './dist'),  // path to our Django static directory
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          // "style-loader",
          "css-loader"],
      },
      {
       test: /\.(svg|woff|woff2|ttf|eot|otf)$/,
       use: 'file-loader?name=fonts/[name].[ext]!static'
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          // Creates `style` nodes from JS strings
          // "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        loader: 'url-loader'
      },
      // {
      //   test: /\.js$/,
      //   exclude: [
      //       path.resolve(__dirname, 'excluded_file_name.js')
      //   ],
      //   enforce: 'post',
      //   use: {
      //       loader: WebpackObfuscator.loader,
      //       options: {
      //           rotateStringArray: true
      //       }
      //   }
      // }
    ],
  },
  optimization: {
    minimizer: [
      // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
      // `...`,
      new CssMinimizerPlugin(),
    ],
    // splitChunks: {
    //   cacheGroups: {
    //     styles: {
    //       name: 'styles',
    //       test: /\.css$/,
    //       chunks: 'all',
    //       enforce: true
    //     }
    //   }
    // }
  },
};
