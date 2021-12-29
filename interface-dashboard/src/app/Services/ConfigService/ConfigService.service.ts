import chartsData from "./ChartsData";

module edvl {
  export class ConfigService {
    public static $inject = [];
    chartsData: any;
    selectedChartType: string;
    constructor() {
      // TODO refactor into classes
      this.chartsData = chartsData;
      this.selectedChartType = "line-timeseries";
    }
    public selectChartType(chartType: string) {
      this.selectedChartType = chartType;
    }
    public getChartDataById(id: string) {
      const chartType = this.chartsData.find((ch:any) => ch.id == id)
      return chartType
    }
    public getAttributesById(id: string) {
      const chartType = this.getChartDataById(id)
      return chartType.attributes
    }
  }
}

export default edvl.ConfigService;
