"use strict";

(function(Performance, $, serenity) {
    Performance.Views.Period.Edit = Performance.Views.Base.extend({
        /// <summary>The edit view displays period details for edit.</summary>

        __data: null,
        
        events: [
            /// <summary>Events that can be triggered in the edit view.</summary>

            // Save the period.
            "save"
        ],

        _onSaveClick: function () {
            /// <summary>Event handler that is triggered when the save image is clicked.</summary>
            
            this._save();
        },

        _save: function () {
            /// <summary>Save the values entered by the user to the model and validate.</summary>
            
            // Get the values entered by the user.
            this.__data.period.set("startDate", this._widgets.startDate.datepicker("getDate"));
            this.__data.period.set("endDate", this._widgets.endDate.datepicker("getDate"));
            this.__data.period.set("status", this._widgets.status.dataItem().title);
            
            // Validate the values entered.
            var errors = this.__data.period.validate();
            
            // If there are errors.
            if (errors.length > 0) {
                // Rollback the changes to the model.
                this.__data.period.rollback();
                var message = "";
                var that = this;
                // Concatenate the errors together.
                Enumerable.From(errors)
                    .ForEach(function (error) {
                        message += serenity.format("<div>{0}</div>", error)
                    });
                // Display the errors.
                this.showNotification({ message: message, cssClass: "ui-state-error", duration: 10000 });
            } else {
                // Data is valid, trigger the save event.
                this.trigger("save", { period: this.__data.period });
            }
        },

        render: function () {
            /// <summary>Render the view.</summary>

            // Get references to the input elements on the page.  Initialize Datepicker and Dropdownlist widgets.
            this._widgets.startDate = this.element.find("#startDate");
            this._widgets.startDate.datepicker();
            this._widgets.endDate = this.element.find("#endDate");
            this._widgets.endDate.datepicker();
            this._widgets.status = this.element.find("#status").serenityDropdownlist({
                valueField: "id",
                textField: "title"
            }).data("serenityDropdownlist");
            
            // Subscribe to the click event for the save image.
            this.element.find(".app-save").on("click", $.proxy(this._onSaveClick, this));
        },

        load: function (data) {
            /// <summary>Load the data into the view.</summary>

            this.__data = data;

            // Load the data into the input elements and widgets.
            this._widgets.startDate.datepicker("setDate", data.period.shortStartDate);
            this._widgets.endDate.datepicker("setDate", data.period.shortEndDate);
            this._widgets.status.dataSource().data(data.statusList);
            this._widgets.status.text(data.period.status);
        },
        
        saveComplete: function (response) {
            /// <summary>Display a notification to the user that the save is complete.</summary>
            
            if (response.result === "success") {
                this.showNotification({ message: "Period successfully saved" });
            }
        }
    });
}(window.Performance, window.jQuery, window.serenity));
