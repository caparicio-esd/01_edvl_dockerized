import { IController } from "angular";

export interface Observable {
  observers: (() => void)[];
  notifyObservers: () => void;
  addObserver: (callback: () => void) => void;
}

module edvl {
  export class DistilledDataService implements Observable {
    maxQueueSize: number = 20;
    queuedData!: any[];
    devices!: any;
    observers!: (() => void)[];

    public static $inject = [];
    constructor() {
      this.queuedData = [];
      this.devices = [];
      this.observers = [];
    }

    public addObserver(callback: () => void): void {      
      this.observers.push(callback);      
    }

    public notifyObservers(): void {      
      this.observers.forEach((obs: () => void) => {
        obs();
      });
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
      this.notifyObservers();
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
    }

    private extractAttributes(data: any): any[] {
      const attributes: any[] = [];
      const avoid = ["type"];
      const entries = Object.entries(data);
      entries
        .filter((e) => !avoid.includes(e[0]))
        .forEach((entry) => {
          attributes.push({
            name: entry[0],
            type: (entry[1] as any).type,
            metadata: (entry[1] as any).metadata,
          });
        });
      return attributes;
    }
  }
}

export default edvl.DistilledDataService;
