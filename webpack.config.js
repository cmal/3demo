const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  devtool: 'eval',
  performance: {
    hints: false
  },
  entry: {
    app: './src/index.js'
  },
  devServer: {
    watchContentBase: true,
    contentBase: path.join(__dirname, 'dist'),
    hot: true
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          filename: '[name].bundle.js'
        },
        commons: {
          name: 'vendor',
          chunks: 'all',
          test: /[\\/]node_modules[\\/]/
        }
      }
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.EvalSourceMapDevToolPlugin({
      filename: '[name].js.map',
      exclude: ['vendor.js']
    })
  ]
};
