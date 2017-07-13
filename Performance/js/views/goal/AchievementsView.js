"use strict";

(function(Performance, $, serenity, Handlebars) {
    Performance.Views.Goal.Achievements = Performance.Views.Base.extend({
        /// <summary>The achivements view displays the achievements for a goal.</summary>

        __templates: {
            tile: Handlebars.compile("<div data-id='{{id}}' class='ui-widget-content app-achievement'><span class='app-achievement-title'>{{title}}</span><i class='fa fa-chevron-circle-right fa-2x app-achievement-details' aria-hidden='true'></i></div>")
        },
        
        __data: null,

        events: [
            /// <summary>Events that can be triggered in the edit view.</summary>

            // Edit an achievement.
            "edit",
            // Add an achievement.
            "add"
        ],

        _onEditAchievementClick: function (args) {
            /// <summary>Event handler that is triggered when the achievement details image is clicked.</summary>

            // Get the id for the selected achievement.
            var id = $(args.target).parent().attr("data-id");
            
            // Trigger the event to edit the achievement.
            this.trigger("edit", { id: id });
        },
        
        _onAddAchievementClick: function (args) {
            /// <summary>Event handler that is triggered when the add achievement image is clicked.</summary>
            
            // Trigger the event to add an achievement to the goal.
            this.trigger("add", { goalId: this.__data.goal.id });
        },

        render: function () {
            /// <summary>Render the view.</summary>

            this._widgets.achievements = this.element.find("#achievements");
            this._widgets.achievements.on("click", "i.app-achievement-details", $.proxy(this._onEditAchievementClick, this));
            
            this.element.find(".app-add-achievement").on("click", $.proxy(this._onAddAchievementClick, this));
        },

        load: function (data) {
            /// <summary>Load the data into the view.</summary>

            this.__data = data;

            var that = this;

            // Display the achievements.
            Enumerable.From(data.goal.achievements)
                .Where("achievement => achievement.id !== '0'")
                .ForEach(function (achievement) {
                    that._widgets.achievements.append(that.__templates.tile(achievement));
                });
        }
    });
}(window.Performance, window.jQuery, window.serenity, window.Handlebars));
