import angular, { IRootScopeService, ITimeoutService } from "angular";
import ConfigService from "../../Services/ConfigService/ConfigService.service";
import DistilledDataServiceService from "../../Services/DataService/DistilledDataService.service";
import template from "./Map.template.html?raw";
import "ui-leaflet";

module edvl.MapDirective {
  export interface IScope extends ng.IScope {
    showMap: boolean;
    name: string;
    selectedChartType: () => string;
    distilledData: DistilledDataServiceService;
    configService: ConfigService;
    configData: any;
    data: any[];
    center: any;
  }
  export interface IDirectiveController extends ng.IController {}
  export class Controller implements IDirectiveController {
    public static $inject = [
      "$scope",
      "DistilledDataService",
      "ConfigService",
      "$timeout",
    ];
    constructor(
      private $scope: IScope,
      private distilledDataService: DistilledDataServiceService,
      private configService: ConfigService,
      private $timeout: ITimeoutService
    ) {
      // main config
      this.$scope.name = "map";
      this.$scope.configService = this.configService;
      this.$scope.showMap = false;
      this.$scope.selectedChartType = () =>
        configService.getSelectedChartType();
      this.$scope.configData = () =>
        configService.getAttributesById(this.$scope.name)[0].content;
      this.$scope.distilledData = this.distilledDataService;

      // map config
      angular.extend(this.$scope, {
        center: {
          lat: -15.25241,
          lng: -52.21115241,
          zoom: 4,
          autoDiscover: false,
        },
        markers: {
          mainMarker: {},
        },
        position: {
          lat: -27.0990815,
          lng: -52.6113324,
        },
        tiles: {
          openstreetmap: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        },
        defaults: {
          scrollWheelZoom: false,
        },
      });

      console.log(this.$scope);

      // hide - show grid for grid viewport rendering
      this.$scope.$watch("selectedChartType()", (val) => {
        this.$timeout(
          () => {
            if (val == "map") {
              this.$scope.showMap = true;
            } else {
              this.$scope.showMap = false;
            }
          },
          50,
          true
        );
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
    public static slug = "map";
    public static instance(): ng.IDirectiveFactory {
      return () => new Directive();
    }
    scope = {};
  }
}

export default {
  slug: edvl.MapDirective.Directive.slug,
  instance: edvl.MapDirective.Directive.instance,
};
