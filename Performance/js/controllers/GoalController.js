"use strict";

(function(Performance, $, serenity) {
    Performance.Controllers.Goal = Performance.Controllers.Base.extend({
        /// <summary>Controller for a goal.</summary>

        __currentView: null,
        
        constructor: function () {
            /// <summary>Constructor for the goal controller.</summary>

            // Call the base class constructor.
            Performance.Controllers.Base.apply(this, arguments);
        },

        _layout: function (args) {
            /// <summary>Load the layout view for a goal page.</summary>
            /// <param name="args.period" type="Performance.Models.Period">Current period.</summary>
            /// <param name="args.goal" type="Performance.Models.Goal">Current goal.</summary>

            var that = this;

            return $.Deferred(function (deferred) {
                // Load the HTML for the layout view.
                that._load("Layout").then(function() {
                    // Instantiate the layout view.
                    var view = new Performance.Views.Goal.Layout({
                        back: function () {
                            /// <summary>Handle the back event.</summary>

                            // Navigate to the period goals page.
                            Performance.App.navigate(serenity.format("/Period/{0}/Goals", args.goal.period.id));
                            },
                        edit: function () {
                            /// <summary>Handle the edit event.</summary>

                            // Navigate to the goal edit page.
                            Performance.App.navigate(serenity.format("/Goal/{0}", args.goal.id));
                        },
                        achievements: function() {
                            /// <summary>Handle the achievements event.</summary>

                            // Navigate to the goal achievements page.
                            Performance.App.navigate(serenity.format("/Goal/{0}/Achievements", args.goal.id));
                        },
                        editAchievements: function () {
                            
                            if (that.__currentView instanceof Performance.Views.Goal.Edit) {
                                that.__currentView.toggleAchievements();
                            }
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
            /// <summary>Load the edit view for the goal page.</summary>
            /// <param name="args.periodId" type="string">Guid of the selected period.</summary>
            /// <param name="args.id" type="string">Guid of the selected goal.</summary>

            var that = this;
            
            // Get the goal and rating lookup values.
            $.when(Performance.Stores.Period.goal(args.id), Performance.Stores.Lookup.rating()).done(function (goal, ratings) {
                // Load the layout view.
                that._layout({ goal: goal }).then(function (layoutView) {
                    // Select the "edit" icon in the layout view.
                    layoutView.select(Performance.GoalDetail.EDIT);
                    // Get the element where the HTML for the edit view will be displayed.
                    var $el = $("#page");
                    // Load the HTML for the edit page into the "#page" element of the layout view.
                    that._load("Edit", $el).then(function () {
                        // Instantiate the edit view.
                        that.__currentView = new Performance.Views.Goal.Edit({
                            save: function (args) {
                                // Save the goal.
                                Performance.Stores.Period.saveGoal(args.goal).then(function (response) {
                                    that.__currentView.saveComplete(response);
                                    // Reload the page.
                                    Performance.App.navigate(serenity.format("/Goal/{0}", args.goal.id));
                                });
                            }
                        }, $el);
                        // Render the edit view.
                        that.__currentView.render();
                        // Load the data into the edit view.
                        that.__currentView.load({ goal: goal, ratings: ratings });
                    });
                });
            });
        },
        
        achievements: function (args) {
            /// <summary>Load the edit view for the goal page.</summary>
            /// <param name="args.periodId" type="string">Guid of the selected period.</summary>
            /// <param name="args.id" type="string">Guid of the selected goal.</summary>

            var that = this;
            
            // Get the goal.
            Performance.Stores.Period.goal(args.id).then(function (goal) {
                // Load the layout view.
                that._layout({ goal: goal }).then(function (layoutView) {
                    // Select the "achievements" icon in the layout view.
                    layoutView.select(Performance.GoalDetail.ACHIEVEMENTS);
                    // Get the element where the HTML for the achievements view will be displayed.
                    var $el = $("#page");
                    // Load the HTML for the achievements page into the "#page" element of the layout view.
                    that._load("Achievements", $el).then(function () {
                        // Instantiate the edit view.
                        that.__currentView = new Performance.Views.Goal.Achievements({
                            edit: function (args) {
                                Performance.App.navigate(serenity.format("/Achievement/{0}", args.id));
                            },
                            add: function (args) {
                                
                                goal.addAchievement();
                                Performance.App.navigate("/Achievement/0");
                            }
                        }, $el);
                        // Render the edit view.
                        that.__currentView.render();
                        // Load the data into the edit view.
                        that.__currentView.load({ goal: goal });
                    });
                });
            });
        }
    });
}(window.Performance, window.jQuery, window.serenity));
