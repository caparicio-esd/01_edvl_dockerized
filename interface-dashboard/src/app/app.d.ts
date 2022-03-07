declare module "angularjs-dragula";
declare module "ui-leaflet";


type NGSIType = "Number" | "geo:point"
interface DeviceAttribute {
    name: string, 
    device: {
        id: string, 
        type: NGSIType, 
    }, 
    metadata: {}
    [key: string]: any // for angular stuff
}
interface Sensor {
    id: string, 
    attributes: DeviceAttribute[]
}