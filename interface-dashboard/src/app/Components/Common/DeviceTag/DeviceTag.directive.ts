import template from "./DeviceTag.template.html?raw";

module edvl.DeviceTagDirective {
  export class Directive implements ng.IDirective {
    controllerAs = "vm";
    template = template;
    replace = true;
    transclude = true;
    restrict = "E";
    public static instance = () => () => new Directive();
    public static slug = "deviceTag";
    bindToController = true
    controller = class {
      public showClose: boolean
      public static $inject = ["$scope"];
      constructor(private $scope: ng.IScope) {
        this.showClose = false
      }
    };
    scope = {
      data: "=",
      showClose: "="
    };
  }
}

export default {
  slug: edvl.DeviceTagDirective.Directive.slug,
  instance: edvl.DeviceTagDirective.Directive.instance,
};
