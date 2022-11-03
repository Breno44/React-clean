const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");
const { DefinePlugin } = require("webpack");

module.exports = {
  mode: "development",
  entry: "./src/main/index.tsx",
  output: {
    path: path.join(__dirname, "public/js"),
    publicPath: "/public/js",
    filename: "bundle.js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", "scss"],
    alias: {
      "@": path.join(__dirname, "src"),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
            options: {
              modules: true,
            },
          },
          {
            loader: "sass-loader",
          },
        ],
      },
    ],
  },
  devServer: {
    static: "./public",
    devMiddleware: {
      writeToDisk: true,
    },
    historyApiFallback: {
      rewrites: [{ from: /./, to: "/index.html" }],
    },
  },
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
  },
  plugins: [
    new CleanWebpackPlugin(),
    new DefinePlugin({
      "process.env.API_URL": JSON.stringify("http://fordevs.herokuapp.com/api"),
    }),
  ],
};
