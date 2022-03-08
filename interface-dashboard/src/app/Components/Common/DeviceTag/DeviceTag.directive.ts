import template from "./DeviceTag.template.html?raw";
import { hsl } from "d3-color";
module edvl.DeviceTagDirective {
  export interface IScope extends ng.IScope {
    inverse: (color: string) => string;
  }
  export class Directive implements ng.IDirective {
    controllerAs = "vm";
    template = template;
    replace = true;
    transclude = true;
    restrict = "E";
    public static instance = () => () => new Directive();
    public static slug = "deviceTag";
    bindToController = true;
    controller = class {
      public showClose: boolean;
      public static $inject = ["$scope"];
      constructor(private $scope: IScope) {
        this.showClose = false;
        this.$scope.inverse = (color: string): string => {
          return hsl(color).l > 0.65 ? "#000" : "#fff";
        };
      }
    };
    scope = {
      data: "=",
      showClose: "=",
    };
  }
}

export default {
  slug: edvl.DeviceTagDirective.Directive.slug,
  instance: edvl.DeviceTagDirective.Directive.instance,
};
