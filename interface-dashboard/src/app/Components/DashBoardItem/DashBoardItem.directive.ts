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
