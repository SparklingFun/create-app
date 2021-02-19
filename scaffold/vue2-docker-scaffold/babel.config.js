module.exports = {
    presets: [
        [
            "@babel/preset-env", {
                useBuiltIns: "usage",
                corejs: "3",
                targets: {
                    browsers: ['last 5 versions', 'safari >= 8', 'ie >= 9']
                }
            }
        ],
        '@babel/preset-react'
    ],
    plugins: [
        ["@babel/plugin-transform-runtime", { "regenerator": true }],
        "@babel/plugin-transform-modules-commonjs",
        "@babel/plugin-transform-arrow-functions"
    ]
};