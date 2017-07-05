"use strict";

(function(Performance, $, serenity) {
    
    Performance.PeriodDetail = {
        /// <summary>Enumeration for the type of detail to view for the selected Period.</summary>

        // View the period edit page.
        EDIT: 0,
        // View the period goals page.
        GOALS: 1,
        // View the period chart page.
        CHART: 2
    };

    Performance.Views.Period.Layout = Performance.Views.Base.extend({
        /// <summary>The layout view displays navigation for the period details.</summary>

        __data: null,

        events: [
            /// <summary>Events that can be triggered in the layout view.</summary>

            // Navigate back to the list of periods.
            "back",
            // View the period edit page.
            "edit",
            // View the goals page.
            "goals"
        ],

        render: function () {
        /// <summary>Render the view.</summary>

            var that = this;

            // Get references to elements in the view.
            this._widgets.back = this.element.find("i.app-back");
            this._widgets.edit = this.element.find("i.app-edit");
            this._widgets.goals = this.element.find("i.app-goals");
            this._widgets.title = this.element.find("span.app-title");

            // When the user clicks the "back" icon, trigger the event to navigate back to the period list.
            this._widgets.back.on("click", function () {
                that.trigger("back");
            });
            // When the user clicks the "edit" icon, trigger the event to navigate to the period edit page.
            this._widgets.edit.on("click", function () {
                that.trigger("edit");
            });
            // When the user clicks the "goals" icon, trigger the event to navigate to the period goals page.
            this._widgets.goals.on("click", function () {
                that.trigger("goals");
            });
        },

        load: function (data) {
            /// <summary>Load the data into the view.</summary>

            this.__data = data;

            this._widgets.title.text(serenity.format("{0} - {1}", data.period.year, data.period.status));
        },

        select: function (page) {
            /// <summary>Show a "navigation" icon as selected for the current page.</summary>

            var $link = null;

            switch (page) {
                // The current page is the edit page.
                case Performance.PeriodDetail.EDIT:
                    $link = this._widgets.edit;
                    break;

                // The current page is the goals page.
                case Performance.PeriodDetail.GOALS:
                    $link = this._widgets.goals;
                    break;
            }

            $link.addClass("app-selected");
        }
    });
}(window.Performance, window.jQuery, window.serenity));
