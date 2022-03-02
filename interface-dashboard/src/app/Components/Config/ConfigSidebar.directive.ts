import ConfigServiceService from "../../Services/ConfigService/ConfigService.service";
import template from "./ConfigSidebar.template.html?raw";

module edvl.ConfigSidebarDirective {
  export interface IScope extends ng.IScope {}
  export interface IDirectiveController extends ng.IController {}
  export class Controller implements IDirectiveController {
    public static $inject = ["$scope", "ConfigService"];
    constructor(private $scope: IScope) {}
  }

  export class Directive implements ng.IDirective {
    controller: ng.Injectable<ng.IControllerConstructor> = Controller;
    controllerAs = "vm";
    template = template;
    replace = true;
    transclude = true;
    restrict = "E";
    public static slug = "configSidebar";
    public static instance(): ng.IDirectiveFactory {
      return () => new Directive();
    }
    scope = {};
  }
}

export default {
  slug: edvl.ConfigSidebarDirective.Directive.slug,
  instance: edvl.ConfigSidebarDirective.Directive.instance,
};
