"use strict";

(function(Performance, $, serenity, Handlebars) {
    Performance.Views.Goal.Achievements = Performance.Views.Base.extend({

        __templates: {
            tile: Handlebars.compile("<div data-id='{{id}}' class='ui-widget-content app-achievement'><span class='app-achievement-title'>{{title}}</span><i class='fa fa-chevron-circle-right fa-2x app-achievement-details' aria-hidden='true'></i></div>")
        },
        
        __data: null,

        events: [
            "edit",
            "add"
        ],

        _onEditAchievementClick: function (args) {

            var id = $(args.target).parent().attr("data-id");
            this.trigger("edit", { id: id });
        },
        
        _onAddAchievementClick: function (args) {
            
            this.trigger("add", { goalId: this.__data.goal.id });
        },

        render: function () {

            this._widgets.achievements = this.element.find("#achievements");
            this._widgets.achievements.on("click", "i.app-achievement-details", $.proxy(this._onEditAchievementClick, this));
            
            this.element.find(".app-add-achievement").on("click", $.proxy(this._onAddAchievementClick, this));
        },

        load: function (data) {

            this.__data = data;

            var that = this;

            Enumerable.From(data.goal.achievements)
                .Where("achievement => achievement.id !== '0'")
                .ForEach(function (achievement) {
                    that._widgets.achievements.append(that.__templates.tile(achievement));
                });
        }
    });
}(window.Performance, window.jQuery, window.serenity, window.Handlebars));
