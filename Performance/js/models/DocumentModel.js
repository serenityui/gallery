"use strict";

(function(Performance, $, serenity) {
    Performance.Models.Document = serenity.Model.extend({
        _id: null,

        id: {
            get: function () {
                return this._id;
            },
            set: function (id) {
                this._id = id;
            }
        }
    });
}(window.Performance, window.jQuery, window.serenity));
