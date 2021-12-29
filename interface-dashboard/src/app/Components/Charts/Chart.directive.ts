import angular from "angular";
import template from "./Chart.template.html?raw";
import ChartFactory from "./ChartFactory/Chart.factory";

module edvl.ChartDirective {
  export interface IScope extends ng.IScope {
    chartLabels: { x: string; y: string; source: string; };
    chart: ChartFactory;
    chartBind: HTMLDivElement | null;
  }
  export interface IDirectiveController extends ng.IController {}
  export class Controller implements IDirectiveController {
    public static $inject = ["$scope"];
    constructor(private $scope: IScope) {
      this.$scope.chartLabels = {
        x: "Updated time",
        y: "Temperature",
        source: "source..."
      }
      this.$scope.chart = ChartFactory.factory();
      this.$scope.chartBind = document.querySelector<HTMLDivElement>(".chart");
      this.$scope.chart.setDomComponent(this.$scope.chartBind);
      this.$scope.chart.createChart();
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
    public static slug = "chart";
    public static instance(): ng.IDirectiveFactory {
      return () => new Directive();
    }
    scope = {
      focas: "=",
    };
  }
}

export default {
  slug: edvl.ChartDirective.Directive.slug,
  instance: edvl.ChartDirective.Directive.instance,
};
