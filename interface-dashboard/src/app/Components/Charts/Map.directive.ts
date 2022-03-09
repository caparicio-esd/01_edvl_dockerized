import angular, { IRootScopeService, ITimeoutService } from "angular";
import ConfigService from "../../Services/ConfigService/ConfigService.service";
import DistilledDataServiceService from "../../Services/DataService/DistilledDataService.service";
import template from "./Map.template.html?raw";
import "ui-leaflet";
import { createUniqueIdFromDeviceForMap } from "../../utils";
import { bbox, lineString } from "@turf/turf";

const svgIcon = (color = "orange", size = 20) => {
  return `
    <svg 
      width="${size}" 
      height="${size}"
      style="background-color: transparent"
      >
      <circle cx="${size/2}" cy="${size/2}" r="${size/4}" stroke="${color}" fill="${color}" fill-opacity="0.8"></circle>
    </svg>
  `
}

module edvl.MapDirective {
  export interface IScope extends ng.IScope {
    getBounds: () => any;
    bounds: {
      northEast: { lat: number; lng: number };
      southWest: { lat: number; lng: number };
    };
    showMap: boolean;
    name: string;
    selectedChartType: () => string;
    distilledData: DistilledDataServiceService;
    configService: ConfigService;
    configData: any;
    data: any[];
    center: any;
    markers: any;
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
      this.$scope.bounds = {
        northEast: {
          lat: 0,
          lng: 0,
        },
        southWest: {
          lat: 0,
          lng: 0,
        },
      };

      // map config
      angular.extend(this.$scope, {
        center: {
          lat: -15.25241,
          lng: -52.21115241,
          zoom: 4,
        },
        markers: {},
        bounds: [],
        tiles: {
          openstreetmap: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        },
        defaults: {
          scrollWheelZoom: false,
          preferCanvas: true
        },
      });

      // bounds calc
      this.$scope.getBounds = (): any => {
        const markers = Object.values(this.$scope.markers);
        const markersToPureArray = markers.map((marker: any): number[] => {
          const markerAsArray = Object.values(marker) as number[];
          return [markerAsArray[0], markerAsArray[1]];
        });
        if (markersToPureArray.length > 2) {
          const line = lineString(markersToPureArray, {});
          const box = bbox(line);
          return box;
        } else {
          return false;
        }
      };

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

      //
      this.$scope.$watchCollection("configData()", (_) => {
        // console.log(val);
      });

      //
      this.$scope.$on("distilledData", (_, lastData) => {
        const shouldUpdate = this.$scope.configData().some((cd: any) => {
          return cd.device.id == lastData.id;
        });
        if (shouldUpdate) {
          //
          const location = lastData.location.value
            .split(", ")
            .map((a: string) => +a);

          //
          this.$scope.bounds = this.$scope.getBounds()


          // location
          this.$scope.markers[createUniqueIdFromDeviceForMap(lastData)] = {
            lng: location[0],
            lat: location[1],
            icon: {
              type: 'div',
              iconSize: [20, 20],
              html: svgIcon()
            }
          };
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
