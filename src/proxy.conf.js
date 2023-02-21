const PROXY_CONFIG = [
    {
        context: [
            "/etl-server-test-internal5",
            "/icimrs"
        ],
        target: "https://mrs.intercancer.com/eici",
        secure: false
    },
    {
        context: [
            "/etl-latest",
        ],
        target: "http://localhost:8002",
        secure: false,
        pathRewrite: {
            "^/etl-latest": ""
          },
    }
]

module.exports = PROXY_CONFIG;