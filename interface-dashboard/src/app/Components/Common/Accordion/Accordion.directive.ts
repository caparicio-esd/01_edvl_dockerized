import template from "./Accordion.template.html?raw";

module edvl.AccordionDirective {
  interface AccordionDirectiveScope extends ng.IScope {
    openedIndex: number;
    toggleHandler: ($event: PointerEvent, $index: number) => void;
    isOpenedIndex: ($index: number) => boolean
  }
  export class Directive implements ng.IDirective {
    controllerAs = "vm";
    template = template;
    replace = true;
    restrict = "E";
    public static instance = () => () => new Directive();
    public static slug = "accordion";
    // bindToController = true
    controller = class {
      public static $inject = ["$scope"];
      constructor(private $scope: AccordionDirectiveScope) {
        this.$scope.openedIndex = 0;
        this.$scope.toggleHandler = (_: PointerEvent, $index: number) => this._toggleHandler($index);
        this.$scope.isOpenedIndex = ($index: number) => this._isOpenedIndex($index)
      }
      private _toggleHandler($index: number) {
        if (this.$scope.openedIndex == $index) {
          this.$scope.openedIndex = -1;
        } else {
          this.$scope.openedIndex = $index;
        }
      }
      private _isOpenedIndex($index: number) {
        return this.$scope.openedIndex == $index
      }
    };
    scope = {
      accordionData: "=",
      index: "=",
    };
    transclude = {
      handler: "?accordionHandler",
      body: "?accordionBody",
    };
  }
}

export default {
  slug: edvl.AccordionDirective.Directive.slug,
  instance: edvl.AccordionDirective.Directive.instance,
};
