import template from "./dummySimple.template.html?raw";

module edvl.DummySimpleDirective {
  export class Directive implements ng.IDirective {
    controllerAs = "vm";
    template = template;
    replace = true;
    transclude = true;
    restrict = "E";
    public static instance = () => () => new Directive();
    public static slug = "dummySimple";
    // bindToController = true
    controller = class {
      public static $inject = ["$scope"];
      constructor(private $scope: ng.IScope) {}
    };
    scope = {
      attr: "=",
    };
  }
}

export default {
  slug: edvl.DummySimpleDirective.Directive.slug,
  instance: edvl.DummySimpleDirective.Directive.instance,
};
