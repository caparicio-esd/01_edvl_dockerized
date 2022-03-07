import { IController, IRootScopeService, IScope } from "angular";

export interface Observable {
  observers: (() => void)[];
  notifyObservers: () => void;
  addObserver: (callback: () => void) => void;
}

module edvl {
  export class DistilledDataService {
    maxQueueSize: number = 150;
    queuedData!: any[];
    devices!: any;
    lastDataEvent!: any;
    notNeededData: string[] = ["id", "updated", "name", "type"]

    public static $inject = ["$rootScope"];
    constructor(public $rootScope: IRootScopeService) {
      this.queuedData = [];
      this.devices = [];
      this.lastDataEvent = {}
    }


    public processIncomingData(data: any) {      
      const innerData = data.data[0];
      if (this.queuedData.length >= this.maxQueueSize) {
        this.queuedData.shift();
      }
      if (!this.hasDeviceType(innerData)) {
        this.addDeviceType(innerData);
      }
      if (!this.hasDeviceId(innerData)) {
        this.addDevice(innerData);
      }
      this.queuedData.push(innerData);     
      this.lastDataEvent = innerData       
      this.$rootScope.$broadcast("distilledData", this.lastDataEvent)
    }

    private hasDeviceType(data: any): boolean {
      const deviceType = this.devices.findIndex(
        (d: any) => d.name == data.type
      );
      return deviceType >= 0;
    }

    private addDeviceType(data: any) {
      this.devices.push({
        name: data.type,
        content: [],
      });
    }

    private hasDeviceId(data: any): boolean {
      const deviceType = this.devices.find((d: any) => d.name == data.type);
      const content = deviceType.content;
      const device = content.findIndex((d: any) => d.id == data.id);
      return device >= 0;
    }

    private addDevice(data: any) {
      const deviceTypeIndex = this.devices.findIndex(
        (d: any) => d.name == data.type
      );
      this.devices[deviceTypeIndex].content.push({
        id: data.id,
        attributes: this.extractAttributes(data),
      });
      
      this.$rootScope.$broadcast("device", this.devices)
    }

    private extractAttributes(data: any): any[] {      
      const attributes: any[] = [];
      const avoid = ["type", ...this.notNeededData];
      const entries = Object.entries(data);
      entries
        .filter((e) => !avoid.includes(e[0]))
        .forEach((entry) => {
          attributes.push({
            name: entry[0],
            type: (entry[1] as any).type,
            metadata: (entry[1] as any).metadata,
            device: {
              type: data.type, 
              id: data.id
            }, 
            color: null, 
            disabled: false
          });
        });
      return attributes;
    }
  }
}

export default edvl.DistilledDataService;
