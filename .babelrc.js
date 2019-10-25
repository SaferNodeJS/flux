const presets = [
    ["@babel/react"]
];
const plugins = [
    ["babel-plugin-dev-expression"],
    ["babel-plugin-module-rewrite"],
    ["babel-plugin-module-resolver"],
    ["babel-plugin-module-map"],
    ["@babel/plugin-proposal-class-properties"],
    ["@babel/plugin-transform-typescript"]
];

export default {
    presets, plugins
};