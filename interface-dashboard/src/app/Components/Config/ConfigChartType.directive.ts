import template from "./ConfigChartType.template.html?raw";
import ConfigServiceService from "../../Services/ConfigService/ConfigService.service";

module edvl.ConfigChartTypeDirective {
  export interface IScope extends ng.IScope {
    configService: ConfigServiceService;
  }
  export interface IDirectiveController extends ng.IController {}
  export class Controller implements IDirectiveController {
    public static $inject = ["$scope", "ConfigService"];
    constructor(
      private $scope: IScope,
      private ConfigService: ConfigServiceService
    ) {
      this.$scope.configService = ConfigService;
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
    public static slug = "configChartType";
    public static instance(): ng.IDirectiveFactory {
      return () => new Directive();
    }
    scope = {};
  }
}

export default {
  slug: edvl.ConfigChartTypeDirective.Directive.slug,
  instance: edvl.ConfigChartTypeDirective.Directive.instance,
};
