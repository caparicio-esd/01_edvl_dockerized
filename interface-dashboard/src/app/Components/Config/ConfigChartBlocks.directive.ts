import template from "./ConfigChartBlocks.template.html?raw";
import ConfigServiceService from "../../Services/ConfigService/ConfigService.service";

module edvl.ConfigChartBlocksDirective {
  export interface IScope extends ng.IScope {
    attrs: any;
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
      this.$scope.attrs = ConfigService.getAttributesById(ConfigService.selectedChartType)
    }
    public getAttributes() {
      const selectedChartType = this.$scope.configService.selectedChartType
      return this.$scope.configService.getAttributesById(selectedChartType)
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
    public static slug = "configChartBlocks";
    public static instance(): ng.IDirectiveFactory {
      return () => new Directive();
    }
    scope = {};
  }
}

export default {
  slug: edvl.ConfigChartBlocksDirective.Directive.slug,
  instance: edvl.ConfigChartBlocksDirective.Directive.instance,
};
