"use strict";

(function(Performance, $, serenity) {
    Performance.Models.Period = Performance.Models.Document.extend({
        type: null, 
        employee_id: null, 
        startDate: null, 
        endDate: null, 
        status: null,
        goals: null,

        constructor: function (values, options) {

            values.startDate = typeof values.startDate === "string"
                ? new Date(values.startDate)
                : values.startDate;

            values.endDate = typeof values.endDate === "string"
                ? new Date(values.endDate)
                : values.endDate;
            
            Performance.Models.Document.call(this, values, options);

            if ($.isArray(this.goals)) {
                for (var idx = 0; idx < this.goals.length; idx++) {
                    var goal = this.goals[idx];
                    if (goal instanceof Performance.Models.Goal === false) {
                        this.goals[idx] = new Performance.Models.Goal(goal);
                        this.goals[idx].period = this;
                    }
                }
            }
        },

        shortStartDate: {
            get: function () {
                return serenity.format("{0:MM/dd/yyyy}", this.startDate);
            }
        },

        shortEndDate: {
            get: function () {
                return serenity.format("{0:MM/dd/yyyy}", this.endDate);
            }
        },

        year: {
            get: function () {
                return serenity.format("{0:yyyy}", this.startDate);
            }
        },

        isCurrent: function (currentDate) {

            return currentDate > this.startDate && currentDate < this.endDate;
        },
        
        validate: function () {
            /// <summary>Validate the information for the period.</summary>
            
            var errors = [];
            
            if (this.startDate === null) {
                errors.push("Start Date is required.");
            }

            if (this.endDate === null) {
                errors.push("End Date is required.");
            }

            if (this.status.length === 0) {
                errors.push("Status is required.");
            }
            
            return errors;
        }
    });
}(window.Performance, window.jQuery, window.serenity));
