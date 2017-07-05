"use strict";

(function(Performance, $, serenity) {
    Performance.Views.Period.Goals = Performance.Views.Base.extend({

        __templates: {
            tile: Handlebars.compile("<div data-id='{{id}}' class='ui-widget-content app-goal'><span class='app-goal-title'>{{title}}</span><i class='fa fa-chevron-circle-right fa-2x app-goal-details' aria-hidden='true'></i></div>")
        },

        events: [
            "edit"
        ],

        _onEditGoalClick: function (args) {

            var id = $(args.target).parent().attr("data-id");
            this.trigger("edit", { id: id });
        },

        render: function () {

            this._widgets.goals = this.element.find("#goals");

            this._widgets.goals.on("click", "i.app-goal-details", $.proxy(this._onEditGoalClick, this));
        },

        load: function (data) {

            console.log("load", data);

            var that = this;

            Enumerable.From(data.period.goals)
                .ForEach(function (goal) {
                    that._widgets.goals.append(that.__templates.tile(goal));
                });
        }
    });
}(window.Performance, window.jQuery, window.serenity));
