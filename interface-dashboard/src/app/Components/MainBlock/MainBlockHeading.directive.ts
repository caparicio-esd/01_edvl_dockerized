import template from "./MainBlockHeading.template.html?raw";

module edvl.MainBlockHeadingDirective {
  export interface IScope extends ng.IScope {
    readonly: boolean;
    title: string;
}
  export interface IDirectiveController extends ng.IController {}
  export class Controller implements IDirectiveController {
    public static $inject = ["$scope"];
    constructor(
      private $scope: IScope,
    ) {
      this.$scope.title = "Chart 01"
      this.$scope.readonly = true
    }
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
    public static slug = "mainBlockHeading";
    public static instance(): ng.IDirectiveFactory {
      return () => new Directive();
    }
    scope = {};
  }
}

export default {
  slug: edvl.MainBlockHeadingDirective.Directive.slug,
  instance: edvl.MainBlockHeadingDirective.Directive.instance,
};
