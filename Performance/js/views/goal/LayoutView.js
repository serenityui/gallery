"use strict";

(function(Performance, $, serenity) {
    
    Performance.GoalDetail = {
        /// <summary>Enumeration for the type of detail to view for the selected Goal.</summary>

        // View the goal edit page.
        EDIT: 0,
        // View the goal achievements page.
        ACHIEVEMENTS: 1,
        // View the goal chart page.
        CHART: 2
    };

    Performance.Views.Goal.Layout = Performance.Views.Base.extend({
        /// <summary>The layout view displays navigation for the goal details.</summary>

        __data: null,
        
        __templates: {
            showAchievements: "<i class='fa fa-bars fa-2x app-show-achievements' aria-hidden='true'></i>"
        },

        events: [
            /// <summary>Events that can be triggered in the layout view.</summary>

            // Navigate back to the list of goals.
            "back",
            // View the goal edit page.
            "edit",
            // View the achievements page.
            "achievements",
            // View the achievements panel on the edit page.
            "editAchievements"
        ],

        _addShowAchievementsLink: function () {
            /// <summary>Add the show/hide achievements link.</summary>

            this.element.find("#pageHeader").append(this.__templates.showAchievements);
            
            this.element.find("i.app-show-achievements").on("click", $.proxy(this._onShowHideAchievementsClick, this));
        },
        
        _onShowHideAchievementsClick: function () {
          
            this.trigger("editAchievements");
        },

        render: function () {
            /// <summary>Render the view.</summary>

            var that = this;
            
            // Get references to elements in the view.
            this._widgets.back = this.element.find("i.app-back");
            this._widgets.edit = this.element.find("i.app-edit");
            this._widgets.achievements = this.element.find("i.app-achievements");
            this._widgets.title = this.element.find("span.app-title");

            // When the user clicks the "back" icon, trigger the event to navigate back to the period goals.
            this._widgets.back.on("click", function () {
                that.trigger("back");
            });
            // When the user clicks the "edit" icon, trigger the event to navigate to the goal edit page.
            this._widgets.edit.on("click", function () {
                that.trigger("edit");
            });
            // When the user clicks the "goals" icon, trigger the event to navigate to the goal achievements page.
            this._widgets.achievements.on("click", function () {
                that.trigger("achievements");
            });
        },

        load: function (data) {
            /// <summary>Load the data into the view.</summary>

            this.__data = data;

            this._widgets.title.text(serenity.format("{0} - {1}", data.goal.title, data.goal.status));
        },

        select: function (page) {
            /// <summary>Show a "navigation" icon as selected for the current page.</summary>

            var $link = null;

            switch (page) {
                // The current page is the edit page.
                case Performance.GoalDetail.EDIT:
                    $link = this._widgets.edit;
                    this._addShowAchievementsLink();
                    break;

                // The current page is the goals page.
                case Performance.GoalDetail.ACHIEVEMENTS:
                    $link = this._widgets.achievements;
                    break;
            }

            $link.addClass("app-selected");
        }
    });
}(window.Performance, window.jQuery, window.serenity));
