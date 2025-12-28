const path = require('path')

module.exports = {
  entry: './src/index.tsx',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        // .css 拡張子のファイルを対象とする
        test: /\.css$/,
        // 使用するローダーを指定
        use: [
          'style-loader', // 最後に実行 (DOMにCSSを挿入)
          'css-loader',   // 最初に実行 (CSSをJSモジュールに変換)
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    publicPath: 'dist/',
  },
  devServer: {
    publicPath: '/dist/',
    hot: true,
    open: true,
  }
}
