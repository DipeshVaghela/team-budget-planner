const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  // mode of webpack build
  mode: "development",

  // entry points
  entry: path.resolve(__dirname, "src/script/index.js"),
  // for hased filename
  // entry: { bundle: path.resolve(__dirname, "src/script/index.js") },

  // exit point
  output: {
    path: path.resolve(__dirname, "docs"),
    filename: "bundle.js",
    // for hased filename
    // filename: "[name][contenthash].js",
    clean: true,
  },

  // configuration of webpack-dev-server
  devServer: {
    static: {
      directory: path.resolve(__dirname, "docs"),
    },
    port: 3000,
    open: true,
    hot: true,
    compress: true,
    historyApiFallback: true,
  },

  // loaders for diffrent assests
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },

  // plugin for html templates
  plugins: [
    new HtmlWebpackPlugin({
      title: "Team Budget Planner",
      fileName: "index.html",
      template: "./src/home.html",
    }),
  ],
};
