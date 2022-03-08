import DistilledDataService from "../../Services/DataService/DistilledDataService.service";
import RawDataService from "../../Services/DataService/RawDataService.service";

import template from "./DashBoardItem.template.html?raw";

module edvl.DashBoardItemDirective {
  export interface IScope extends ng.IScope {
    distilledData: DistilledDataService;
    devices: any;
  }
  export interface IDirectiveController extends ng.IController {}
  export class Controller implements IDirectiveController {
    public static $inject = ["$scope", "DistilledDataService", "RawDataService"];
    constructor(
      private $scope: IScope,
      private distilledDataService: DistilledDataService, 
    ) {
      this.$scope.devices = [];
      this.$scope.$on("device", (_, devices) => {        
        this.$scope.devices = devices
        this.$scope.$digest()
      })
      const getTheDataAttrsContent = (attribute: any) => {
        const sensorType = this.$scope.devices.find((d: any) => d.name == attribute.device.type)
        const sensorEntity = sensorType.content.find((d: any) => d.id == attribute.device.id)
        const attributeIndex = sensorEntity.attributes.find((a: any) => a.name == attribute.name)
        return attributeIndex
      }
      this.$scope.$on("drop-model", (_, attribute) => {
        getTheDataAttrsContent(attribute).color = attribute.color
      })
      this.$scope.$on("remove-model", (_, attribute) => {        
        getTheDataAttrsContent(attribute).color = null
      })
    }
  }

  export class Directive implements ng.IDirective {
    controller: ng.Injectable<ng.IControllerConstructor> = Controller;
    controllerAs = "vm";
    template = template;
    replace = true;
    transclude = true;
    restrict = "E";
    public static slug = "dashBoardItem";
    public static instance(): ng.IDirectiveFactory {
      return () => new Directive();
    }
    scope = {};
  }
}

export default {
  slug: edvl.DashBoardItemDirective.Directive.slug,
  instance: edvl.DashBoardItemDirective.Directive.instance,
};
