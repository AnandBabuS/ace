const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
    mode : 'production',
    entry: {
      login : './src/client/index.js',
      homepage : './src/client/homepage.js'
    },
    output: {
        path: path.resolve(__dirname, "functions", 'public'),
        filename: '[name].js'
      },
      module:{
          rules:[
            {
                test: /\.(js|jsx)$/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                  {
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]'
                    },
                  },
                ]
              }
          ]
      },
      plugins:[
        new MiniCssExtractPlugin({
          filename: '[name].css',
        })
      ]
  };