import * as d3 from "d3";
import { brushX, line, style, tree } from "d3";
import DistilledDataService from "../../Services/DataService/DistilledDataService.service";
import fakeData from "../../Services/DataService/fakeData";

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
      // https://bl.ocks.org/mbostock/34f08d5e11952a80609169b7917d4172
      //
      const data = fakeData;

      //
      const margin = { top: 20, right: 20, bottom: 40, left: 40 };
      const w = this.sizes?.w!;
      const h = this.sizes?.w!;

      //
      const dateExtent = d3
        .extent(data, (d) => d.date)
        .map((d) => new Date(d!));
      const valueExtent = d3.extent(data, (d) => d["temperature"]) as number[];

      //
      const x = d3
        .scaleTime()
        .domain(dateExtent)
        .range([margin.left, w! - margin.right]);
      const x2 = x.copy();
      const y = d3
        .scaleLinear()
        .domain([valueExtent[1] + 5, 0])
        .range([margin.top, h! - margin.bottom])
        .nice();
      const ax = d3.axisBottom(x).ticks(10);
      const ay = d3.axisLeft(y).ticks(10);
      const gx = d3
        .axisBottom(x)
        .tickSizeInner(h! - margin.bottom - margin.top)
        .tickFormat("" as any)
        .ticks(10);
      const gy = d3
        .axisLeft(y)
        .tickSizeInner(w! - margin.left - margin.right)
        .tickFormat("" as any)
        .ticks(10);

      //
      const chart = this.chartBodySelection!.append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("viewBox", [0, 0, w, h])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .on("touchstart", (event) => event.preventDefault());

      const chartAxes = chart.append("g").attr("class", "axes");
      const gx_ = chartAxes
        .append("g")
        .attr("class", "gx")
        .call(gx)
        .call((g) =>
          g
            .style("transform", `translate(0px, ${margin.top}px)`)
            .style("color", "#ddd")
        )
        .call((g) => g.select(".domain").style("visibility", "hidden"));
      const gy_ = chartAxes
        .append("g")
        .attr("class", "gy")
        .call(gy)
        .call((g) =>
          g
            .style("transform", `translate(${w - margin.right}px, 0px)`)
            .style("color", "#ddd")
        )
        .call((g) => g.select(".domain").style("visibility", "hidden"));
      const ax_ = chartAxes
        .append("g")
        .attr("class", "ax")
        .call(ax)
        .call((g) =>
          g
            .style("transform", `translate(0px, ${h - margin.bottom}px)`)
            .style("color", "#555")
        );
      const ay_ = chartAxes
        .append("g")
        .attr("class", "ay")
        .call(ay)
        .call((g) =>
          g
            .style("transform", `translate(${margin.left}px, 0px)`)
            .style("color", "#555")
        );

      //
      const chartContent = chart.append("g").attr("class", "content");

      //
      const clipPath = chart.append("clipPath").attr("id", "clip-path-id");

      clipPath
        .append("rect")
        .attr("x", margin.left)
        .attr("y", margin.top)
        .attr("width", w - margin.left - margin.right)
        .attr("height", h - margin.top - margin.bottom);

      //
      const lineGenerator = d3
        .line()
        .curve(d3.curveCardinal.tension(0.5))
        .x((d: any) => x(new Date(d["date"])))
        .y((d: any) => y(d["temperature"]));

      const path = chartContent
        .append("path")
        .attr("d", lineGenerator(data as any))
        .attr("fill", "none")
        .attr("stroke", "#8fd1db")
        .attr("stroke-width", 2)
        .attr("clip-path", "url(#clip-path-id)");

      const circles = chartContent
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => x(new Date(d.date)))
        .attr("cy", (d) => y(d["temperature"]))
        .attr("r", 3)
        .attr("fill", "#0d7490")
        .attr("fill-opacity", 0.8)
        .attr("clip-path", "url(#clip-path-id)");

      //
      const complete = this.chartBrushSelection!.append("svg")
        .attr("width", w)
        .attr("height", 5)
        .attr("viewBox", [0, 0, w, 5])
        .attr(
          "style",
          "max-width: 100%; height: auto; height: intrinsic; overflow: visible"
        )
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .on("touchstart", (event: any) => event.preventDefault());

      const completeAxes = complete
        .append("g")
        .attr("class", "axes")

      //
      const updateZoomAndBrush = () => {
        path.attr("d", lineGenerator(data as any));
        circles
          .attr("cx", (d) => x(new Date(d.date)))
          .attr("cy", (d) => y(d["temperature"]));
        ax_.call(ax);
        gx_.call(gx);
      };

      //
      const brush = d3
        .brushX()
        .extent([
          [margin.left, 0],
          [w - margin.right, 10],
        ])
        .on("brush end", (ev) => {
          if (ev.sourceEvent == undefined) return;
          const s = ev.selection;
          x.domain(s.map(x2.invert, x2));
          updateZoomAndBrush();
          chart.call(
            zoom.transform as any,
            d3.zoomIdentity.scale(w / (s[1] - s[0])).translate(-s[0], 0)
          );
        });

      //
      const zoom = d3
        .zoom()
        .scaleExtent([1, Infinity])
        .translateExtent([
          [0, 0],
          [w, h],
        ])
        .extent([
          [0, 0],
          [w, h],
        ])
        .on("zoom", (ev) => {
          if (ev.sourceEvent == undefined) return;
          var t = ev.transform;
          x.domain(t.rescaleX(x2).domain());
          updateZoomAndBrush();
          complete.call(brush.move as any, x.range().map(t.invertX, t));
        });

      //
      const defaultBrush = [x(new Date(data[50].date)), x(dateExtent[1])];

      //
      chart.call(zoom as any);
      completeAxes.call(brush as any)
      .call(g => {
        g.select(".overlay").style("fill", "#eee")
      });
      completeAxes.call(brush.move as any, x.range());
    }
    updateChart(distilledData: DistilledDataService) {
      console.log(distilledData);
    }
    destroyChart() {}
  }
}

export default edvl.ChartFactory;
