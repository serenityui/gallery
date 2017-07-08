"use strict";

(function(Performance, $, serenity, Handlebars) {
    Performance.Views.Base = serenity.Observable.extend({

        _widgets: null,

        constructor: function (options, element) {

            serenity.Observable.call(this, options);

            this.element = typeof element === "undefined" ? $("#view") : element;

            this._widgets = {};
        },

        render: function () {

        },

        load: function () {

            return $.Deferred(function(deferred) {
                deferred.resolve();
            });
        },
        
        showNotification: function (options) {
            
            var $notification = $("#notification");
            var notification = $notification.data("serenityNotification");
            
            if (typeof notification === "undefined") {
                notification = $notification.serenityNotification({
                    width: 250,
                    duration: 5000,
                    bottom: 20,
                    right: 20
                }).data("serenityNotification");
            }
            
            options.cssClass = options.cssClass || "ui-state-active";
            options.duration = options.duration || 5000;
            
            notification._setOptions({ cssClass: options.cssClass, duration: options.duration });

            $notification.find(".app-notification-content").html(serenity.format("<div style='min-height:50px;padding:10px;'>{0}</div>", options.message));
            
            notification.show();
        }
    });
}(window.Performance, window.jQuery, window.serenity, window.Handlebars));
