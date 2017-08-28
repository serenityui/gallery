"use strict";

(function(Northwind, $, serenity) {
  Northwind.Views.Base = serenity.Observable.extend({
    /// <summary>Base class for all views.</summary>

    // Variable to hold references to widgets in the view.
    _widgets: null,

    constructor: function(options, element) {
      /// <summary>Constructor for the base view.</summary>

      // Call the base class constructor.
      serenity.Observable.call(this, options);

      // Set the element that is the container for the view.
      this.element = typeof element instanceof jQuery ? element : $("#view");

      this._widgets = {};
    },

    render: function() {

    },

    load: function() {

    },

    destroy: function() {

    }
  });
}(window.Northwind, window.jQuery, window.serenity));