"use strict";

(function(Performance, $, serenity) {
    Performance.Controllers.Home = Performance.Controllers.Base.extend({
        /// <summary>Home controller.</summary>

        constructor: function () {
            /// <summary>Constructor for the home controller.</summary>

            // Call the base class constructor.
            Performance.Controllers.Base.apply(this, arguments);
        },
        
        about: function () {
            /// <summary>Show the about page.</summary>
            
            var that = this;
            
            return $.Deferred(function (deferred) {
                // Load the HTML for the about page.
                that._load("About");
            });
        }
    });
}(window.Performance, window.jQuery, window.serenity));
