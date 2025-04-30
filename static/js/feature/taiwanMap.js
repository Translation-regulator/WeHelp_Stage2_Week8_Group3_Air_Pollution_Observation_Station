import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as topojson from "https://cdn.jsdelivr.net/npm/topojson@3/+esm";

function taiwanMap() {
  const model = {
    statusColor: {
      良好: "var(--color-primary-400)",
      普通: "var(--color-primary-600)",
      對敏感族群不健康: "var(--color-yellow-400)",
      對所有族群不健康: "var(--color-yellow-600)",
      不健康: "var(--color-red-400)",
      危險: "var(--color-red-800)",
      偵測中: "var(--color-zinc-600)",
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
      const svg = d3
        .create("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("width", "100%")
        .attr("height", "100%");

      const topoData = await d3.json("/static/map/county.topojson");

      const geoData = topojson.feature(topoData, topoData.objects.county);
      const projection = d3
        .geoMercator()
        // .fitSize([width, height], geoData)
        .center([121, 24]) // 台灣中心的經緯度
        .scale(8000)
        .translate([width / 1.5, height / 2]);
      // const currentScale = projection.scale();
      // projection.scale(currentScale * 1.5);
      // const currentCenter = projection.center();
      // projection.center([currentCenter[0] - 0.5, currentCenter[1]]);

      // .geoPath()將地理資料轉換成SVG使用的d屬性字串
      const path = d3.geoPath().projection(projection);

      svg
        .selectAll("path")
        .data(geoData.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("data-county", (d) => d.properties.COUNTYNAME)
        .style("fill", "var(--color-zinc-400)")
        .style("stroke", "white")
        .style("stroke-width", 1)
        .on("mouseover", function (event) {
          const countyName = this.dataset.county;
          console.log(countyName);
          d3.select(this).style("fill", "var(--color-zinc-500)");
          //   d3.select(this).style("fill", status);
        })
        .on("mouseout", function () {
          d3.select(this).style("fill", "var(--color-zinc-400)");
        });

      requestAnimationFrame(() => {
        view.createBorder(svg, geoData, "連江");
      });

      dom.appendChild(svg.node());
    },
    createBorder: (svg, geoData, nodeName) => {
      const correctedName = geoData.features.find((d) =>
        d.properties.COUNTYNAME.includes(nodeName)
      )?.properties.COUNTYNAME;
      const targetPath = svg.select(`path[data-county="${correctedName}"]`);
      if (targetPath.node()) {
        const bbox = targetPath.node().getBBox();

        // 建立群組 g
        const group = svg.append("g").attr("class", "highlight-group");

        // 把 rect 加到 g 裡
        group
          .append("rect")
          .attr("x", bbox.x - 5)
          .attr("y", bbox.y - 5)
          .attr("width", bbox.width + 10)
          .attr("height", bbox.height + 10)
          .style("stroke", "var(--color-zinc-400)")
          .attr("stroke-width", 1)
          .attr("fill", "none");

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
  };
  const controller = {
    init: () => {
      console.log(1);
      const main = document.querySelector("main");
      const container = view.createDiv(main);
      container.classList.add("taiwan-map-container");
      const taiwanContainer = view.createDiv(container);
      taiwanContainer.classList.add("taiwan-map-taiwan");
      const hint = view.createDiv(container);
      hint.classList.add("taiwan-map-hint");
      view.createHint(hint);
      view.createTaiwan(taiwanContainer);
    },
  };

  return controller;
}

export default taiwanMap();
