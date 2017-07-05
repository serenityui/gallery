"use strict";

(function(Performance, $, serenity) {
    Performance.Models.Lookup = Performance.Models.Document.extend({
        type: null,
        order: null,
        title: null
    });
}(window.Performance, window.jQuery, window.serenity));
