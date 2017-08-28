"use strict";

var Northwind = {
  Models: {},
  Controllers: {},
  Views: {
    Catalog: {},
    Sales: {}
  },
  Stores: {}
};

Northwind.App = function($, serenity) {
  /// <summary>The main module for the application.</summary>

  var __controllers = {};
  var __router = null;
  var __notification = null;

  function init() {
    /// <summary>Initialize the application.</summary>

    // Start up the router.
    __router = new Northwind.Router({
      change: function () {
        notification.remove();
      }
    });
    __router.start();
  }

  function controller(name) {
    /// <summary>Get a controller.</summary>
    /// <param name="name" type="String">Name of the controller.</param>

    // Create an instance of the controller if it hasn't been created yet.
    if (typeof __controllers[name] === "undefined") {
      __controllers[name] = new Northwind.Controllers[name]({
        name: name
      });
    }
    return __controllers[name];
  }

  function navigate(path) {
    /// <summary>Navigate to a path.</summary>

    return __router.navigate(path);
  }

  var notification = {
    show: function() {
      if (__notification === null) {
        __notification = $("#notification").serenityNotification({
          cssClass: "ui-state-highlight",
          duration: 0
        }).data("serenityNotification");
      }
      __notification.show();
    },
    hide: function() {
      if (__notification !== null) {
        __notification.hide();
      }
    },
    remove: function() {
      if (__notification !== null) {
        __notification.remove();
      }
    }
  };

  return {
    init: init,
    controller: controller,
    navigate: navigate,
    notification: notification
  }
}(jQuery, window.serenity);

$(function() {
  Northwind.App.init();
});