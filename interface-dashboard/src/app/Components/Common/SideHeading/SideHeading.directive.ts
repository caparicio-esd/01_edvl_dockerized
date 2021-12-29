import template from "./SideHeading.template.html?raw";

module edvl.SideHeadingDirective {
  export class Directive implements ng.IDirective {
    controllerAs = "vm";
    template = template;
    replace = true;
    transclude = true;
    restrict = "E";
    public static instance = () => () => new Directive();
    public static slug = "sideHeading";
    // bindToController = true
    controller = class {
      public static $inject = ["$scope"];
      constructor(private $scope: ng.IScope) {}
    };
    scope = {
      title: "=",
      icon: "=",
    };
  }
}

export default {
  slug: edvl.SideHeadingDirective.Directive.slug,
  instance: edvl.SideHeadingDirective.Directive.instance,
};
