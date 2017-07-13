"use strict";

(function(Performance, $, serenity, Handlebars) {
    Performance.Views.Achievement.Edit = Performance.Views.Base.extend({
        /// <summary>The edit view displays achievement details for edit.</summary>

        __templates: {
            error: Handlebars.compile("<div>{{error}}</div>")
        },
        
        __data: null,
        
        events: [
            /// <summary>Events that can be triggered in the edit view.</summary>

            // Save the achievement.
            "save"
        ],
        
        _save: function () {
            /// <summary>Save the values entered by the user to the model and validate.</summary>
            
            // Get the values entered.
            this.__data.achievement.set("description", this._widgets.description.val());
            this.__data.achievement.startDate = this._widgets.startDate.datepicker("getDate");
            this.__data.achievement.endDate = this._widgets.endDate.datepicker("getDate");
            
            // Validate the values entered.
            var errors = this.__data.achievement.validate();
            
            // If there are errors.
            if (errors.length > 0) {
                // Rollback the changes to the model.
                this.__data.achievement.rollback();
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
                this.trigger("save", {achievement: this.__data.achievement });
            }
        },

        _onSaveClick: function () {
            /// <summary>Event handler that is triggered when the save image is clicked.</summary>
            
            this._save();
        },
        
        render: function () {
            /// <summary>Render the view.</summary>

            // Get references to the input elements on the page.  Initialize Datepicker widgets.
            this._widgets.description = this.element.find("#achievementDescription");
            this._widgets.startDate = this.element.find("#startDate");
            this._widgets.startDate.datepicker();
            this._widgets.endDate = this.element.find("#endDate");
            this._widgets.endDate.datepicker();
            
            this.element.find(".app-save").on("click", $.proxy(this._onSaveClick, this));
        },

        load: function (data) {
            /// <summary>Load the data into the view.</summary>

            this.__data = data;

            // Load the data into the input elements and widgets.
            this._widgets.description.val(data.achievement.description);
            this._widgets.startDate.datepicker("setDate", data.achievement.shortStartDate);
            this._widgets.endDate.datepicker("setDate", data.achievement.shortEndDate);
        },
        
        saveComplete: function (response) {
            /// <summary>Display a notification to the user that the save is complete.</summary>
            
            if (response.result === "success") {
                this.showNotification({ message: "Achievement successfully saved" });
            }
        }
    });
}(window.Performance, window.jQuery, window.serenity, window.Handlebars));
