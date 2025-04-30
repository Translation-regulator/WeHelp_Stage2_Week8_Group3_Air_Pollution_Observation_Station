import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as topojson from "https://cdn.jsdelivr.net/npm/topojson@3/+esm";
import { getCountyAndStation } from "../function/getCountyAndStation.js";
import { getAirData } from "../function/getAirData.js";

function taiwanMap() {
  const model = {
    hoverCountry: "",
    clickCountry: {},
    d3: { svg: {}, topoData: {}, geoData: {}, projection: {} },
    statusColor: {
      良好: "var(--color-primary-400)",
      普通: "var(--color-primary-600)",
      對敏感族群不健康: "var(--color-yellow-400)",
      對所有族群不健康: "var(--color-yellow-600)",
      不健康: "var(--color-red-400)",
      危險: "var(--color-red-800)",
      偵測中: "var(--color-zinc-600)",
      undefined: "var(--color-zinc-600)",
    },
    getStatusStyle: async (countyName) => {
      const site = await getCountyAndStation({ county: `${countyName}` });
      const data = await getAirData({
        county: `${countyName}`,
        sitename: `${site}`,
      });
      let style = "";
      switch (data.status) {
        case "良好":
          style = "var(--color-primary-400)";
          break;
        case "普通":
          style = "var(--color-primary-600)";
          break;
        case "對敏感族群不健康":
          style = "var(--color-yellow-400)";
          break;
        case "對所有族群不健康":
          style = "var(--color-yellow-600)";
          break;
        case "不健康":
          style = "var(--color-red-400)";
          break;
        case "危險":
          style = "var(--color-red-800)";
          break;
      }
      return style;
    },
  };
  const view = {
    createDiv: (dom) => {
      const div = document.createElement("div");
      return dom.appendChild(div);
    },
    createTaiwan: async (dom, status) => {
      const width = 600;
      const height = 800;
      model.d3.svg = d3
        .create("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("width", "100%")
        .attr("height", "100%");

      model.d3.topoData = await d3.json("/static/map/county.topojson");

      model.d3.geoData = topojson.feature(
        model.d3.topoData,
        model.d3.topoData.objects.county
      );
      model.d3.projection = d3
        .geoMercator()
        .center([121, 24]) // 台灣中心的經緯度
        .scale(8000)
        .translate([width / 1.5, height / 2]);

      // .geoPath()將地理資料轉換成SVG使用的d屬性字串
      const path = d3.geoPath().projection(model.d3.projection);

      model.d3.svg
        .selectAll("path")
        .data(model.d3.geoData.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("data-county", (d) => d.properties.COUNTYNAME)
        .style("fill", "var(--color-zinc-400)")
        .style("stroke", "white")
        .style("stroke-width", 1)
        .on("mouseover", function (event) {
          const countyName = this.dataset.county;
          model.hoverCountry = countyName;
          d3.select(this).style("fill", "var(--color-zinc-500)");
          //   d3.select(this).style("fill", status);
        })
        .on("mouseout", function () {
          d3.select(this).style("fill", "var(--color-zinc-400)");
          model.hoverCountry = "";
        })
        .on("click", function () {
          const countyName = this.dataset.county;
          // d3.select(this).style("fill", "var(--color-zinc-600)");
          // model.clickCountry = countyName;
          model.clickCountry = d3.select(this);
        });

      requestAnimationFrame(() => {
        view.createBorder("連江");
        view.createBorder("澎湖");
      });

      dom.appendChild(model.d3.svg.node());
    },
    createBorder: (nodeName) => {
      const correctedName = model.d3.geoData.features.find((d) =>
        d.properties.COUNTYNAME.includes(nodeName)
      )?.properties.COUNTYNAME;
      const targetPath = model.d3.svg.select(
        `path[data-county="${correctedName}"]`
      );
      if (targetPath.node()) {
        const bbox = targetPath.node().getBBox();

        // 建立群組 g
        const group = model.d3.svg.append("g").attr("class", "highlight-group");

        // 把 rect 加到 g 裡
        group
          .append("rect")
          .attr("x", bbox.x - 5)
          .attr("y", bbox.y - 5)
          .attr("width", bbox.width + 10)
          .attr("height", bbox.height + 10)
          .attr("data-county", `${nodeName}縣`)
          .style("stroke", "var(--color-zinc-400)")
          .attr("stroke-width", 1)
          .style("fill", "transparent")
          .on("mouseover", function (event) {
            const countyName = this.dataset.county;
            model.hoverCountry = `${nodeName}縣`;
            d3.select(this).style("fill", "var(--color-zinc-500)");
            //   d3.select(this).style("fill", status);
          })
          .on("mouseout", function () {
            d3.select(this).style("fill", "transparent");
            model.hoverCountry = "";
          })
          .on("click", function () {
            // d3.select(this).style("fill", "var(--color-zinc-600)");
            // model.clickCountry = `${nodeName}縣`;
            model.clickCountry = d3.select(this);
          });

        // 複製原本的 path 並加進這個 group
        const cloned = targetPath.node().cloneNode();
        group.node().appendChild(cloned);
      }
    },
    createHint: (dom) => {
      const ul = document.createElement("ul");
      const data = [
        ["偵測中", model.statusColor["偵測中"]],
        ["危險", model.statusColor["危險"]],
        ["不健康", model.statusColor["不健康"]],
        ["對所有族群不健康", model.statusColor["對所有族群不健康"]],
        ["對敏感族群不健康", model.statusColor["對敏感族群不健康"]],
        ["普通", model.statusColor["普通"]],
        ["良好", model.statusColor["良好"]],
      ];
      data.forEach((el) => {
        let li = document.createElement("li");
        let text = document.createTextNode(el[0]);
        li.appendChild(text);
        li.style.borderLeft = `6px solid ${el[1]}`;
        li.style.paddingLeft = "10px";
        ul.appendChild(li);
      });
      dom.appendChild(ul);
    },
    createStation: (stationData, status) => {
      // console.log(obj);
      const [x, y] = model.d3.projection([
        stationData.twd97lon,
        stationData.twd97lat,
      ]);
      model.d3.svg
        .append("circle")
        .attr("class", "taiwan-map-station")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 8)
        .attr("data-stationCounty", stationData.county)
        .attr("data-stationSitename", stationData.sitename)
        .attr("fill", model.statusColor[status])
        .on("click", function () {
          const county = this.dataset.stationCounty;
          const siteName = this.dataset.stationSitename;
          console.log(county, siteName);
        });
    },
  };
  const controller = {
    init: async () => {
      const main = document.querySelector("main");
      const container = view.createDiv(main);
      container.classList.add("taiwan-map-container");
      const taiwanContainer = view.createDiv(container);
      taiwanContainer.classList.add("taiwan-map-taiwan");
      const hint = view.createDiv(container);
      hint.classList.add("taiwan-map-hint");
      view.createHint(hint);
      view.createTaiwan(taiwanContainer);

      taiwanContainer.addEventListener("mouseover", (e) => {
        // console.log(model.hoverCountry);
      });

      taiwanContainer.addEventListener("click", async (e) => {
        e.stopPropagation();
        // console.log(e.target);
        if (e.target.dataset.county) {
          // console.log(e.target.dataset.county);
          model.d3.svg.selectAll("*").classed("taiwan-map-select", false);
          model.clickCountry.attr("class", "taiwan-map-select");
          model.d3.svg.selectAll("circle.taiwan-map-station").remove();
          let stationData = await getCountyAndStation({
            county: e.target.dataset.county,
          });
          stationData.forEach(async (el) => {
            console.log(el);
            const siteData = await getAirData({ sitename: el.sitename });
            view.createStation(el, siteData.status);
          });
          // console.log(stationData);
          // d3.select(e.target).attr("fill", "var(--color-zinc-600)");
        }
      });
    },
  };

  return controller;
}

export default taiwanMap();
