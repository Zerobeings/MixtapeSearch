const path = require('path');

module.exports = {
  entry: './src/MixtapeSearch.tsx',
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }
      ,{
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    fallback: {
        fs: false, 
        path: false,
        os: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
      },
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'MixtapeSearch.js',
    library: 'MixtapeSearch',
    libraryTarget: 'umd',
    publicPath: '/dist/',
    umdNamedDefine: true,
    globalObject: 'this',
    clean: true,
  },
  externals: {
    sqlite3: 'commonjs sqlite3',
    react: 'react',
    'react-dom': 'react-dom'
  },
};
