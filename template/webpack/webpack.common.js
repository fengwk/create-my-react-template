const path = require('node:path'); // 旧的node版本为require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const lessRegex = /\.less$/;
const lessModuleRegex = /\.module\.less$/;

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      plugins: [
        [
          'autoprefixer',
          {
            overrideBrowserslist: [
              '> 1%',
              'last 2 versions'
            ]
          },
        ],
      ],
    },
  },
};

// https://webpack.docschina.org/loaders/css-loader/
const cssLoader = {
  loader: 'css-loader',
  options: {
    modules: { // 支持css模块化，允许将css文件像js模块一样被导入
      localIdentName: '[local]_[hash:base64:5]',
    },
  },
};

// 将obj1和obj2深度合并，如果产生冲突以obj2为主
function deepMerge(obj1, obj2) {
  const result = {};
  // 遍历obj1的属性
  Object.keys(obj1).forEach((key) => {
    if (obj1.hasOwnProperty(key)) {
      if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
        result[key] = deepMerge(obj1[key], obj2[key]);
      } else {
        result[key] = obj2[key] || obj1[key];
      }
    }
  });
  // 遍历obj2的属性
  Object.keys(obj2).forEach((key) => {
    if (obj2.hasOwnProperty(key)) {
      if (!result.hasOwnProperty(key)) {
        result[key] = obj2[key];
      }
    }
  });
  return result;
}

// 导出一个合并函数用于生成新的配置信息
module.exports = function(config) {
  // 基础配置信息
  const commonConfig = {
    entry: path.resolve(__dirname, '..', 'src', 'index.js'),
    output: {
      filename: '[chunkhash:8].js',
      path: path.resolve(__dirname, '..', 'dist'),
      assetModuleFilename: 'asset/[hash:8][ext][query]'
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                plugins: [
                  // 仅在开发模式下启用react-refresh热更新
                  config.mode == 'development' && require.resolve('react-refresh/babel')
                ].filter(Boolean)
              }
            }
          ],
        },
        {
          test: cssRegex,
          exclude: cssModuleRegex,
          use: [
            MiniCssExtractPlugin.loader,
            cssLoader,
            postcssLoader
          ],
          // 在package.json中如果错误设置sideEffects为false，webpack在打包时会认为整个项目都是无副作用的
          // 部分三方库会错误设置sideEffects参数，此时如果引入其中的css文件import xxx/xxx.css会出现问题
          // 由于没有在js代码中使用引入的css文件，webpack会认为这个模块的引入是可以忽略的（因为该库被声明为无副作用）
          // 这样就会导致css文件不会被打包，从而导致样式丢失
          // See https://github.com/webpack/webpack/issues/6571
          sideEffects: true,
        },
        {
          test: cssModuleRegex,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            postcssLoader
          ],
          sideEffects: true,
        },
        {
          test: lessRegex,
          exclude: lessModuleRegex,
          use: [
            MiniCssExtractPlugin.loader,
            cssLoader,
            postcssLoader,
            'less-loader'
          ],
          sideEffects: true,
        },
        {
          test: lessModuleRegex,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            postcssLoader,
            'less-loader'
          ],
          sideEffects: true,
        },
        {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            'babel-loader',
            {
              loader: '@svgr/webpack', // 将svg转换为react组件
              options: {
                babel: false,
                icon: true,
              },
            }
          ]
        },
        {
          test: /\.(png|jpg|gif)$/,
          type: 'asset/resource'
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          type: 'asset/resource'
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(), // 自动清理构建产物
      new MiniCssExtractPlugin({ // 提取css到文件中
        // filename: '[contenthash:8].css' // 使用hash命名css文件名称
        // 使用hash值会导致热更新失效，生产环境再使用hash值
        // https://blog.csdn.net/weixin_42349568/article/details/124287361
        filename: config.mode == 'development' && '[name].css' || '[contenthash:8].css'
      }),
      new HtmlWebpackPlugin({ // 如果是多页面应用可以添加多个HtmlWebpackPlugin
        template: path.resolve(__dirname, '..', 'src', 'index.html'), // 指定模板html文件名称
        filename: 'index.html', // 指定生成的html文件名称
        // chunks: ['index'], // 指定要插入的chunk
        inject: 'body', // 将js文件插入到body之后
        title: '{{projectName}}', // 标题，将注入到模板当中
        minify: { // 压缩html
          collapseWhitespace: true,
          keepClosingSlash: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true
        }
      }),
      new ESLintPlugin()
    ]
  };

  // 合并
  return deepMerge(commonConfig, config);
};
