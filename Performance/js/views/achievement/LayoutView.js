"use strict";

(function(Performance, $, serenity) {
    
    Performance.Views.Achievement.Layout = Performance.Views.Base.extend({
        /// <summary>The layout view displays navigation for the achievement details.</summary>

        __data: null,

        events: [
            /// <summary>Events that can be triggered in the layout view.</summary>

            // Navigate back to the list of achievements.
            "back"
        ],

        render: function () {
            /// <summary>Render the view.</summary>

            var that = this;
            
            // Get references to elements in the view.
            this._widgets.back = this.element.find("i.app-back");
            this._widgets.title = this.element.find("span.app-title");

            // When the user clicks the "back" icon, trigger the event to navigate back to the goal achievements.
            this._widgets.back.on("click", function () {
                that.trigger("back");
            });
        },

        load: function (data) {
            /// <summary>Load the data into the view.</summary>

            this.__data = data;

            this._widgets.title.text(serenity.format("Achievement - {0}", data.achievement.status));
        }
    });
}(window.Performance, window.jQuery, window.serenity));
