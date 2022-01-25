import * as d3 from "d3";
import fakeData from "../../../Services/DataService/fakeData";

interface D3Chart {
  chartBind: HTMLDivElement | null | undefined;
  chartSelection?: d3.Selection<d3.BaseType, unknown, null, undefined>;
  chartBody: any;
  chartBrush: any;
  chartBodySelection: d3.Selection<d3.BaseType, unknown, null, undefined>;
  chartBrushSelection: d3.Selection<d3.BaseType, unknown, null, undefined>;
  marginAmount: number;
  margin: {
    t: number;
    r: number;
    b: number;
    l: number;
  };
  sizes: {
    w: number;
    h: number;
  };
  cleanData: () => void;
  createCanvas: () => void;
  extents: () => void;
  scales: () => void;
  calculateAxesAndGrids: () => void;
  geometry: () => void;
  brush: () => void;
  zoom: () => void;
  draw: () => void;
  update: (data: any) => void;
  destroy: () => void;
}
/**
 *
 */
export default class TimeSeries implements D3Chart {
  chartBind: HTMLDivElement | null | undefined;
  chartSelection?:
    | d3.Selection<d3.BaseType, unknown, null, undefined>
    | undefined;
  chartBody: any;
  chartBrush: any;
  chartBodySelection: d3.Selection<d3.BaseType, unknown, null, undefined>;
  chartBrushSelection: d3.Selection<d3.BaseType, unknown, null, undefined>;
  sizes: { w: number; h: number };
  marginAmount = 25;
  margin = {
    t: 20,
    r: 20,
    b: 40,
    l: 40,
  };

  // propios
  data!: any[];
  dateExtent: Date[] = [];
  valueExtent: number[] = [];
  x!: d3.ScaleTime<number, number, never>;
  x2!: d3.ScaleTime<number, number, never>;
  y!: d3.ScaleLinear<number, number, never>;
  ax!: d3.Axis<Date | d3.NumberValue>;
  ay!: d3.Axis<d3.NumberValue>;
  gx!: d3.Axis<Date | d3.NumberValue>;
  gy!: d3.Axis<d3.NumberValue>;
  chart!: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  chartAxes: any;
  gx_: any;
  gy_: any;
  ax_: any;
  ay_: any;
  geometry: any = {
    path: null,
    lineGenerator: null,
    circles: null,
    chartContent: null,
  };

  /**
   *
   * @param _chartBind
   */
  constructor(_chartBind: HTMLDivElement | null) {
    this.chartBind = _chartBind;
    this.chartBody = this.chartBind?.querySelector(".chart_body");
    this.chartBrush = this.chartBind?.querySelector(".chart_brush");
    this.chartBodySelection = d3.select(this.chartBody as d3.BaseType);
    this.chartBrushSelection = d3.select(this.chartBrush as d3.BaseType);
    const chartParentSelection =
      (this.chartBodySelection.node() as HTMLElement)!
        .parentNode as HTMLElement;
    this.sizes = {
      w: (chartParentSelection!
        .parentNode as HTMLElement)!.getBoundingClientRect().width,
      h: chartParentSelection!.getBoundingClientRect().height,
    };

    // REFACTOR THIS
    this.cleanData();
    this.draw();
  }

  /**
   *
   */
  cleanData() {
    this.data = [];
    let i = 0;
    const int = setInterval(() => {
      if (fakeData[i] != undefined) {
        this.data.push(fakeData[i]);
        this.update(this.data);
        i++;
      } else {
        clearInterval(int);
      }
    }, 1000);
  }

  /**
   *
   */
  createCanvas() {
    this.chart = this.chartBodySelection
      .append("svg")
      .attr("width", this.sizes.w)
      .attr("height", this.sizes.h)
      .attr("viewBox", [0, 0, this.sizes.w, this.sizes.h])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .on("touchstart", (event) => event.preventDefault());
  }

  /**
   *
   */
  extents() {
    this.dateExtent = d3
      .extent(this.data, (d) => d.date)
      .map((d) => new Date(d!));
    //REFACTOR THIS
    this.valueExtent = d3.extent(
      this.data,
      (d) => d["temperature"]
    ) as number[];
  }

  /**
   *
   */
  scales() {
    this.x = d3
      .scaleTime()
      .domain(this.dateExtent)
      .range([this.margin.l, this.sizes.w! - this.margin.r]);
    this.x2 = this.x.copy();
    this.y = d3
      .scaleLinear()
      .domain([this.valueExtent[1] + 5, 0])
      .range([this.margin.t, this.sizes.h! - this.margin.b])
      .nice();
  }

  /**
   *
   */
  updateScales() {
    this.x
      .domain(this.dateExtent)
      .range([this.margin.l, this.sizes.w! - this.margin.r]);
    this.x2
      .domain(this.dateExtent)
      .range([this.margin.l, this.sizes.w! - this.margin.r]);
    this.y
      .domain([this.valueExtent[1] + 5, 0])
      .range([this.margin.t, this.sizes.h! - this.margin.b]);
  }

  /**
   *
   */
  calculateAxesAndGrids() {
    this.ax = d3.axisBottom(this.x).ticks(10);
    this.ay = d3.axisLeft(this.y).ticks(10);
    this.gx = d3
      .axisBottom(this.x)
      .tickSizeInner(this.sizes.h! - this.margin.b - this.margin.t)
      .tickFormat("" as any)
      .ticks(10);
    this.gy = d3
      .axisLeft(this.y)
      .tickSizeInner(this.sizes.w! - this.margin.l - this.margin.r)
      .tickFormat("" as any)
      .ticks(10);

    this.chartAxes = this.chart.append("g").attr("class", "axes");
    this.gx_ = this.chartAxes.append("g");
    this.gy_ = this.chartAxes.append("g");
    this.ax_ = this.chartAxes.append("g");
    this.ay_ = this.chartAxes.append("g");
  }

  styleAxesAndGrids() {
    this.gx_
      .attr("class", "gx")
      .call((g: any) =>
        g
          .style(
            "transform",
            `translate(${this.sizes.w - this.margin.r}px, 0px)`
          )
          .style("color", "#ddd")
      )
      .call((g: any) => g.select(".domain").style("visibility", "hidden"));
    this.gy_
      .attr("class", "gy")
      .call((g: any) =>
        g
          .style("transform", `translate(0px, ${this.margin.t}px)`)
          .style("color", "#ddd")
      )
      .call((g: any) => g.select(".domain").style("visibility", "hidden"));
    this.ax_
      .attr("class", "ax")
      .call((g: any) =>
        g
          .style(
            "transform",
            `translate(0px, ${this.sizes.h - this.margin.b}px)`
          )
          .style("color", "#555")
      );
    this.ay_
      .attr("class", "ay")
      .call((g: any) =>
        g
          .style("transform", `translate(${this.margin.l}px, 0px)`)
          .style("color", "#555")
      );
  }

  updateAxesAndGrids() {
    this.ax_.transition().call(this.ax);
    this.ay_.transition().call(this.ay);
    this.gx_.transition().call(this.gy);
    this.gy_.transition().call(this.gx);
  }

  /**
   *
   */
  drawGeometry() {
    // draw chart canvas for first time
    if (this.chart.select(".content").nodes().length == 0) {
      this.geometry.chartContent = this.chart
        .append("g")
        .attr("class", "content");
    }

    // draw and update clippath
    const clipPath = this.chart
      .selectAll("clipPath")
      .data([this.data])
      .join(
        //@ts-ignore
        (enter: any) => {
          enter
            .append("clipPath")
            .attr("id", "clip-path-id")
            .append("rect")
            .attr("x", this.margin.l - 5)
            .attr("y", this.margin.t - 5)
            .attr("width", this.sizes.w - this.margin.l - this.margin.r + 10)
            .attr("height", this.sizes.h - this.margin.t - this.margin.b + 10);
        },
        (update: any) => {
          update
            .attr("x", this.margin.l)
            .attr("y", this.margin.t)
            .attr("width", this.sizes.w - this.margin.l - this.margin.r)
            .attr("height", this.sizes.h - this.margin.t - this.margin.b);
        }
      );

    // update line generator
    const lineGenerator = d3
      .line()
      .curve(d3.curveCardinal.tension(0.5))
      .x((d: any) => this.x(new Date(d["date"])))
      .y((d: any) => this.y(d["temperature"]));

    // draw and update line
    this.geometry.chartContent
      .selectAll("path")
      .data([this.data])
      .join(
        (enter: any) => {
          enter
            .append("path")
            .attr("d", lineGenerator(this.data as any))
            .attr("fill", "none")
            .attr("stroke", "#8fd1db")
            .attr("stroke-width", 2)
            .attr("clip-path", "url(#clip-path-id)");
        },
        (update: any) => {
          update.attr("d", lineGenerator(this.data as any));
        },
        (exit: any) => exit.remove()
      );

    // draw and update dots in line
    this.geometry.chartContent
      .selectAll("circle")
      .data(this.data)
      .join(
        (enter: any) => {
          enter
            .append("circle")
            .attr("cx", (d: any) => this.x(new Date(d.date)))
            .attr("cy", (d: any) => this.y(d["temperature"]))
            .attr("r", 3)
            .attr("fill", "#0d7490")
            .attr("fill-opacity", 0.8)
            .attr("clip-path", "url(#clip-path-id)");
        },
        (update: any) => {
          update
            .attr("cx", (d: any) => this.x(new Date(d.date)))
            .attr("cy", (d: any) => this.y(d["temperature"]))
        }
      );
  }

  /**
   *
   */
  geometrySecondChart() {
    const complete = this.chartBrushSelection!.append("svg")
      .attr("width", this.sizes.w)
      .attr("height", 5)
      .attr("viewBox", [0, 0, this.sizes.w, 5])
      .attr(
        "style",
        "max-width: 100%; height: auto; height: intrinsic; overflow: visible"
      )
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .on("touchstart", (event: any) => event.preventDefault());

    const completeAxes = complete.append("g").attr("class", "axes");
  }


  /**
   *
   */
  brush() {}

  /**
   *
   */
  zoom() {}

  /**
   *
   */
  draw() {
    this.createCanvas();
    this.extents();
    this.scales();
    this.calculateAxesAndGrids();
    this.styleAxesAndGrids();
    this.drawGeometry();
    this.geometrySecondChart();
  }

  /**
   *
   */
  update(data: any) {
    this.extents();
    this.updateScales();
    this.updateAxesAndGrids();
    this.drawGeometry();
  }

  /**
   *
   */
  destroy() {}
}
