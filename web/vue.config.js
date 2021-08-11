module.exports = {
    configureWebpack: {
        devServer: {
            host: '0.0.0.0',
            port: '1024',
            public: process.env.VUE_APP_PUBLIC_HOSTNAME,
            https: true
        }
    }
}
