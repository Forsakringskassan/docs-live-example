const { definePlugin } = require("html-validate");
const pkg = require("../package.json");

module.exports = definePlugin({
    name: pkg.name,
    configs: {
        recommended: require("./recommended"),
    },
});
