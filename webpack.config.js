const webpack = require('webpack');

module.exports = {
    entry: './source/main.js',
    watch: true,
    output: {
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(woff2?|ttf|otf|eot|svg|png|jpg)$/,
                exclude: /node_modules/,
                loader: 'file-loader',
                options: {
                    name: './external/[name].[ext]'
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader'
            }
        ],
    }
};