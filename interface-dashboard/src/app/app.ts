import angular from "angular";
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
import dummyDirective from "./Components/Dummy.directive/dummy.directive";
import dummySimpleDirective from "./Components/Dummy.directive/dummySimple.directive";
import MainBlockDirective from "./Components/MainBlock/MainBlock.directive";
import MainBlockHeadingDirective from "./Components/MainBlock/MainBlockHeading.directive";
import SensorSidebarDirective from "./Components/Sensor/SensorSidebar.directive";
import ConfigService from "./Services/ConfigService/ConfigService.service";
import DistilledDataService from "./Services/DataService/DistilledDataService.service";
import OrionConnectionService from "./Services/DataService/OrionConnectionService.service";
import RawDataService from "./Services/DataService/RawDataService.service";

export default angular
  .module("edvl", [angularDragula(angular)])
  .directive(dummyDirective.slug, dummyDirective.instance())
  .directive(dummySimpleDirective.slug, dummySimpleDirective.instance())
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

  .service(ConfigService.name, ConfigService)
  .service(RawDataService.name, RawDataService)
  .service(DistilledDataService.name, DistilledDataService)
  .service(OrionConnectionService.name, OrionConnectionService)

