"use strict";

(function(Performance, $, serenity, Handlebars) {
    Performance.Views.Goal.Achievements = Performance.Views.Base.extend({

        __templates: {
            tile: Handlebars.compile("<div data-id='{{id}}' class='ui-widget-content app-achievement'><span class='app-achievement-title'>{{title}}</span><i class='fa fa-chevron-circle-right fa-2x app-achievement-details' aria-hidden='true'></i></div>")
        },

        events: [
            "edit"
        ],

        _onEditAchievementClick: function (args) {

            var id = $(args.target).parent().attr("data-id");
            this.trigger("edit", { id: id });
        },

        render: function () {

            this._widgets.achievements = this.element.find("#achievements");

            this._widgets.achievements.on("click", "i.app-achievement-details", $.proxy(this._onEditAchievementClick, this));
        },

        load: function (data) {

            console.log("load", data);

            var that = this;

            Enumerable.From(data.goal.achievements)
                .ForEach(function (achievement) {
                    that._widgets.achievements.append(that.__templates.tile(achievement));
                });
        }
    });
}(window.Performance, window.jQuery, window.serenity, window.Handlebars));
