// import app from './app/app'


import app from "./app/app";
import "phosphor-icons";
import "./style.css";
import "angularjs-dragula/dist/dragula.min.css";
import "angular-ui-grid/ui-grid.min.css"
import "leaflet/dist/leaflet.css"

app.run(() => {
  console.log("app is up and running");
});
