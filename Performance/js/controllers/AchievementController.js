"use strict";

(function(Performance, $, serenity) {
    Performance.Controllers.Achievement = Performance.Controllers.Base.extend({
        /// <summary>Controller for an achievement.</summary>

        constructor: function () {
            /// <summary>Constructor for the achievement controller.</summary>

            // Call the base class constructor.
            Performance.Controllers.Base.apply(this, arguments);
        },

        _layout: function (args) {
            /// <summary>Load the layout view for an achievement page.</summary>
            /// <param name="args.period" type="Performance.Models.Period">Current period.</summary>
            /// <param name="args.goal" type="Performance.Models.Goal">Current goal.</summary>
            /// <param name="args.achievement" type="Performance.Models.Achievement">Current achievement.</summary>

            var that = this;

            return $.Deferred(function (deferred) {
                // Load the HTML for the layout view.
                that._load("Layout").then(function() {
                    // Instantiate the layout view.
                    var view = new Performance.Views.Achievement.Layout({
                        back: function () {
                            /// <summary>Handle the back event.</summary>

                            // Navigate to the goal achievements page.
                            Performance.App.navigate(serenity.format("/Goal/{0}/Achievements", 
                                args.achievement.goal.id));
                        }
                    });
                    // Render the layout view.
                    view.render();
                    // Load the data into the layout view.
                    view.load(args);

                    deferred.resolve(view);
                });
            });
        },

        edit: function (args) {
            /// <summary>Load the edit view for the achievement page.</summary>
            /// <param name="args.id" type="string">Guid of the selected achievement.</summary>

            var that = this;
            
            // Get the achievement.
            Performance.Stores.Period.achievement(args.id).then(function (achievement) {
                if (typeof achievement !== "undefined") {
                    // Load the layout view.
                    that._layout({ achievement: achievement }).then(function (layoutView) {
                        // Get the element where the HTML for the edit view will be displayed.
                        var $el = $("#page");
                        // Load the HTML for the edit page into the "#page" element of the layout view.
                        that._load("Edit", $el).then(function () {
                            // Instantiate the edit view.
                            var view = new Performance.Views.Achievement.Edit({
                                save: function (args) {
                                    // Save the achievement.
                                    Performance.Stores.Period.saveAchievement(args.achievement).then(function (response) {
                                        view.saveComplete(response);
                                        // Reload the page.
                                        Performance.App.navigate(serenity.format("/Achievement/{0}", args.achievement.id));
                                    });
                                }
                            }, $el);
                            // Render the edit view.
                            view.render();
                            // Load the data into the edit view.
                            view.load({ achievement: achievement });
                        });
                    });
                } else {
                    // The achievement was not found.  Return to the home page.
                    Performance.App.navigate("/");
                }
            });
        }
    });
}(window.Performance, window.jQuery, window.serenity));
