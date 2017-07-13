"use strict";

(function(Performance, $, serenity) {
    Performance.Models.Document = serenity.Model.extend({
        /// <summary>A Model based on a MongoDB document.</summary>

        _id: null,

        id: {
            /// <summary>An id property for the _id attribute.</summary>
            
            get: function () {
                return this._id;
            },
            set: function (id) {
                this._id = id;
            }
        }
    });
}(window.Performance, window.jQuery, window.serenity));
