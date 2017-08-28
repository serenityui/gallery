"use strict";

(function(Northwind, $, serenity) {
    Northwind.Models.Document = serenity.Model.extend({
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
}(window.Northwind, window.jQuery, window.serenity));
