export module AppController {
  interface ScopeInterface extends ng.IScope {}
  export class Controller {
    static $inject = ["$scope"];
    constructor(private $scope: ScopeInterface) {}
  }
}
