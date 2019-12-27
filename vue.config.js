module.exports = {
    assetsDir: "static",
    // 修改的配置
    devServer: {
        proxy: {
            '/api': {
                target: 'http://47.100.10.8:5000',
                // target: "http://127.0.0.1:5000",
                changeOrigin: true,
                ws: true,
                // pathRewrite: {
                //   '^/api': '/api'
                // }
            }
        }
    }
}