"use strict";

(function(Performance, $, serenity) {
    Performance.Views.Base = serenity.Observable.extend({

        _widgets: null,

        constructor: function (options, element) {

            serenity.Observable.call(this, options);

            this.element = typeof element === "undefined" ? $("#view") : element;

            this._widgets = {};
        },

        render: function () {

        },

        load: function () {

            return $.Deferred(function(deferred) {
                deferred.resolve();
            });
        }
    });
}(window.Performance, window.jQuery, window.serenity));
