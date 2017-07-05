"use strict";

(function(Performance, $, serenity) {
    Performance.Controllers.Base = serenity.Observable.extend({
        /// <summary>Base class for all controllers.</summary>

        /// Contains the html for views.
        __views: null,

        constructor: function(options) {
            /// <summary>Constructor for the base controller.</summary>

            // Call the base class constructor.
            serenity.Observable.call(this, options);

            this.__views = {};
        },

        _load: function (viewName, element) {
            /// <summary>Load a view.</summary>
            /// <param name="viewName" type="String">Name of the view to load.</param>
            /// <param name="element" type="jQuery Object" optional="true">
            /// The jQuery element that will contain the html for the view.
            /// If undefined, then default is #view.
            /// </param>

            var that = this;

            return $.Deferred(function (deferred) {
                var $view = typeof element === "undefined" ? $("#view") : element;

                // Determine whether the HTML has been retrieved for this view yet.
                if (typeof that.__views[viewName] === "undefined") {
                    // Get the HTML for this view.
                    $.get(serenity.format("views/{0}/{1}.html?_={2}", that.options.name.toLowerCase(), viewName, (new Date().getTime)()), function (html) {
                        // Store the html for this view.
                        that.__views[viewName] = html;
                        // Display the html.
                        $view.html(html);
                        // Set the controller and view name as attributes of the
                        // element that contains the html for the view.
                        $view.attr("data-controller", that.options.name);
                        $view.attr("data-view", viewName);

                        deferred.resolve();
                    });
                } else {
                    // Display the html.
                    $view.html(that.__views[viewName]);
                    // Set the controller and view name as attributes of the
                    // element that contains the html for the view.
                    $view.attr("data-controller", that.options.name);
                    $view.attr("data-view", viewName);

                    deferred.resolve();
                }
            })
        }
    });
}(window.Performance, window.jQuery, window.serenity));
