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
            /// <summary>Copy the selected achievement to the clipboard.</summary>
            
            var $el = this._widgets.achievementsList.find(".app-achievement.app-selected .app-achievement-description");
            
            var $temp = $("<input style='position:absolute;left:-100px;'>");
            $("body").append($temp);
            $temp.val($el.text()).select();
            document.execCommand("copy");
            $temp.remove();
        },

        _onSaveClick: function () {
            /// <summary>Event handler that is triggered when the save image is clicked.</summary>
            
            this._save();
        },
        
        _save: function () {
            /// <summary>Save the values entered by the user to the model and validate.</summary>
            
            // Get the values entered by the user.
            this.__data.goal.set("title", this._widgets.title.val());
            this.__data.goal.set("measurement", this._widgets.measurement.val());
            this.__data.goal.set("dueDate", this._widgets.dueDate.datepicker("getDate"));
            this.__data.goal.set("employeeComments", this._widgets.selfEvaluation.val());
            this.__data.goal.set("rating", this._widgets.rating.dataItem().title);
            this.__data.goal.set("supervisorComments", this._widgets.assessment.val());
            
            // Validate the values entered.
            var errors = this.__data.goal.validate();
            
            // If there are errors.
            if (errors.length > 0) {
                // Rollback the changes to the model.
                this.__data.goal.rollback();
                var message = "";
                var that = this;
                // Concatenate the errors together.
                Enumerable.From(errors)
                    .ForEach(function (error) {
                        message += that.__templates.error({ error: error })
                    });
                // Display the errors.
                this.showNotification({ message: message, cssClass: "ui-state-error", duration: 10000 });
            } else {
                // Data is valid, trigger the save event.
                this.trigger("save", {goal: this.__data.goal });
            }
        },
        
        render: function () {
            /// <summary>Render the view.</summary>

            // Get references to the input elements on the page.  Initialize Datepicker and Dropdownlist widgets.
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
            
            // Subscribe to the click event for the save image.
            this.element.find(".app-save").on("click", $.proxy(this._onSaveClick, this));
        },

        load: function (data) {
            /// <summary>Load the data into the view.</summary>

            this.__data = data;

            // Load the data into the input elements and widgets.
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
                // Remove the css class that shows the list of achievements.
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
                        // Subscribe to the click event for the copy image.
                        this._widgets.achievementsFooter.find(".app-copy").on("click", $.proxy(this._onCopyToClipboard, this));
                    } else {
                        // Display message that there are no achievements.
                        this._widgets.achievementsList.append("<h3>No Achievements</h3>");
                    }
                }
                // Add the css class that shows the list of achievements.
                this.element.addClass("app-show-achievements");
            }
        },
        
        saveComplete: function (response) {
            /// <summary>Display a notification to the user that the save is complete.</summary>
            
            if (response.result === "success") {
                this.showNotification({ message: "Goal successfully saved" });
            }
        }
    });
}(window.Performance, window.jQuery, window.serenity, window.Handlebars));
