module.exports = () => {
    const presets = [
        [
            '@babel/preset-env'
        ],
        [
            '@babel/preset-react'
        ]
    ];
    const plugins = [];
    return {
        presets,
        plugins
    };
}