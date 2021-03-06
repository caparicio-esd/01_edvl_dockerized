export default [
  {
    name: "Line Timeseries",
    id: "line-timeseries",
    icon: "chart-line",
    realtime: true,
    attributes: [
      {
        name: "Axis Y",
        id: "yaxis",
        content: [],
      },
    ],
  },
  {
    name: "Table Data",
    id: "table",
    icon: "table",
    realtime: true,
    attributes: [
      {
        name: "Column",
        id: "column",
        content: [],
      },
    ],
  },
  {
    name: "Map",
    id: "map",
    icon: "map-trifold",
    realtime: false,
    attributes: [
      {
        name: "Location",
        id: "location",
        content: [],
      },
      // {
      //   name: "Size",
      //   id: "size",
      //   content: [],
      // },
    ],
  },
];
