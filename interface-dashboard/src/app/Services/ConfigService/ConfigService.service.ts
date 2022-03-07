import { IRootScopeService } from "angular";
import { Observable } from "../DataService/DistilledDataService.service";
import chartsData from "./ChartsData";

module edvl {
  export class ConfigService {
    public static $inject = ["$rootScope"];
    chartsData: any;
    selectedChartType: string;

    constructor() {
      this.chartsData = chartsData;
      this.selectedChartType = "map"
    }
 
    public setSelectedChartType(chartType: string) {      
      this.selectedChartType = chartType;
    }
    public getSelectedChartType(): string {
      return this.selectedChartType
    }
    public getChartDataById(id: string) {
      const chartType = this.chartsData.find((ch: any) => ch.id == id);
      return chartType;
    }
    public getAttributesById(id: string) {
      const chartType = this.getChartDataById(id);
      return chartType.attributes;
    }
  }
}

export default edvl.ConfigService;
