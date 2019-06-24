const path = require('path');
const webpack = require("webpack");

const nodeExternals = require("webpack-node-externals")

module.exports = {
    externals: [
        nodeExternals()
    ],
    mode: "production",
    entry: "./src/server/index.js",
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "./", "functions"),
        libraryTarget: "commonjs2"
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                use: 'babel-loader'
            },{
                test: /\.(ejs)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: '[name].[ext]',
                            outputPath: "views"
                        }
                    }
                ]
            }
        ]
    }
}