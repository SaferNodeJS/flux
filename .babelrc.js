const presets = [
    ["@babel/react"]
];
const plugins = [
    ["babel-plugin-dev-expression"],
    ["babel-plugin-module-rewrite"],
    ["babel-plugin-module-resolver"],
    ["babel-plugin-module-map"],
    ["@babel/plugin-proposal-class-properties"]
];

module.exports = {
    presets, plugins
};