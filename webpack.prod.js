const merge = require("webpack-merge");
const webpack = require("webpack");
const common = require("./webpack.config.js");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
    .BundleAnalyzerPlugin;
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = merge.smart(common, {
    mode: "production",
    output: {
        filename: "[name].[contenthash].js"
    },
    optimization: {
        runtimeChunk: "single",
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "initial"
                }
            }
        }
    },
    plugins: [
        new CleanWebpackPlugin(["dist"]),
        new MiniCssExtractPlugin({
            filename: "[name].style.[contenthash].css"
        }),
        new webpack.HashedModuleIdsPlugin(),
        new BundleAnalyzerPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: "css-loader",
                        options: {
                            minimize: true,
                            localIdentName: "[local]_[hash:base64:5]"
                        }
                    }
                ]
            }
        ]
    }
});
