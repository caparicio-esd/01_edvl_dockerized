import template from "./ConfigChartBlocks.template.html?raw";
import ConfigServiceService from "../../Services/ConfigService/ConfigService.service";
import { IRootScopeService } from "angular";

module edvl.ConfigChartBlocksDirective {
  export interface IScope extends ng.IScope {
    attrs: any;
    configService: ConfigServiceService;
  }
  export interface IDirectiveController extends ng.IController {}
  export class Controller implements IDirectiveController {
    public static $inject = [
      "$scope",
      "$rootScope",
      "ConfigService",
      "dragulaService",
    ];
    constructor(
      private $scope: IScope,
      private $rootScope: IRootScopeService,
      private ConfigService: ConfigServiceService,
      private dragulaService: any
    ) {
      const self = this;
      this.$scope.configService = ConfigService;
      this.$scope.attrs = ConfigService.getAttributesById(
        ConfigService.selectedChartType
      );

      // config hereee!!
      dragulaService.options($rootScope, "a", {
        removeOnSpill: (_: HTMLElement, source: HTMLElement) => {
          return !source.classList.contains("dragula_chartBlocks");
        },
        copy: (_: HTMLElement, source: HTMLElement) => {
          return !source.classList.contains("dragula_chartBlocks");
        },
        accepts: (_: HTMLElement, source: HTMLElement) => {
          return source.classList.contains("dragula_chartBlocks");
        },
      });

      this.$rootScope.$on("a.drag", function (ev, el, container) {
        console.log(ev, el, container);
      });
      this.$rootScope.$on("a.drop", function (ev, el, container) {
        console.log(ev, el, container);
      });
    }
    public getAttributes() {
      const selectedChartType = this.$scope.configService.selectedChartType;
      return this.$scope.configService.getAttributesById(selectedChartType);
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
