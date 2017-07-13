"use strict";

(function(Performance, $, serenity) {
    Performance.Models.Achievement = serenity.Model.extend({
        /// <summary>Achievement Model.</summary>

        id: null,
        createdDate: null, 
        startDate: null, 
        endDate: null,
        description: null,
        goal: null,
        

        constructor: function (values, options) {
            /// <summary>Constructor for the Achievement Model.</summary>
            
            // If the date values are a string, then initialize as a Date object.
            if (typeof values.createdDate === "string") {
                values.createdDate = new Date(values.createdDate);
            }
            if (typeof values.startDate === "string") {
                values.startDate = new Date(values.startDate);
            }
            if (typeof values.endDate === "string") {
                values.endDate = new Date(values.endDate);
            }
            
            // Call the base class constructor.
            serenity.Model.call(this, values, options);
        },
        
        title: {
            get: function () {
                /// <summary>Get the title of the Achievement.</summary>
                
                var title = "";
                
                // The achievement has a description.
                if (typeof this.description === "string") {
                    // Limit the length of the title to around 100 characters.
                    var length = this.description.length;
                    if (length > 100) {
                        // Adjust the title so that it does not cut off in the middle of a word. 
                        var idx = this.description.indexOf(' ', 100);
                        if (idx > -1) {
                            // Add "..." to the end of the title.
                            title = serenity.format("{0}...", this.description.substring(0, idx));
                        } else {
                            title = this.description;
                        }
                    } else {
                        title = this.description;
                    }
                }
                
                return title;
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
        
        status: {
            get: function () {
                /// <summary>Get the status of the Achievement.</summary>

                // If the id is 0, then it is New.
                // If the endDate is null, then it is In Progress.
                // If it has an endDate, then it is Complete.
                return this.id === "0"
                    ? "New"
                    : (this.endDate === null ? "In Progress" : "Complete");
            }
        },
        
        validate: function () {
            /// <summary>Validate the Achievement data.</summary>
            /// <return type="Array[string]">Array of errors.  Empty array if no errors.</return>
            
            var errors = [];
            
            if (this.description.length === 0) {
                errors.push("Description is required.");
            }
            
            if (this.startDate === null && this.endDate !== null) {
                errors.push("A Start Date is needed if there is an End Date.");
            }
            
            if (this.startDate !== null && this.endDate !== null && this.startDate > this.endDate) {
                errors.push("Start Date must be the same or before the End Date.");
            }
            
            return errors;
        }
    });
}(window.Performance, window.jQuery, window.serenity));
