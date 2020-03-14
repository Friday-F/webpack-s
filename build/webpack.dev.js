const path = require('path')
module.exports = {
    mode:"development",
    devServer:{
        contentBase:path.resolve(__dirname,'../dist'), //默认打开根目录，但是希望打开的是dist文件夹
        compress:true,//开启服务器压缩
        port:'3000',//端口号
        open:true //自动打开浏览器
    }
}