var path = require('path');

function root(dir) {
  return path.join.apply(path, [__dirname].concat(Array.prototype.slice.call(arguments)));
}

module.exports = {
  devtool: 'inline-source-map',
  resolve: {
    root: [root(), root('lib')]
  },
  output: {
    path: root(),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        exclude: /(node_modules|bower_components)/,
        include: root()
      },
      {
        test: /\.css$/,
        loader: 'style!css'
      }
    ]
  }
};
