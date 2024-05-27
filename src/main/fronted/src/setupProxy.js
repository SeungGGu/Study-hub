const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function (app) {
    // HTTP 요청 프록시 설정
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:8080', // 서버 URL or localhost:설정한포트번호
            changeOrigin: true,
        })
    );
    app.use(
        "/ws",
        createProxyMiddleware({
            target: "http://localhost:8080",
            ws: true,
            changeOrigin: true,
        })
    );
};
