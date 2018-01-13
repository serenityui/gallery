/// <reference path="../../../../src/ts/serenityui.d.ts"/>

interface ViewParams {
  componentPath: string;
  template: string;
  target?: string;
  styles?: Array<string>;
  scripts?: Array<string>;
  sourcecode?: string;
}

let _viewSettings: Array<any> = new Array<any>();

function View(params: ViewParams) {
  return function (target: Function): void {

    _viewSettings.push({
      componentPrototype: target.prototype,
      params: params
    });
  }
}

abstract class Component extends serenity.ViewModel {

  private static __views: any = {};

  protected widgets: any = {};
  protected element: JQuery = null;

  // viewParams: Array<ViewParams>;

  module: string;
  router: serenity.Router;
  
  private __downloadHtml(index: number, done: (() => void)) {
    // if (index < this.viewParams.length) {
      // let params = this.viewParams[index];
    
    if (index < _viewSettings.length) {
      let settings = _viewSettings[index];
      
      if (this instanceof settings.componentPrototype.constructor) {
        let params = settings.params;
        
        let url: string = serenity.format("app/components/{0}/{1}?_={2}", params.componentPath, params.template, (new Date()).getTime());

        // Get the HTML and CSS for this view.
        $.get(url, (html) => {
          var $html = $(html);
          if (typeof params.styles !== "undefined") {
            params.styles.forEach((styleUrl, index, array) => {
              this.element.append($(serenity.format("<link rel='stylesheet' href='app/components/{0}/{1}?_={2}'>", params.componentPath, styleUrl, new Date().getTime())));
            });
          }
          if (typeof params.scripts !== "undefined") {
            params.scripts.forEach((scriptUrl, index, array) => {
              this.element.append($(serenity.format("<script type='text/javascript' src='app/components/{0}/{1}?_={2}'></script>", params.componentPath, scriptUrl, new Date().getTime())));
            });
          }
          // Display the html.
          if (typeof params.target !== "undefined") {
            $(params.target).append($html);
          } else {
            this.element.append($html);
          }
          // Display the sourcecode description.
          if (typeof params.sourcecode !== "undefined") {
            url = serenity.format("app/components/{0}/{1}?_={2}", params.componentPath, params.sourcecode, (new Date()).getTime());
            $.get(url, (html) => {
              $("#sourcecode").html(html);
              this.__downloadHtml(++index, done);
            });
          } else {
            this.__downloadHtml(++index, done);
          }
          
          this.element.show();
        });
      } else {
        this.__downloadHtml(++index, done);
      }
    } else {
      done();
    }
  }
  
  protected _renderHtml(element?: JQuery): JQueryDeferred<void> {
    /// <summary>Render HTML.</summary>
    /// <param name="element" type="jQuery Object" optional="true">
    /// The jQuery element that will contain the html to be rendered.
    /// If undefined, then default is #view.
    /// </param>

    let that = this;

    return $.Deferred((deferred: JQueryDeferred<void>): void => {
      let viewName = (this.constructor as any).name;

      this.element = typeof element === "undefined" ? $("#view") : element;
      this.element.empty().hide();
    
      $("#sourcecode").html("");
    
      // Determine whether the HTML has been retrieved for this view yet.
      if (typeof Component.__views[viewName] === "undefined") {
        this.__downloadHtml(0, () => {
          this.element.show();
          deferred.resolve();
        });
      } else {
        // Display the html.
        this.element.html(Component.__views[viewName]);
        this.element.show();
        deferred.resolve();
      }
    });
  }
  
  render(element?: JQuery): JQueryDeferred<void> {
    
    return this._renderHtml(element);
  }

  abstract load(params?: any): any;

  unload(): void {
    /// <summary>Override as needed to unload the component.</summary>
  }

  attach(): void {
    /// <summary>Override as needed to unload the component.</summary>
    
    super.attach(null, this);
  }
}

export {View, Component}