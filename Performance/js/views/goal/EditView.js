"use strict";

(function(Performance, $, serenity, Handlebars) {
    Performance.Views.Goal.Edit = Performance.Views.Base.extend({
        /// <summary>The edit view displays goal details for edit.</summary>

        __templates: {
            tile: Handlebars.compile("<div data-id='{{id}}' class='ui-widget-content app-achievement'><p class='app-achievement-description'>{{description}}</p><span>Status: {{status}}</span></div>"),
            error: Handlebars.compile("<div>{{error}}</div>")
        },
        
        __data: null,

        events: [
            /// <summary>Events that can be triggered in the edit view.</summary>

            // Save the goal.
            "save"
        ],
        
        _onAchievementClick: function (event) {
            /// <summary>
            
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

        _onSaveClick: function () {
            
            this._save();
        },
        
        _save: function () {
            
            this.__data.goal.set("title", this._widgets.title.val());
            this.__data.goal.set("measurement", this._widgets.measurement.val());
            this.__data.goal.set("dueDate", this._widgets.dueDate.datepicker("getDate"));
            this.__data.goal.set("employeeComments", this._widgets.selfEvaluation.val());
            this.__data.goal.set("rating", this._widgets.rating.dataItem().title);
            this.__data.goal.set("supervisorComments", this._widgets.assessment.val());
            
            // Validate the values entered.
            var errors = this.__data.goal.validate();
            
            if (errors.length > 0) {
                this.__data.goal.rollback();
                var message = "";
                var that = this;
                Enumerable.From(errors)
                    .ForEach(function (error) {
                        message += that.__templates.error({ error: error })
                    });
                this.showNotification({ message: message, cssClass: "ui-state-error", duration: 10000 });
            } else {
                this.trigger("save", {goal: this.__data.goal });
            }
        },
        
        render: function () {
            /// <summary>Render the view.</summary>

            this._widgets.title = this.element.find("#goalTitle");
            this._widgets.measurement = this.element.find("#measurement");
            this._widgets.dueDate = this.element.find("#dueDate");
            this._widgets.dueDate.datepicker();
            this._widgets.selfEvaluation = this.element.find("#selfEvaluation");
            this._widgets.rating = this.element.find("#rating").serenityDropdownlist({
                valueField: "title",
                textField: "title",
                width: 250
            }).data("serenityDropdownlist");
            this._widgets.assessment = this.element.find("#assessment");
            this._widgets.achievementsList = this.element.find("#achievementsList");
            this._widgets.achievementsFooter = this.element.find("#achievementsFooter");
            
            this.element.find(".app-save").on("click", $.proxy(this._onSaveClick, this));
        },

        load: function (data) {
            /// <summary>Load the data into the view.</summary>

            this.__data = data;

            this._widgets.title.val(data.goal.title);
            this._widgets.measurement.val(data.goal.measurement);
            this._widgets.dueDate.datepicker("setDate", data.goal.shortDueDate);
            this._widgets.selfEvaluation.val(data.goal.employeeComments);
            this._widgets.rating.dataSource().data(data.ratings);
            this._widgets.rating.text(data.goal.rating);
            this._widgets.assessment.val(data.goal.supervisorComments);
        },
        
        toggleAchievements: function () {
            /// <summary>Show or hide the achievements panel.</summary>

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
        },
        
        saveComplete: function (response) {
            
            if (response.result === "success") {
                this.showNotification({ message: "Goal successfully saved" });
            }
        }
    });
}(window.Performance, window.jQuery, window.serenity, window.Handlebars));
