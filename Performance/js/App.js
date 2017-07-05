"use strict";

var Performance = {
    Models: {},
    Controllers: {},
    Views: {
        Period: {},
        Goal: {},
        Achievement: {}
    },
    Stores: {}
};

Performance.App = function ($, serenity) {

    var __controllers = {};
    var __router = null;

    function init() {

        __router = new Performance.Router();
        __router.start();

    }

    function controller(name) {

        if (typeof __controllers[name] === "undefined") {
            __controllers[name] = new Performance.Controllers[name]({
                name: name
            });
        }
        return __controllers[name];
    }

    function navigate(path) {
        return __router.navigate(path);
    }

    return {
        init: init,
        controller: controller,
        navigate: navigate
    }
}(jQuery, window.serenity);

$(function () {
    Performance.App.init();
});
