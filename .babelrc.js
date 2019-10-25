const presets = [
    ["@babel/react"]
];
const plugins = [
    ["babel-plugin-dev-expression"],
    ["module-rewrite"],
    ["babel-plugin-module-map"],
    ["@babel/plugin-proposal-class-properties"]
];

module.exports = {
    presets, plugins
};