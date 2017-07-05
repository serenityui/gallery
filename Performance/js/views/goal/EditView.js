"use strict";

(function(Performance, $, serenity, Handlebars) {
    Performance.Views.Goal.Edit = Performance.Views.Base.extend({

        __data: null,

        __templates: {
            tile: Handlebars.compile("<div data-id='{{id}}' class='ui-widget-content app-achievement'><p class='app-achievement-description'>{{description}}</p><span>Status: {{status}}</span></div>")
        },
        
        _onAchievementClick: function (event) {
            
            this._widgets.achievementsList.find(".app-achievement").removeClass("app-selected");
            $(event.currentTarget).addClass("app-selected");
        },
        
        _onCopyToClipboard: function (event) {
            
            var $el = this._widgets.achievementsList.find(".app-achievement.app-selected .app-achievement-description");
            
            var $temp = $("<input style='position:absolute;left:-100px;'>");
            $("body").append($temp);
            $temp.val($el.text()).select();
            document.execCommand("copy");
            $temp.remove();
        },
        
        render: function () {

            this._widgets.title = this.element.find("#goalTitle");
            this._widgets.measurement = this.element.find("#measurement");
            this._widgets.dueDate = this.element.find("#dueDate");
            this._widgets.dueDate.datepicker();
            this._widgets.selfEvaluation = this.element.find("#selfEvaluation");
            this._widgets.completionDate = this.element.find("#completionDate");
            this._widgets.completionDate.datepicker();
            this._widgets.rating = this.element.find("#rating").serenityDropdownlist().data("serenityDropdownlist");
            this._widgets.assessment = this.element.find("#assessment");
            this._widgets.achievementsList = this.element.find("#achievementsList");
            this._widgets.achievementsFooter = this.element.find("#achievementsFooter");
        },

        load: function (data) {

            this.__data = data;

            this._widgets.title.val(data.goal.title);
            this._widgets.measurement.val(data.goal.measurement);
            this._widgets.dueDate.datepicker("setDate", data.goal.shortDueDate);
            this._widgets.selfEvaluation.val(data.goal.employeeComments);
            
            // Rating
            
            this._widgets.assessment.val(data.goal.supervisorComments);
        },
        
        toggleAchievements: function () {

            if (this.element.hasClass("app-show-achievements")) {
                this.element.removeClass("app-show-achievements");
            } else {
                // If the achievements haven't been loaded yet...
                if (this._widgets.achievementsList.is(":empty")) {
                    var that = this;
                    // If there are achievements to display...
                    if (this.__data.goal.achievements.length > 0) {
                        // Display the achievements
                        Enumerable.From(this.__data.goal.achievements)
                            .ForEach(function (achievement) {
                                that._widgets.achievementsList.append(that.__templates.tile(achievement));
                            });
                        
                        this._widgets.achievementsList.find(".app-achievement").on("click", $.proxy(this._onAchievementClick, this));
                        this._widgets.achievementsFooter.find(".app-copy").on("click", $.proxy(this._onCopyToClipboard, this));
                    } else {
                        // Display message that there are no achievements.
                        this._widgets.achievementsList.append("<h3>No Achievements</h3>");
                    }
                }

                this.element.addClass("app-show-achievements");
            }
        }
    });
}(window.Performance, window.jQuery, window.serenity, window.Handlebars));
