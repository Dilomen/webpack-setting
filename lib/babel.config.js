module.exports = () => {
    const presets = [
        [
            '@babel/preset-env'
        ],
        [
            '@babel/preset-react'
        ]
    ];
    const plugins = [
        "@babel/plugin-transform-arrow-functions", "@babel/plugin-proposal-class-properties" 
    ];
    return {
        presets,
        plugins
    };
}