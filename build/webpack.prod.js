const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path')
// 配置压缩css
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
module.exports = {
    mode:"production",
    plugins:[
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [path.resolve('xxxx/*'),'**/*'],
        })
    ],
    optimization:{
        minimizer:[
            new TerserJSPlugin({}), 
            new OptimizeCSSAssetsPlugin({})
        ]
    }
}