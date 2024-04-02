const { defineMetadata } = require("html-validate");

module.exports = defineMetadata({
    "live-example": {
        flow: true,
        phrasing: true,
        attributes: {
            components: {
                required: false,
            },
            template: {
                required: false,
            },
            livedata: {
                required: false,
            },
            livemethods: {
                required: false,
            },
        },
        slots: ["default"],
    },
});
