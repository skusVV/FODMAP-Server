const path = require('path');

module.exports = {
  entry: './src/index.js',
  mode: 'production', // Add this line
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'public'),
    libraryTarget: 'commonjs2' // Add this line to handle module exports correctly
  },
  target: 'node',
};