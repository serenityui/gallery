/// <reference path="../../../src/ts/serenityui.d.ts"/>

import {Component} from "./components/component";
import * as List from "./components/list/list.module";
import * as Entry from "./components/entry/entry.module";
import * as Edit from "./components/edit/edit.module";

export module App {

  let _router: serenity.Router = null;
  let _component: Component = null;

  function _addRoute(mod, item) {
      _router.add("/" + item.path, (params: any, route: any) => {
        // Show the overlay that the page is loading.
        serenity.overlay.show({ text: "Please wait a moment while the page loads..." });

        if (_component !== null) {
          _component.unload();
          _component = null;
        }
        
        // Create an instance of the component, render and load it.
        _component = new route.meta.module[route.meta.item.component]();
        _component.module = route.meta.item.path;
        _component.router = _router;
        _component.render().then(() => {
          params = params === null ? {} : params;
          let deferred = _component.load(params);

          if (typeof deferred !== "undefined") {
            deferred.then((): void => {
              // Hide the overlay.
              serenity.overlay.hide();
            });
          } else {
            // Hide the overlay.
            serenity.overlay.hide();
          }
        });
      }, {module: mod, item: item});
  }

  export function init(): void {
    /// <summary>Initialize the application.</summary>

    // Create an instance of a router.
    _router = new serenity.Router({ root: "/" });

    // Route for the home page.
    _router.add("/", () => {
      _router.navigate("/list");
    });

    // Get the routes for the List module and add each route to the router.
    List.Module.routes.forEach((item, index, routes) => {
      _addRoute(List, item);
    });

    // Get the routes for the Entry module and add each route to the router.
    Entry.Module.routes.forEach((item, index, routes) => {
      _addRoute(Entry, item);
    });

    // Get the routes for the Edit module and add each route to the router.
    Edit.Module.routes.forEach((item, index, routes) => {
      _addRoute(Edit, item);
    });

    _router.start();
    
    $(".app-show-sourcecode a").on("click", function () {
      var $li = $(this).parent();
      if ($li.hasClass("active")) {
        $li.removeClass("active");
        $(".app-split-screen").removeClass("app-split-screen");
      } else {
        $li.addClass("active");
        $("#view, #sourcecode").addClass("app-split-screen");
      }
    });
  }

  function routeHandler(params, route) {
    console.log(arguments);
  }

  export function navigate(path: string, reload?: boolean): void {
    _router.navigate(path, reload);
  }
}

$(function () {
  App.init();
});
