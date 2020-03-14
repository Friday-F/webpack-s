const path = require('path');
const merge = require('webpack-merge')
// 开发环境
const dev = require('./webpack.dev')
// 生产环境
const prod = require('./webpack.prod')
// 配置可以自动打包html,并打包
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 因为当前的样式都是style插入到页面中，我们需要生产环境是用link方式引入css样式，引入mini-css-extract-plugin
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
//  vue-loader 插件
const VueLoaderPlugin = require('vue-loader/lib/plugin');

// 对没有用的css代码不进行打包
const PurifyCSSPlugin = require('purifycss-webpack')
const glob = require('glob');
module.exports = (env) =>{
    const isDev = env.development;
    const base = {
        // 入口
        entry: path.resolve(__dirname, "../src/index.js"),
        module:{
            rules:[
                {
                    test:/\.css$/,
                    use: [
                        // 如果是生产环境，进行抽离css
                        !isDev && MiniCssExtractPlugin.loader,
                        isDev && "style-loader",
                        {
                            loader:"css-loader",
                            // 在css文件中可能会使用@import引入css样式，被引入的可能还会引入less
                            options:{
                                importLoaders:1
                            }
                        }
                        
                    ].filter(Boolean)
                },
                // less配置
                {
                    test:/\.less$/,
                    use:[
                        !isDev && MiniCssExtractPlugin.loader,
                        isDev && 'style-loader',
                        'css-loader',
                        'less-loader'
                    ].filter(Boolean)
                },
                {
                    test:/\.jpe?g|png|gif/,
                    use:[
                        {
                            loader:'file-loader',
                            options:{
                                name:`img/[name].[ext]`
                            },
                        },
                        !isDev && {
                            loader: 'image-webpack-loader',
                            options: {
                              //   bypassOnDebug: true,
                              mozjpeg: {
                                progressive: true,
                                quality: 65
                              },
                              optipng: {
                                enabled: false,
                              },
                              pngquant: {
                                quality: '65-90',
                                speed: 4
                              },
                              gifsicle: {
                                interlaced: false,
                              }
                            },
                        }
                        
                    ].filter(Boolean)

                },
                {
                    test:/woff|ttf|eot|svg|otf/,
                    use:{
                        loader:'file-loader'
                    }
                } ,
                {
                    test:/\.jpe?g|png|gif/,
                    loader:'url-loader',
                    options:{
                        limit:100*1024,
                        name:`img/[name].[ext]`
                    }
                },
                {
                    test:/\.js$/,
                    use:{
                        loader:'babel-loader'
                    }
                },
                {
                    test:/\.vue$/,
                    use:{
                        loader:'vue-loader'
                    }
                }
            ]
        },
        plugins:[
            !isDev && new PurifyCSSPlugin({
                paths: glob.sync(path.join(__dirname, 'src/*.html')),
            }),
            new VueLoaderPlugin(),
            !isDev && new MiniCssExtractPlugin({
                // - Hash整个项目的hash值
                // - chunkhash 根据入口产生hash值
                // - contentHash 根据每个文件的内容产生的hash值
                filename:"css/[name].[contentHash].css"
            }),
            new HtmlWebpackPlugin({
                filename:"index.html", //打包出来的文件名称
                template:path.resolve(__dirname,'../index.html'), //打包谁
                hash:true,
                minify:{
                    removeAttributeQuotes:true //删除属性双引号
                }
            })
        ].filter(Boolean),
        output:{
            filename:"[name].js", //打包出来的文件
            path:path.resolve(__dirname,'../dist') //打包到哪个文件夹
        },
    }

    if(env.development){
        return merge(base,dev);
    }else{
        return merge(base,prod)
    }
}