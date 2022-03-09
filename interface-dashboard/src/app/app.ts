import angular from "angular";
import uiGrid from 'angular-ui-grid'
import "angular-simple-logger"
import "ui-leaflet"
import "leaflet"
import angularDragula from "angularjs-dragula";
import ChartDirective from "./Components/Charts/Chart.directive";
import ChartTypeDirective from "./Components/Charts/ChartType.directive";
import MapDirective from "./Components/Charts/Map.directive";
import TableDirective from "./Components/Charts/Table.directive";
import AccordionDirective from "./Components/Common/Accordion/Accordion.directive";
import DeviceTagDirective from "./Components/Common/DeviceTag/DeviceTag.directive";
import SideHeadingDirective from "./Components/Common/SideHeading/SideHeading.directive";
import ConfigChartBlocksDirective from "./Components/Config/ConfigChartBlocks.directive";
import ConfigChartTypeDirective from "./Components/Config/ConfigChartType.directive";
import ConfigSidebarDirective from "./Components/Config/ConfigSidebar.directive";
import DashBoardItemDirective from "./Components/DashBoardItem/DashBoardItem.directive";
import MainBlockDirective from "./Components/MainBlock/MainBlock.directive";
import MainBlockHeadingDirective from "./Components/MainBlock/MainBlockHeading.directive";
import SensorSidebarDirective from "./Components/Sensor/SensorSidebar.directive";
import ConfigService from "./Services/ConfigService/ConfigService.service";
import DistilledDataService from "./Services/DataService/DistilledDataService.service";
import OrionConnectionService from "./Services/DataService/OrionConnectionService.service";
import RawDataService from "./Services/DataService/RawDataService.service";
import { createUniqueAttribute, createUniqueDOMAttribute, createUniqueIdFromDevice } from "./utils";

export default angular
  .module("edvl", [angularDragula(angular), uiGrid, "nemLogging", "ui-leaflet"])
  .directive(DashBoardItemDirective.slug, DashBoardItemDirective.instance())
  .directive(SensorSidebarDirective.slug, SensorSidebarDirective.instance())
  .directive(SideHeadingDirective.slug, SideHeadingDirective.instance())
  .directive(AccordionDirective.slug, AccordionDirective.instance())
  .directive(DeviceTagDirective.slug, DeviceTagDirective.instance())
  .directive(ConfigSidebarDirective.slug, ConfigSidebarDirective.instance())
  .directive(ConfigChartTypeDirective.slug, ConfigChartTypeDirective.instance())
  .directive(ConfigChartBlocksDirective.slug, ConfigChartBlocksDirective.instance())
  .directive(MainBlockDirective.slug, MainBlockDirective.instance())
  .directive(MainBlockHeadingDirective.slug, MainBlockHeadingDirective.instance())
  .directive(ChartTypeDirective.slug, ChartTypeDirective.instance())
  .directive(ChartDirective.slug, ChartDirective.instance())
  .directive(TableDirective.slug, TableDirective.instance())
  .directive(MapDirective.slug, MapDirective.instance())
  .service("ConfigService", ConfigService)
  .service("RawDataService", RawDataService)
  .service("DistilledDataService", DistilledDataService)
  .service("OrionConnectionService", OrionConnectionService)
  
  .run(["$rootScope", ($rootScope: any)=> {
    $rootScope.utils = {}
    $rootScope.utils.createUniqueIdFromDevice = createUniqueIdFromDevice
    $rootScope.utils.createUniqueAttribute = createUniqueAttribute
    $rootScope.utils.createUniqueDOMAttribute = createUniqueDOMAttribute
  }])
