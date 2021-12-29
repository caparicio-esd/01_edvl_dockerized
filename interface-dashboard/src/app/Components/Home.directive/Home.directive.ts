//HomeDirective
import template from "./Home.template.html?raw";

module edvl.HomeDirective {
  export interface IScope extends ng.IScope {
    focas: string[];
  }
  export interface IDirectiveController extends ng.IController {}
  export class Controller implements IDirectiveController {
    public static $inject = ["$scope"];
    constructor(private $scope: IScope) {}
    public $onInit() {}
    public $postLink() {}
    public $doCheck() {}
    public $onChanges(_: ng.IOnChangesObject) {}
    public $onDestroy() {}
  }

  export class Directive implements ng.IDirective {
    controller: ng.Injectable<ng.IControllerConstructor> = Controller;
    controllerAs = "vm";
    template = template;
    replace = true;
    transclude = true;
    public static slug = "home";
    public static instance(): ng.IDirectiveFactory {
      return () => new Directive();
    }
    restrict = "E";
  }
}

export default {
  slug: edvl.HomeDirective.Directive.slug,
  instance: edvl.HomeDirective.Directive.instance,
};
