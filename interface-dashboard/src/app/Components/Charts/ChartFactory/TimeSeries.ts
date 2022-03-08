import * as d3 from "d3";
import { differenceWith } from "lodash";

interface D3Chart {
  createCanvas: () => void;
  calculateExtents: () => void;
  scales: () => void;
  calculateAxesAndGrids: () => void;
  geometry: () => void;
  brushAndZoom: () => void;
  draw: () => void;
  update: (data: any, config: any) => void;
  destroy: () => void;
}
/**
 *
 */
export default class TimeSeries implements D3Chart {
  $chartBind: HTMLDivElement | null;
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

  //
  geometry: any = {
    chart: null,
    chartAxes: null,
    complete: null,
    path: null,
    lineGenerator: null,
    circles: null,
    chartContent: null,
  };

  // propios
  data!: any[];
  dateExtent: Date[] = [];
  valueExtent: number[] = [];

  // scales and grids
  x!: d3.ScaleTime<number, number, never>;
  x2!: d3.ScaleTime<number, number, never>;
  y!: d3.ScaleLinear<number, number, never>;
  ax!: d3.Axis<Date | d3.NumberValue>;
  ay!: d3.Axis<d3.NumberValue>;
  gx!: d3.Axis<Date | d3.NumberValue>;
  gy!: d3.Axis<d3.NumberValue>;

  //
  gx_: any;
  gy_: any;
  ax_: any;
  ay_: any;

  //
  brush: any;
  zoom: any;
  zoomedOrBrushed: boolean = false;
  bx!: d3.ScaleTime<number, number, never>;
  followScale!: d3.ScaleTime<number, number, never>;
  extents!: any[];
  globalExtent!: { value: any[]; date: any[] };
  configData: any[];

  /**
   *
   * @param _chartBind
   */
  constructor(_chartBind: HTMLDivElement | null) {
    this.$chartBind = _chartBind;
    this.chartBodySelection = d3.select(
      this.$chartBind?.querySelector(".chart_body") as d3.BaseType
    );
    this.chartBrushSelection = d3.select(
      this.$chartBind?.querySelector(".chart_brush") as d3.BaseType
    );
    const chartParentSelection =
      (this.chartBodySelection.node() as HTMLElement)!
        .parentNode as HTMLElement;
    this.sizes = {
      w: (chartParentSelection!
        .parentNode as HTMLElement)!.getBoundingClientRect().width,
      h: chartParentSelection!.getBoundingClientRect().height,
    };

    this.data = [];
    this.configData = [];
    this.draw();
  }

  /**
   *
   */
  createCanvas() {
    this.geometry.chart = this.chartBodySelection
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
  processData(newData: any, newconfigData: any) {
    if (!newData) {
      if (newconfigData.length > this.configData.length) {
        // case new
        const difference = differenceWith(
          newconfigData,
          this.configData,
          (n: any, o: any) => {
            return (
              o.device != undefined &&
              n.device.id == o.device.id &&
              n.name == o.name
            );
          }
        );
        this.data.push({
          id: difference[0].device.id,
          type: difference[0].device.type,
          value: difference[0].name,
          valueType: difference[0].type,
          color: difference[0].color,
          data: [],
        });
      } else if (newconfigData.length < this.configData.length) {
        // case away
        const difference = differenceWith(
          this.configData,
          newconfigData,
          (n: any, o: any) => {
            return (
              o.device != undefined &&
              n.device.id == o.device.id &&
              n.name == o.name
            );
          }
        );
        const differenceDataIdx =
          difference != undefined
            ? this.data.findIndex(
                (d) =>
                  d.id == difference[0].device.id &&
                  d.value == difference[0].name
              )
            : -1;
        this.data.splice(differenceDataIdx, 1);
      } else {
        // nothing
      }
      this.configData = [...newconfigData];
    } else {
      const dBuckets = this.data.filter((d) => d.id == newData.id);
      dBuckets.forEach((db) => {
        db.data.push([
          newData[db.value].value,
          newData.updated.value,
          db.color,
        ]);
      });
    }
  }

  /**
   *
   */
  calculateExtents() {
    this.globalExtent = {
      value: [],
      date: [],
    };
    const globalExtentDataValues = this.data
      .map((d) => d.data)
      .flat(1)
      .map((d) => d[0]);
    const globalExtentDataDates = this.data
      .map((d) => d.data)
      .flat(1)
      .map((d) => d[1]);
    this.globalExtent.value = d3.extent(globalExtentDataValues);
    this.globalExtent.date = d3.extent(globalExtentDataDates);
  }

  /**
   *
   */
  scales() {
    this.x = d3
      .scaleTime()
      .domain(this.globalExtent.date.map((a) => new Date(a)))
      .range([this.margin.l, this.sizes.w! - this.margin.r]);
    this.x2 = this.x.copy();
    this.bx = this.x.copy();
    this.y = d3
      .scaleLinear()
      .domain([this.globalExtent.value[1] + 5, 0])
      .range([this.margin.t, this.sizes.h! - this.margin.b])
      .nice();
    this.followScale = this.x;
  }

  /**
   *
   */
  updateScales() {
    this.x
      .domain(this.globalExtent.date.map((a) => new Date(a)))
      .range([this.margin.l, this.sizes.w! - this.margin.r]);
    this.x2
      .domain(this.globalExtent.date.map((a) => new Date(a)))
      .range([this.margin.l, this.sizes.w! - this.margin.r]);
    this.y
      .domain([this.globalExtent.value[1] + 5, 0])
      .range([this.margin.t, this.sizes.h! - this.margin.b]);
    this.bx.range([this.margin.l, this.sizes.w! - this.margin.r]);
  }

  /**
   *
   */
  calculateAxesAndGrids() {
    this.ax = d3.axisBottom(this.followScale).ticks(10);
    this.ay = d3.axisLeft(this.y).ticks(10);
    this.gx = d3
      .axisBottom(this.followScale)
      .tickSizeInner(this.sizes.h! - this.margin.b - this.margin.t)
      .tickFormat("" as any)
      .ticks(10);
    this.gy = d3
      .axisLeft(this.y)
      .tickSizeInner(this.sizes.w! - this.margin.l - this.margin.r)
      .tickFormat("" as any)
      .ticks(10);
  }

  styleAxesAndGrids() {
    this.geometry.chartAxes = this.geometry.chart
      .append("g")
      .attr("class", "axes");
    this.gx_ = this.geometry.chartAxes.append("g");
    this.gy_ = this.geometry.chartAxes.append("g");
    this.ax_ = this.geometry.chartAxes.append("g");
    this.ay_ = this.geometry.chartAxes.append("g");
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
    if (this.geometry.chart.select(".content").nodes().length == 0) {
      this.geometry.chartContent = this.geometry.chart
        .append("g")
        .attr("class", "content");
    }

    // draw and update clippath
    const clipPath = this.geometry.chart
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
      .x((d: any) => this.followScale(new Date(d[1])))
      .y((d: any) => this.y(d[0]));

    // draw and update line
    this.geometry.chartContent
      .selectAll("path")
      .data(this.data)
      .join(
        (enter: any) => {
          enter
            .append("path")
            .attr("d", (d: any) => lineGenerator(d.data))
            .attr("fill", "none")
            .attr("stroke", (d: any) => d.color)
            .attr("stroke-width", 2)
            .attr("clip-path", "url(#clip-path-id)");
        },
        (update: any) => {
          update.attr("d", (d: any) => lineGenerator(d.data));
        },
        (exit: any) => exit.remove()
      );

    // draw and update dots in line
    const chartContentGroups = this.geometry.chartContent
      .selectAll("g")
      .data(this.data)
      .join((enter: any) => {
        enter.append("g").attr("class", "circles").attr("clip-path", "url(#clip-path-id)");
      });
    chartContentGroups.selectAll("circle").data((d: any) => d.data).join(
      (enter: any) => {
        enter.append("circle")
        .attr("cx", (d: any) => this.followScale(new Date(d[1])))
        .attr("cy", (d: any) => this.y(d[0]))
        .attr("r", 3)
        .attr("fill", (d: any) => d[2])
        .attr("fill-opacity", 0.8)
      }, 
      (update: any) => {
        update
        .attr("cx", (d: any) => this.followScale(new Date(d[1])))
        .attr("cy", (d: any) => this.y(d[0]));
      }
    )
  }

  /**
   *
   */
  geometrySecondChart() {
    // draw chart canvas for first time
    if (this.chartBrushSelection.select("svg").nodes().length == 0) {
      this.geometry.complete = this.chartBrushSelection
        .append("svg")
        .attr("class", "chart_brush_inner")
        .attr("width", this.sizes.w)
        .attr("height", 5)
        .attr("viewBox", [0, 0, this.sizes.w, 5])
        .attr(
          "style",
          "max-width: 100%; height: auto; height: intrinsic; overflow: visible"
        )
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .on("touchstart", (event: any) => event.preventDefault())
        .append("g")
        .attr("class", "axes");
    }
  }

  /**
   *
   */
  brushAndZoom() {
    this.brush = d3
      .brushX()
      .extent([
        [this.margin.l, 0],
        [this.sizes.w - this.margin.r, 10],
      ])
      .on("brush end", (ev) => {
        if (ev.sourceEvent == undefined) return;
        const s = ev.selection;
        if (s) {
          this.zoomedOrBrushed = true;
          this.followScale = this.bx;
          this.followScale.domain(s.map(this.x2.invert, this.x2));
          this.geometry.chart.call(
            this.zoom.transform as any,
            d3.zoomIdentity
              .scale(this.sizes.w / (s[1] - s[0]))
              .translate(-s[0], 0)
          );
        } else {
          this.zoomedOrBrushed = false;
          this.followScale = this.x;
          this.geometry.complete.call(
            this.brush.move,
            this.followScale.range()
          );
        }
        this.updateZoomAndBrush();
      });

    this.zoom = d3
      .zoom()
      .scaleExtent([1, Infinity])
      .translateExtent([
        [0, 0],
        [this.sizes.w, this.sizes.h],
      ])
      .extent([
        [0, 0],
        [this.sizes.w, this.sizes.h],
      ])
      .on("zoom", (ev) => {
        if (ev.sourceEvent == undefined) return;
        const t = ev.transform;
        this.followScale.domain(t.rescaleX(this.x2).domain());
        this.updateZoomAndBrush();
        this.geometry.complete.call(
          this.brush.move as any,
          this.followScale.range().map(t.invertX, t)
        );
      });

    this.geometry.chart.call(this.zoom);
    this.geometry.complete.call(this.brush).call((g: any) => {
      g.select(".overlay").style("fill", "#eee");
    });
  }

  /**
   *
   */
  updateZoomAndBrush() {
    this.calculateAxesAndGrids();
    this.ax_.call(this.ax);
    this.ay_.call(this.ay);
    this.gx_.call(this.gy);
    this.gy_.call(this.gx);
    this.drawGeometry();
  }

  /**
   *
   */
  draw() {
    this.createCanvas();
    this.calculateExtents();
    this.scales();
    this.calculateAxesAndGrids();
    this.styleAxesAndGrids();
    this.drawGeometry();
    this.geometrySecondChart();
    this.brushAndZoom();
    this.geometry.complete.call(this.brush.move, this.followScale.range());
  }

  /**
   *
   */
  update(data: any, configData: any) {
    this.processData(data, configData);
    this.calculateExtents();
    this.calculateAxesAndGrids();
    this.updateScales();
    this.updateAxesAndGrids();
    this.drawGeometry();
    this.geometrySecondChart();
    if (!this.zoomedOrBrushed) {
      this.geometry.complete.call(this.brush.move, this.followScale.range());
    }
  }

  /**
   *
   */
  destroy() {
    this.geometry.chart.remove();
  }
}
