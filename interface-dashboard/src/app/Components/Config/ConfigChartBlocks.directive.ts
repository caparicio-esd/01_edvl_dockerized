import template from "./ConfigChartBlocks.template.html?raw";
import ConfigServiceService from "../../Services/ConfigService/ConfigService.service";
import { IRootScopeService } from "angular";
import { schemeTableau10 } from "d3";

module edvl.ConfigChartBlocksDirective {
  export interface IScope extends ng.IScope {
    currentDataAttrsContent: any;
    dragulaScope: {};
    jarl: any[];
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
      this.$scope.configService = ConfigService;
      this.$scope.dragulaScope = [];
      this.$scope.attrs = this.ConfigService.getAttributesById(
        ConfigService.selectedChartType
      );
      this.$scope.currentDataAttrsContent = [];

      this.dragulaService.options(this.$rootScope, "a", {
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

      // colors in new tabs
      const getTheDataAttrsContent = () => {
        const activeIndex = this.$scope.configService.getActiveChartDataIndex();
        const chartsData = this.$scope.configService.chartsData[activeIndex];
        const chartDataAttrs = chartsData.attributes;
        return chartDataAttrs;
      };
      this.$rootScope.$on("a.drop-model", (ev, target, source) => {
        const gtdac = getTheDataAttrsContent();
        gtdac.forEach((c: any) => {
          c.content.forEach((ca: any) => {
            this.$scope.currentDataAttrsContent.push(ca);
            if (!ca.color) {
              ca.color =
                schemeTableau10[
                  Math.floor(Math.random() * schemeTableau10.length)
                ];
              this.$scope.$emit("drop-model", ca);
            }
          });
        });
      });
      this.$rootScope.$on("a.remove-model", (ev, container) => {
        this.$scope.currentDataAttrsContent.forEach((ca: any) => {
          if (ca.color != null) {
            this.$scope.$emit("remove-model", ca);
            ca.color = null;
          }
        });
        this.$scope.currentDataAttrsContent = [];
      });
    }
    public getAttributes() {
      const selectedChartType =
        this.$scope.configService.getSelectedChartType();
      return this.$scope.configService.getAttributesById(selectedChartType);
    }
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
