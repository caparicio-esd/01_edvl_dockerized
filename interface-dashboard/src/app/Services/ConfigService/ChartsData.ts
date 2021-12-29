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
        name: "Latitude",
        id: "latitude",
        content: [],
      },
      {
        name: "Longitude",
        id: "longitude",
        content: [],
      },
      {
        name: "Size",
        id: "size",
        content: [],
      },
      {
        name: "Category",
        id: "category",
        content: [],
      },
    ],
  },
];
