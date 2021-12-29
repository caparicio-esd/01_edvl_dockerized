import { IDirectiveLinkFn, IScope, IAttributes, IController, IDirectivePrePost } from "angular";
import DummyService from "../../Services/Dummy/Dummy.service";
import template from "./dummy.template.html?raw"

module edvl.DummyDirective {
  export interface IScope extends ng.IScope {
      DummyService: DummyService;
      focas: string[]
      heroes: string[]
  }
  export interface IDirectiveController extends ng.IController {
      addFoca: (foca: string) =>  void
      getFocas: () => string[]
      processForm: ($event: SubmitEvent) => void
  }
  export class Controller implements IDirectiveController {
    public static $inject = ["$scope", "$location", "DummyService"];
    constructor(
      private $scope: IScope,
      private $location_: ng.ILocationService,
      private DummyService: DummyService
    ) {
      this.$scope.DummyService = DummyService
    }
    public getFocas() {
        return this.$scope.focas
    }
    public getHeroes() {
        return this.$scope.heroes
    }
    public addFoca(foca: string) {
        this.$scope.focas.push(foca)
        this.DummyService.setGreeting(this.DummyService.initialGreeting + " - " + this.$scope.focas.length)
    }
    public deleteFoca(index: number) {
      this.$scope.focas.splice(index, 1)
    }
    public processForm($event: SubmitEvent) {
        $event.preventDefault()
        const target: HTMLFormElement | null = $event.currentTarget as HTMLFormElement
        const input = target.elements.namedItem("foca") as HTMLInputElement
        this.addFoca(input.value)
        target.reset()
        input.blur()
    }
    public $onInit() {
      this.DummyService.setGreeting(this.DummyService.initialGreeting + " - " + this.$scope.focas.length)
    }
    public $postLink() {
      
    }
    public $doCheck() {

    }
    public $onChanges(_: ng.IOnChangesObject) {

    }
    public $onDestroy() {

    }
  }

  export class Directive implements ng.IDirective {
    controller: ng.Injectable<ng.IControllerConstructor> = Controller;
    controllerAs = "vm";
    template = template
    replace = true
    transclude = true;
    restrict = "E"
    public static slug = "dummy";
    public static instance(): ng.IDirectiveFactory {
      return () => new Directive();
    }
    scope = {
      focas: "="
    }
  }
}

export default {
  slug: edvl.DummyDirective.Directive.slug,
  instance: edvl.DummyDirective.Directive.instance,
};
