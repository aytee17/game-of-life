const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackExternalsPlugin = require("html-webpack-externals-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PostCssPresetEnv = require("postcss-preset-env");

module.exports = {
    entry: {
        app: "./src/index.js"
    },
    output: {
        path: path.resolve(__dirname, "dist")
    },
    plugins: [
        new HtmlWebpackPlugin({
            minify: true,
            title: "Game of Life",
            meta: {
                viewport: "width=device-width,initial-scale=1"
            }
        }),
        new HtmlWebpackExternalsPlugin({
            externals: [
                {
                    module: "noto-sans",
                    entry: {
                        path:
                            "https://fonts.googleapis.com/css?family=Noto+Sans",
                        type: "css"
                    }
                },
                {
                    module: "source-code-pro",
                    entry: {
                        path:
                            "https://fonts.googleapis.com/css?family=Source+Code+Pro",
                        type: "css"
                    }
                }
            ]
        })
    ],
    module: {
        rules: [
            {
                test: /\.svg$/,
                use: { loader: "svg-url-loader" }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/,
                use: [{ loader: "style-loader" }, { loader: "css-loader" }]
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: "css-hot-loader",
                        options: {
                            cssModule: true
                        }
                    },
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                            importLoaders: 2,
                            sourceMap: true
                        }
                    },
                    {
                        loader: "postcss-loader",
                        ident: "post-css",
                        options: {
                            ident: "postcss",
                            plugins: [PostCssPresetEnv()]
                        }
                    },
                    {
                        loader: "sass-loader"
                    }
                ]
            }
        ]
    }
};
