import ConfigService from "../../Services/ConfigService/ConfigService.service";
import template from "./ChartType.template.html?raw";

export module edvl.ChartTypeDirective {
  export interface IScope extends ng.IScope {
    configService: ConfigService;
  }
  export interface IDirectiveController extends ng.IController {}
  export class Controller implements IDirectiveController {
    public static $inject = ["$scope", "ConfigService"];
    constructor(private $scope: IScope, ConfigService: ConfigService) {
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
    public static slug = "chartType";
    public static instance(): ng.IDirectiveFactory {
      return () => new Directive();
    }
    scope = {
      focas: "=",
    };
  }
}

export default {
  slug: edvl.ChartTypeDirective.Directive.slug,
  instance: edvl.ChartTypeDirective.Directive.instance,
};
