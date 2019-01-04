const path = require("path");
const webpack = require("webpack");

module.exports = {
    entry: ["./source/departmentApp.js"],
    output: {
        filename: "bundle.js"
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules,main)/,
            use: {
                loader: "babel-loader",
                options: {
                    presets: ["@babel/preset-env"]
                }
            }
        }]
    }
};
