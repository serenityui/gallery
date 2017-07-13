"use strict";

(function(Performance, $, serenity) {
    Performance.Models.Goal = serenity.Model.extend({
        /// <summary>Goal Model.</summary>

        id: null,
        title: null, 
        measurement: null, 
        startDate: null,
        completionDate: null,
        dueDate: null, 
        status: null, 
        employeeComments: null, 
        supervisorComments: null,
        rating: null,
        period: null,
        achievements: null,

        constructor: function (values, options) {
            /// <summary>Constructor for the Goal Model.</summary>
            
            // If the date values are a string, then initialize as a Date object.
            if (typeof values.completionDate === "string") {
                values.completionDate = new Date(values.completionDate);
            }
            if (typeof values.dueDate === "string") {
                values.dueDate = new Date(values.dueDate);
            }
            
            values.rating = values.rating || "";

            // If the achievements value was not passed in, then initialize the achievements value as an empty array.
            values.achievements = values.achievements || [];

            // Call the base class constructor.
            serenity.Model.call(this, values, options);

            // If there were achievements for the goal, initialize each achievement JSON object as
            // an instance of the Performance.Models.Achievement model.
            if ($.isArray(this.achievements)) {
                for (var idx = 0; idx < this.achievements.length; idx++) {
                    var achievement = this.achievements[idx];
                    if (achievement instanceof Performance.Models.Achievement === false) {
                        this.achievements[idx] = new Performance.Models.Achievement(achievement);
                        this.achievements[idx].goal = this;
                    }
                }
            }
        },
        
        shortDueDate: {
            get: function () {
                /// <summary>Get the date as a string formated as MM/dd/yyyy.</summary>

                return serenity.format("{0:MM/dd/yyyy}", this.dueDate);
            }
        },
        
        validate: function () {
            /// <summary>Validate the Goal data.</summary>
            /// <return type="Array[string]">Array of errors.  Empty array if no errors.</return>
            
            var errors = [];
            
            if (this.title.length === 0) {
                errors.push("Title is required.");
            }
            
            return errors;
        },
        
        addAchievement: function () {
            /// <summary>Add a new achievement to the goal.</summary>
            
            // If an achievement has already been added (id === '0'), then don't add
            // a new achievement to the goal.  This happens when a new achievement was
            // added, but never saved.
            var achievement = Enumerable.From(this.achievements)
                .Where("achievement => achievement.id === '0'")
                .FirstOrDefault();
            
            // A new achievement has not been added yet, so add one.
            if (typeof achievement === "undefined") {
                var currentDate = new Date();
                achievement = new Performance.Models.Achievement({
                    id: "0",
                    description: "New Achievement",
                    createdDate: currentDate,
                    startDate: currentDate,
                    endDate: currentDate
                });
                achievement.goal = this;
                this.achievements.push(achievement);
            }
        }
    });
}(window.Performance, window.jQuery, window.serenity));
