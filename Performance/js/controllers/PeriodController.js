"use strict";

(function(Performance, $, serenity) {
    Performance.Controllers.Period = Performance.Controllers.Base.extend({
        /// <summary>Controller for performance periods.</summary>

        constructor: function () {
            /// <summary>Constructor for the period controller.</summary>

            // Call the base class constructor.
            Performance.Controllers.Base.apply(this, arguments);
        },

        list: function () {
            /// <summary>Load the view with the list of periods.</summary>

            // Load the HTML for the list view.
            this._load("List").then(function () {
                // Get the list of performance periods.
                Performance.Stores.Period.list().then(function (periods) {
                    // Instantiate the list view.
                    var view = new Performance.Views.Period.List({
                        select: function (args) {
                            /// <summary>Handle the select period event.</summary>

                            // Navigate to the period edit page.
                            Performance.App.navigate(serenity.format("/Period/{0}", args.id));
                        }
                    });
                    // Render the list view.
                    view.render();
                    // Load the data into the list view.
                    view.load({ periods: periods });
                });
            });
        },

        _periodLayout: function (id) {
            /// <summary>Load the layout view for a period page.</summary>
            /// <param name="id" type="string">Guid of the selected period.</summary>

            var that = this;

            return $.Deferred(function (deferred) {
                // Load the HTML for the layout view.
                that._load("Layout").then(function() {
                    // Get the current performance period.
                    Performance.Stores.Period.get(id).then(function (period) {
                        // Instantiate the layout view.
                        var view = new Performance.Views.Period.Layout({
                            back: function () {
                            /// <summary>Handle the back event.</summary>

                            // Navigate to the period list page.
                                Performance.App.navigate("/");
                            },
                            edit: function () {
                                /// <summary>Handle the edit event.</summary>

                                // Navigate to the period edit page.
                                Performance.App.navigate(serenity.format("/Period/{0}", id));
                            },
                            goals: function() {
                                /// <summary>Handle the goals event.</summary>

                                // Navigate to the period goals page.
                                Performance.App.navigate(serenity.format("/Period/{0}/Goals", id));
                            }
                        });
                        // Render the layout view.
                        view.render();
                        // Load the data into the layout view.
                        view.load({ period: period });

                        deferred.resolve(view);
                    });
                });
            });
        },

        edit: function (id) {
            /// <summary>Load the edit view for a period page.</summary>
            /// <param name="id" type="string">Guid of the selected period.</summary>

            var that = this;
            
            // Load the layout view.
            this._periodLayout(id).then(function (layoutView) {
                // Select the "edit" icon in the layout view.
                layoutView.select(Performance.PeriodDetail.EDIT);
                // Get the element where the HTML for the edit view will be displayed.
                var $el = $("#page");
                // Load the HTML for the edit page into the "#page" element of the layout view.
                that._load("Edit", $el).then(function () {
                    // Get the current performance period.
                    $.when(Performance.Stores.Period.get(id), Performance.Stores.Lookup.periodStatus()).then(function (period, statusList) {
                        // Instantiate the edit view.
                        var view = new Performance.Views.Period.Edit({}, $el);
                        // Render the edit view.
                        view.render();
                        // Load the data into the edit view.
                        view.load({ period: period, statusList: statusList });
                    });
                });
            });
        },

        goals: function (id) {
            /// <summary>Load the goals view for a period page.</summary>
            /// <param name="id" type="string">Guid of the selected period.</summary>

            var that = this;
            
            // Load the layout view.
            this._periodLayout(id).then(function (detailView) {
                // Get the element where the HTML for the edit view will be displayed.
                var $el = $("#page");
                // Select the "goals" icon in the layout view.
                detailView.select(Performance.PeriodDetail.GOALS);
                // Load the HTML for the goals page into the "#page" element of the layout view.
                that._load("Goals", $el).then(function () {
                    // Get the current performance period.
                    Performance.Stores.Period.get(id).then(function (period) {
                        // Instantiate the goals view.
                        var view = new Performance.Views.Period.Goals({
                            edit: function (args) {
                                Performance.App.navigate(serenity.format("/Goal/{0}", args.id));
                            }
                        }, $el);
                        // Render the goals view.
                        view.render();
                        // Load the data into the goals view.
                        view.load({ period: period });
                    });
                });
            });
        }
    });
}(window.Performance, window.jQuery, window.serenity));
