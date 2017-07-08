"use strict";

(function(Performance, $, serenity, Handlebars) {
    Performance.Views.Achievement.Edit = Performance.Views.Base.extend({

        __templates: {
            error: Handlebars.compile("<div>{{error}}</div>")
        },
        
        __data: null,
        
        events: [
            "save"
        ],
        
        _save: function () {
            
            // Get the values entered.
            this.__data.achievement.set("description", this._widgets.description.val());
            this.__data.achievement.startDate = this._widgets.startDate.datepicker("getDate");
            this.__data.achievement.endDate = this._widgets.endDate.datepicker("getDate");
            
            // Validate the values entered.
            var errors = this.__data.achievement.validate();
            
            if (errors.length > 0) {
                this.__data.achievement.rollback();
                var message = "";
                var that = this;
                Enumerable.From(errors)
                    .ForEach(function (error) {
                        message += that.__templates.error({ error: error })
                    });
                this.showNotification({ message: message, cssClass: "ui-state-error", duration: 10000 });
            } else {
                this.trigger("save", {achievement: this.__data.achievement });
            }
        },

        _onSaveClick: function () {
            
            this._save();
        },
        
        render: function () {

            this._widgets.description = this.element.find("#achievementDescription");
            this._widgets.startDate = this.element.find("#startDate");
            this._widgets.startDate.datepicker();
            this._widgets.endDate = this.element.find("#endDate");
            this._widgets.endDate.datepicker();
            
            this.element.find(".app-save").on("click", $.proxy(this._onSaveClick, this));
        },

        load: function (data) {

            this.__data = data;

            this._widgets.description.val(data.achievement.description);
            this._widgets.startDate.datepicker("setDate", data.achievement.shortStartDate);
            this._widgets.endDate.datepicker("setDate", data.achievement.shortEndDate);
        },
        
        saveComplete: function (response) {
            
            if (response.result === "success") {
                this.showNotification({ message: "Achievement successfully saved" });
            }
        }
    });
}(window.Performance, window.jQuery, window.serenity, window.Handlebars));
