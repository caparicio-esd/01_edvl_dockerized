import template from "./Map.template.html?raw";

module edvl.MapDirective {
  export interface IScope extends ng.IScope {}
  export interface IDirectiveController extends ng.IController {}
  export class Controller implements IDirectiveController {
    public static $inject = ["$scope"];
    constructor(private $scope: IScope) {}
  }

  export class Directive implements ng.IDirective {
    controller: ng.Injectable<ng.IControllerConstructor> = Controller;
    controllerAs = "vm";
    template = template;
    replace = true;
    transclude = true;
    restrict = "E";
    public static slug = "map";
    public static instance(): ng.IDirectiveFactory {
      return () => new Directive();
    }
    scope = {
      focas: "=",
    };
  }
}

export default {
  slug: edvl.MapDirective.Directive.slug,
  instance: edvl.MapDirective.Directive.instance,
};
