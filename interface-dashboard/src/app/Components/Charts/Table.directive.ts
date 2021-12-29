import template from "./Table.template.html?raw";

module edvl.TableDirective {
  export interface IScope extends ng.IScope {}
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
    restrict = "E";
    public static slug = "table";
    public static instance(): ng.IDirectiveFactory {
      return () => new Directive();
    }
    scope = {
      focas: "=",
    };
  }
}

export default {
  slug: edvl.TableDirective.Directive.slug,
  instance: edvl.TableDirective.Directive.instance,
};
