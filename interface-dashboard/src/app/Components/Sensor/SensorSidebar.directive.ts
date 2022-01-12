import template from "./SensorSidebar.template.html?raw";

module edvl.SensorSidebarDirective {
  export interface IScope extends ng.IScope {
    devices: any;
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
    restrict = "E";
    // bindToController = true;
    public static slug = "sensorSidebar";
    public static instance(): ng.IDirectiveFactory {
      return () => new Directive();
    }
    scope = {
      devices: "=",
    };
  }
}

export default {
  slug: edvl.SensorSidebarDirective.Directive.slug,
  instance: edvl.SensorSidebarDirective.Directive.instance,
};
