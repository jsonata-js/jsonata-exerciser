var path = require('path');
module.exports = {
  entry: './slack-invite.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  target: 'node'
};
