import { io, Socket, SocketOptions } from "socket.io-client";


export interface Receiver {
  receiveData(data: Object): void;
}

export module edvl {
  export class OrionConnectionService {
    static socket: Socket;
    static socketOpts: Partial<SocketOptions> = {};
    static socketUrl: string = "http://localhost:1027";
    static lastData: Object;
    static connection: OrionConnectionService;
    static broadcastTo: Array<Receiver> = [];

    private constructor() {}

    static getOrCreateConnection(): OrionConnectionService {  
      if (!this.connection) {
        this.connection = new OrionConnectionService();
        this.connect();
      }
      return this.connection;
    }

    private static connect(): void {
      this.socket = io(this.socketUrl, this.socketOpts);
      this.socket.on("connect", this.connectHandler);
      this.socket.on("data", this.dataHandler);
    }

    private static connectHandler(): void {}

    private static dataHandler(data: Object): void {      
      OrionConnectionService.lastData = data;
      OrionConnectionService.broadcastTo.forEach((bs) =>
        bs.receiveData(OrionConnectionService.lastData)
      );            
    }

    public static connectReceiver(rec: Receiver): void {
      this.broadcastTo.push(rec);
    }
  }
}

export default edvl.OrionConnectionService;
