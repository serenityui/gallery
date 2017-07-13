"use strict";

(function(Performance, $, serenity, Handlebars) {
    Performance.Views.Period.Goals = Performance.Views.Base.extend({
        /// <summary>The goals view displays the goals for a period.</summary>

        __templates: {
            tile: Handlebars.compile("<div data-id='{{id}}' class='ui-widget-content app-goal'><span class='app-goal-title'>{{title}}</span><i class='fa fa-chevron-circle-right fa-2x app-goal-details' aria-hidden='true'></i></div>")
        },
        
        __data: null,

        events: [
            /// <summary>Events that can be triggered in the edit view.</summary>

            // Edit a goal.
            "edit",
            // Add a goal.
            "add"
        ],

        _onEditGoalClick: function (args) {
            /// <summary>Event handler that is triggered when the goal details image is clicked.</summary>

            // Get the id for the selected goal.
            var id = $(args.target).parent().attr("data-id");
            
            // Trigger the event to edit the goal.
            this.trigger("edit", { id: id });
        },
        
        _onAddGoalClick: function (args) {
            /// <summary>Event handler that is triggered when the add goal image is clicked.</summary>
            
            // Trigger the event to add a goal to the period.
            this.trigger("add", { periodId: this.__data.period.id });
        },

        render: function () {
            /// <summary>Render the view.</summary>

            this._widgets.goals = this.element.find("#goals");
            this._widgets.goals.on("click", "i.app-goal-details", $.proxy(this._onEditGoalClick, this));
            
            this.element.find(".app-add-goal").on("click", $.proxy(this._onAddGoalClick, this));
        },

        load: function (data) {
            /// <summary>Load the data into the view.</summary>

            this.__data = data;

            var that = this;

            // Display the goals.
            Enumerable.From(data.period.goals)
                .Where("goal => goal.id !== '0'")
                .ForEach(function (goal) {
                    that._widgets.goals.append(that.__templates.tile(goal));
                });
        }
    });
}(window.Performance, window.jQuery, window.serenity, window.Handlebars));
