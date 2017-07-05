"use strict";

(function(Performance, $, serenity) {
    Performance.Router = serenity.Router.extend({
        /// <summary>Client-side router to provide navigation for a single-page application.</summary>

        constructor: function () {
            /// <summary>Constructor for the router.</summary>

            // Call the base class constructor and set the root option to "/".
            serenity.Router.call(this, { root: "/" });

            // Initialize routes.
            this.__initRoutes();
        },

        __initRoutes: function () {
            /// <summary>Initialize the routes.</summary>

            //
            // Period List
            //

            // Default to the list of periods.
            this.add("/", function () {
                Performance.App.controller("Period").list(null);
            });

            //
            // Period
            //

            // Period details.
            this.add("/Period/:id", function (params) {
                // Call the PeriodController.edit function.
                Performance.App.controller("Period").edit(params.id);
            });

            // Period goals.
            this.add("/Period/:id/Goals", function (params) {
                // Call the PeriodController.goals function.
                Performance.App.controller("Period").goals(params.id);
            });

            //
            // Goal
            //

            // Goal details.
            this.add("/Goal/:id", function (params) {
                // Call the GoalController.edit function.
                Performance.App.controller("Goal").edit(params);
            });

            // Goal achievements.
            this.add("/Goal/:id/Achievements", function (params) {
                // Call the GoalController.edit function.
                Performance.App.controller("Goal").achievements(params);
            });

            //
            // Achievement
            //

            // Achievement details.
            this.add("/Achievement/:id", function (params) {
                // Call the AchievementController.edit function.
                Performance.App.controller("Achievement").edit(params);
            });
        }
    });
}(window.Performance, window.jQuery, window.serenity));
