import DistilledDataService from "./DistilledDataService.service";
import OrionConnectionService, {
  Receiver,
} from "./OrionConnectionService.service";

// SERVICIOS CONECTAAAAAR
module edvl {
  export interface IRawDataService extends Receiver {
    distilledDataService: DistilledDataService;
    receiveData: (data: any) => void;
  }
  export class RawDataService implements Receiver {
    public static $inject = ["DistilledDataService"];
    constructor(public distilledDataService: DistilledDataService) {
      OrionConnectionService.getOrCreateConnection();
      OrionConnectionService.connectReceiver(this);      
    }
    receiveData(data: any): void {      
      this.distilledDataService.processIncomingData(data)                  
    }
  }
}

export default edvl.RawDataService;
