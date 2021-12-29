import * as d3 from "d3";
import { brushX, tree } from "d3";
import fakeData from "./../../../Services/DataService/fakeData";

module edvl {
  export class ChartFactory {
    /**
     *
     */
    private chartBind: HTMLDivElement | null | undefined;
    private chartSelection?: d3.Selection<
      d3.BaseType,
      unknown,
      null,
      undefined
    >;
    private marginAmount: number;
    private margin: {
      t: number;
      r: number;
      b: number;
      l: number;
    };
    private sizes?: {
      w: number;
      h: number;
    };
    chartBody: any;
    chartBrush: any;
    chartBodySelection!: d3.Selection<d3.BaseType, unknown, null, undefined>;
    chartBrushSelection!: d3.Selection<d3.BaseType, unknown, null, undefined>;

    /**
     *
     */
    private constructor() {
      this.marginAmount = 25;
      this.margin = {
        t: this.marginAmount / 2,
        r: this.marginAmount / 2,
        b: this.marginAmount,
        l: this.marginAmount,
      };
    }
    public static factory(): ChartFactory {
      return new ChartFactory();
    }

    /**
     *
     * @param _chartBind
     */
    setDomComponent(_chartBind: HTMLDivElement | null): void {
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
    }

    /**
     *
     */
    createChart() {
      const data = fakeData;

      // data extents
      const dateExtent = d3.extent(data, (d) => d.date) as string[];
      
      //@ts-ignore
      const dateQuantile = d3.quantile(data, 0.75, (d) => new Date(d.date));
      const valueExtent = d3.extent(data, (d) => d["temperature"]) as number[];

      // scaleX
      const scaleX = d3
        .scaleTime()
        .domain([new Date(dateExtent[0]), new Date(dateExtent[1])])
        .range([0 + this.margin.l, this.sizes!.w - this.margin.r])
        .nice();

      const fullScaleX = d3
        .scaleTime()
        .domain([new Date(dateExtent[0]), new Date(dateExtent[1])])
        .range([0 + this.margin.l, this.sizes!.w - this.margin.r]);

      // scaleY
      const scaleY = d3
        .scaleLinear()
        .domain([valueExtent[1] + 5, valueExtent[0] - 5])
        .range([0 + this.margin.t, this.sizes!.h - this.margin.b])
        .nice();

      // axisX
      // const axisX = d3.axisBottom(scaleX).ticks(10);

      // axisY
      const axisY = d3.axisLeft(scaleY).ticks(10);

      // gridX
      // const gridX = d3
      //   .axisBottom(scaleX)
      //   .ticks(10)
      //   .tickSizeInner(this.sizes!.h - this.margin.b - this.margin.t)
      //   //@ts-ignore
      //   .tickFormat("");

      // gridY
      const gridY = d3
        .axisLeft(scaleY)
        .ticks(10)
        .tickSizeInner(this.sizes!.w - this.margin.l - this.margin.r)
        //@ts-ignore
        .tickFormat("");

      // create cover
      const chartInner = this.chartBodySelection!.append("svg")
        .attr("width", this.sizes!.w)
        .attr("height", this.sizes!.h)
        .attr("viewBox", [0, 0, this.sizes!.w, this.sizes!.h])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .on("touchstart", (event) => event.preventDefault());

      const clipPath = chartInner.append("clipPath").attr("id", "clip-path-id");

      clipPath
        .append("rect")
        .attr("x", this.margin.l)
        .attr("y", this.margin.t)
        .attr("width", this.sizes!.w - this.margin.l - this.margin.r)
        .attr("height", this.sizes!.h - this.margin.t - this.margin.b);

      const gy = chartInner
        .append("g")
        .style("transform", `translate(${this.sizes!.w - this.margin.r}px, 0)`)
        .style("color", "#ddd")
        .call(gridY)
        .call((g) => g.select(".domain").remove());

      // const gx = chartInner
      //   .append("g")
      //   .style("transform", `translate(0, ${this.margin.t}px)`)
      //   .style("color", "#ddd")
      //   .call(gridX)
      //   .call((g) => g.select(".domain").remove());

      const gxfn_g = chartInner
        .append("g")
        .style("transform", `translate(0, ${this.margin.t}px)`)
        .style("color", "#ddd");

      const gxfn = (scaleX: any) =>
        gxfn_g.call(
          d3
            .axisBottom(scaleX)
            .ticks(10)
            .tickSizeInner(this.sizes!.h - this.margin.b - this.margin.t)
            //@ts-ignore
            .tickFormat("")
        );

      const gx = gxfn(scaleX);

      // const ax = chartInner
      //   .append("g")
      //   .style("transform", `translate(0, ${this.sizes!.h - margin.b}px)`)
      //   .style("color", "#555")
      //   .call(axisX);

      const axfn_g = chartInner
        .append("g")
        .style("transform", `translate(0, ${this.sizes!.h - this.margin.b}px)`)
        .style("color", "#555");

      const axfn = (scaleX: any) =>
        axfn_g.call(d3.axisBottom(scaleX).ticks(10));

      // const axisX = d3.axisBottom(scaleX).ticks(10);
      const ax = axfn(scaleX);

      const ay = chartInner
        .append("g")
        .style("transform", `translate(${this.margin.l}px, 0px)`)
        .style("color", "#555")
        .call(axisY);

      // create data line function based on scale
      const line = (data: any, scx: any, scy: any) =>
        d3
          .line()
          .curve(d3.curveCardinal.tension(0.5))
          .x((d: any) => scx(new Date(d["date"])))
          .y((d: any) => scy(d["temperature"]))(data);

      const path = chartInner
        .append("path")
        //@ts-ignore
        .attr("d", line(data, scaleX, scaleY))
        .attr("fill", "none")
        .attr("stroke", "#8fd1db")
        .attr("stroke-width", 2)
        .attr("clip-path", `url(${window.location}#${clipPath.node()!.id})`);

      // create data points
      const circles = chartInner
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => scaleX(new Date(d.date)))
        .attr("cy", (d) => scaleY(d["temperature"]))
        .attr("r", 3)
        .attr("fill", "#0d7490")
        .attr("fill-opacity", 0.8)
        .attr("clip-path", `url(${window.location}#${clipPath.node()!.id})`);

      const zoomable = (ev: any) => {
        const scaleX_ = ev.transform.rescaleX(scaleX);
        path.attr("d", line(data, scaleX_, scaleY));
        circles
          .attr("cx", (d) => scaleX_(new Date(d.date)))
          .attr("cy", (d) => scaleY(d["temperature"]));
        axfn(scaleX_);
        gxfn(scaleX_);
      };

      // addBrush, pan, zoom      
      const zoom = d3
        .zoom()
        .extent([
          [this.margin.l, 0],
          [this.sizes!.w - this.margin.r, this.sizes!.h],
        ])
        .translateExtent([
          [scaleX(new Date(dateExtent[0])) - this.margin.l, 0],
          [scaleX(new Date(dateExtent[1])) + this.margin.r, 0],
        ])
        .scaleExtent([1, 32])
        .on("zoom", zoomable);

      //@ts-ignore
      chartInner.call(zoom)

      const brush = d3
        .brushX()
        .extent([
          [0, 0],
          [this.sizes!.w - this.margin.l * 2 - this.margin.r * 1.5, 5],
        ])
        .on("brush", (ev) => {
          //https://bl.ocks.org/mbostock/34f08d5e11952a80609169b7917d4172
          if (ev.selection) {
            const k_x = fullScaleX.range()[1] / (ev.selection[1] - ev.selection[0])
            const t_x = -ev.selection[1]

            // console.log(k_x);
            


            // chartInner.call(
            //   zoom.transform as any,
            //   d3.zoomIdentity.scale(k_x).translate(t_x, 0)
            // );
          }
        })
        // .on("end", (ev) => {
        //   if (!ev.selection) {
        //     brushInner.call(brush.move, defaultBrush);
        //   }
        // });

      const bScaleX = d3
        .scaleTime()
        .domain([new Date(dateExtent[0]), new Date(dateExtent[1])])
        .range([0, this.sizes!.w - this.margin.l * 2 - this.margin.r * 1.5])

      const defaultBrush = [
        bScaleX(new Date(dateQuantile!)),
        bScaleX(new Date(dateExtent[1])),
      ];

      const brushOuter = this.chartBrushSelection
        .append("svg")
        .style(
          "width",
          `${this.sizes!.w - this.margin.l * 2 - this.margin.r * 1.5}px`
        )
        .style("overflow", "visible")
        .style("margin-left", `${this.margin.l}px`)
        .style("height", `${5}px`)
        .style("background-color", "#ddd");

      const brushInner = brushOuter
        .append("g")
        .call(brush)
        .call((g) => {
          g.select(".selection").style("fill", "#1e1e1e");
          g.selectAll(".handle").style("fill", "#555");
        })
        .call(brush.move, defaultBrush);
    }
    updateChart() {}
    destroyChart() {}
  }
}

export default edvl.ChartFactory;
