"use strict";

(function(Performance, $, serenity) {
    Performance.Models.Achievement = serenity.Model.extend({
        id: null,
        createdDate: null, 
        startDate: null, 
        endDate: null,
        description: null,
        goal: null,
        

        constructor: function (values, options) {

            serenity.Model.call(this, values, options);
            
            if (typeof this.createdDate === "string") {
                this.createdDate = new Date(this.createdDate);
            }
            
            if (typeof this.startDate === "string") {
                this.startDate = new Date(this.startDate);
            }
            
            if (typeof this.endDate === "string") {
                this.endDate = new Date(this.endDate);
            }
        },
        
        title: {
            get: function () {
                var title = "";
                
                if (typeof this.description === "string") {
                    var length = this.description.length;
                    if (length > 100) {
                        var idx = this.description.indexOf(' ', 100);
                        if (idx > -1) {
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
                return serenity.format("{0:MM/dd/yyyy}", this.startDate);
            }
        },
        
        shortEndDate: {
            get: function () {
                return serenity.format("{0:MM/dd/yyyy}", this.endDate);
            }
        },
        
        status: {
            get: function () {
                return this.id === "0"
                    ? "New"
                    : (this.endDate === null ? "In Progress" : "Complete");
            }
        },
        
        validate: function () {
            
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
