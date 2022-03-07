import ConfigService from "../../Services/ConfigService/ConfigService.service";
import DistilledDataServiceService from "../../Services/DataService/DistilledDataService.service";
import template from "./Chart.template.html?raw";
import TimeSeries from "./ChartFactory/TimeSeries";

module edvl.ChartDirective {
  export interface IScope extends ng.IScope {
    name: string;
    selectedChartType: () => string;
    distilledData: DistilledDataServiceService;
    configData: () => any[];
    chartLabels: { x: string; y: string; source: string };
    chart: TimeSeries;
    chartBind: HTMLDivElement | null;
  }
  export interface IDirectiveController extends ng.IController {}
  export class Controller implements IDirectiveController {
    public static $inject = ["$scope", "DistilledDataService", "ConfigService"];
    constructor(
      private $scope: IScope,
      private distilledDataService: DistilledDataServiceService,
      private configService: ConfigService
    ) {
      //
      this.$scope.name = "line-timeseries"
      this.$scope.chartLabels = {
        x: "Updated time",
        y: "Temperature",
        source: "source...",
      };
      
      //
      this.$scope.chartBind = document.querySelector<HTMLDivElement>(".chart");
      this.$scope.chart = new TimeSeries(this.$scope.chartBind);
  
      //
      this.$scope.selectedChartType = () => configService.getSelectedChartType()
      this.$scope.configData = () => configService.getAttributesById(this.$scope.name)[0].content;
      this.$scope.distilledData = distilledDataService;

      // add remove lines
      this.$scope.$watchCollection("configData()", () => {
        this.$scope.chart.update(null, this.$scope.configData());
      });

      // add queued data observer
      this.$scope.$on("distilledData", (_, lastData) => {    
        const shouldUpdate = this.$scope.configData().some((cd) => {
          return cd.device.id == lastData.id;
        });
        if (shouldUpdate) {
          this.$scope.chart.update(lastData, this.$scope.configData());
        }
      });
    }
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
