import angular from "angular";
import ConfigService from "../../Services/ConfigService/ConfigService.service";
import DistilledDataServiceService from "../../Services/DataService/DistilledDataService.service";
import template from "./Table.template.html?raw";

module edvl.TableDirective {
  export interface IScope extends ng.IScope {
    showGrid: boolean;
    name: string;
    selectedChartType: () => string;
    distilledData: DistilledDataServiceService;
    scroll: {
      x: number | undefined;
      y: number | undefined;
      height: number | undefined;
    };
    createColumns: (n: any, o: any) => void;
    configService: ConfigService;
    configData: any;
    gridOptions: any;
    size: DOMRect | undefined;
    data: any[];
  }
  export interface IDirectiveController extends ng.IController {}
  export class Controller implements IDirectiveController {
    public static $inject = [
      "$scope",
      "DistilledDataService",
      "ConfigService",
      "uiGridConstants",
    ];
    constructor(
      private $scope: IScope,
      private distilledDataService: DistilledDataServiceService,
      private configService: ConfigService
    ) {
      // sizing block
      const chartWrapper =
        document.querySelector<HTMLDivElement>(".chart_wrapper");
      this.$scope.size = chartWrapper?.getBoundingClientRect();

      // get columns from config block
      this.$scope.name = "table";
      this.$scope.configService = this.configService;
      this.$scope.selectedChartType = () =>
        configService.getSelectedChartType();
      this.$scope.configData = () =>
        configService.getAttributesById(this.$scope.name)[0].content;
      this.$scope.distilledData = this.distilledDataService;

      //
      this.$scope.data = [];
      this.$scope.showGrid = false;
      this.$scope.gridOptions = {
        columnDefs: [
          {
            field: "updated",
            width: 150,
          },
        ],
        data: [],
      };

      // add column
      const normalizeFieldName = (strIn: String): String => {
        return strIn.split(":").join("_").split("-").join("_");
      };
      const normalizeColumnName = (strIn: String): String => {
        return strIn.split("urn:ngsi-ld:")[1].split(" ").join("__");
      };
      const normalizeName = (configData: any) => {
        const name = normalizeColumnName(
          configData.device.id + " " + configData.name
        );
        const field = normalizeFieldName(name);
        return {
          field,
          name,
        };
      };
      this.$scope.createColumns = (n, o) => {
        const mustSplice = n.length < o.length;
        if (mustSplice) {
          // intersection
          let splicingIndex = -1;
          for (let i = 0; i < o.length; i++) {
            const pi = n.findIndex(
              (nItem: any) =>
                normalizeName(o[i]).field == normalizeName(nItem).field
            );
            if (pi == -1) {
              splicingIndex = i + 1;
              break;
            }
          }
          this.$scope.gridOptions.columnDefs.splice(splicingIndex, 1);
        } else {
          // difference
          let addingElement;
          for (let i = 0; i < n.length; i++) {
            const pe = o.find(
              (oItem: any) =>
                normalizeName(n[i]).field == normalizeName(oItem).field
            );
            if (pe == null) {
              addingElement = n[i];
              break;
            }
          }
          if (addingElement) {
            this.$scope.gridOptions.columnDefs.push({
              field: normalizeName(addingElement).field,
              name: normalizeName(addingElement).name,
              config: addingElement,
              width: 200,
            });
          }
        }
      };

      // add remove colummns observer
      this.$scope.$watchCollection("configData()", (newValue, oldValue) => {
        this.$scope.createColumns(newValue, oldValue);
      });

      this.$scope.$watch("selectedChartType()", (val) => {
        if (val == "table") {
          this.$scope.showGrid = true;
        } else {
          this.$scope.showGrid = false;
        }
      });

      // add rows
      this.$scope.$on("distilledData", (_, lastData) => {
        const observationDate = new Date();
        const shouldUpdate = this.$scope.configData().some((cd: any) => {
          return cd.device.id == lastData.id;
        });

        if (shouldUpdate) {
          //filas
          const fieldObj: any = {};
          this.$scope.gridOptions.columnDefs.forEach((column: any) => {
            if (column.hasOwnProperty("config")) {
              const fieldName = normalizeName(column.config).field;
              const lastEventField = normalizeColumnName(lastData.id);
              const currentValue = lastData[column.config.name].value;
              //@ts-ignore
              fieldObj[fieldName] = currentValue; // Populate with real data
            }
          });

          this.$scope.gridOptions.data.push({
            ...fieldObj,
            updated: observationDate.toISOString(),
          });

          this.$scope.$digest();
        }

        document
          .querySelector(".ui-grid-viewport")
          ?.scrollTo(0, Number.MAX_SAFE_INTEGER);
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
    public static slug = "table";
    public static instance(): ng.IDirectiveFactory {
      return () => new Directive();
    }
    scope = {
      focas: "=",
    };
  }
}

export default {
  slug: edvl.TableDirective.Directive.slug,
  instance: edvl.TableDirective.Directive.instance,
};
