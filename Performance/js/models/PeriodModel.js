"use strict";

(function(Performance, $, serenity) {
    Performance.Models.Period = Performance.Models.Document.extend({
        /// <summary>Period Model.</summary>

        type: null, 
        employee_id: null, 
        startDate: null, 
        endDate: null, 
        status: null,
        goals: null,

        constructor: function (values, options) {
            /// <summary>Constructor for the Period Model.</summary>
            
            values.type = "Period";
            
            // If the date values are a string, then initialize as a Date object.
            values.startDate = typeof values.startDate === "string"
                ? new Date(values.startDate)
                : values.startDate;
            values.endDate = typeof values.endDate === "string"
                ? new Date(values.endDate)
                : values.endDate;
            
            // If the goals value was not passed in, then initialize the goals value as an empty array.
            values.goals = values.goals || [];
            
            // Call the base class constructor.
            Performance.Models.Document.call(this, values, options);

            // If there were goals for the period, initialize each goal JSON object as
            // an instance of the Performance.Models.Goal model.
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
                /// <summary>Get the date as a string formated as MM/dd/yyyy.</summary>

                return serenity.format("{0:MM/dd/yyyy}", this.startDate);
            }
        },

        shortEndDate: {
            get: function () {
                /// <summary>Get the date as a string formated as MM/dd/yyyy.</summary>

                return serenity.format("{0:MM/dd/yyyy}", this.endDate);
            }
        },

        year: {
            get: function () {
                /// <summary>Get the year of the start date.</summary>

                return serenity.format("{0:yyyy}", this.startDate);
            }
        },

        isCurrent: function (currentDate) {
            /// <summary>Is the current date between the start and end dates of this period.</summary>

            return currentDate > this.startDate && currentDate < this.endDate;
        },
        
        validate: function () {
            /// <summary>Validate the information for the period.</summary>
            /// <return type="Array[string]">Array of errors.  Empty array if no errors.</return>
            
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
        },
        
        addGoal: function () {
            /// <summary>Add a new goal to the period.</summary>
            
            // If a goal has already been added (id === '0'), then don't add
            // a new goal to the period.  This happens when a new goal was
            // added, but never saved.
            var goal = Enumerable.From(this.goals)
                .Where("goal => goal.id === '0'")
                .FirstOrDefault();
            
            // A new goal has not been added yet, so add one.
            if (typeof goal === "undefined") {
                goal = new Performance.Models.Goal({
                    id: "0",
                    title: "New Goal",
                    status: "Not Started",
                    startDate: new Date()
                });
                goal.period = this;
                this.goals.push(goal);
            }
        }
    });
}(window.Performance, window.jQuery, window.serenity));
