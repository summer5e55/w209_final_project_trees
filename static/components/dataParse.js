let w, h, isLandscape, isMobile, isSmallScreen, isMiddleScreen;

getSizes();

function getSizes() {
    w = window.innerWidth;
    h = window.innerHeight;

    isLandscape = w > h;
    isMobile = (navigator.maxTouchPoints || 'ontouchstart' in document.documentElement);
    isSmallScreen = document.body.clientWidth < 768;
    isMiddleScreen = document.body.clientWidth >= 768 && document.body.clientWidth <= 1024;

}


const seasonsData = [
    {
      id: "spring",
      rootkey: ["freedom"],
      treefilter: ["life_expectancy", "freedom", "happiness",'year'],
      treelegend: ["leaf-EST", "branch-8"],
      title: "health"
    },
    {
      id: "summer",
      rootkey: ["donate"],
      treefilter: ["generosity", "gdp", "happiness",'year'],
      treelegend: ["leaf-DEU", "branch-7"],
      title: "wealth"
    },
    {
      id: "fall",
      rootkey: ["social_support"],
      treefilter: ["social_support", "smile", "happiness",'year'],
      treelegend: ["leaf-FIN", "branch-8"],
      title: "love"
    },
    {
      id: "winter",
      rootkey: ["corruption"],
      treefilter: ["corruption", "worry", "happiness",'year'],
      treelegend: ["leaf-MLI", "branch-10"],
      title: "adversary"
    }
  ];

const menuData = [
    // { title: "Future", content: "", class: "top" },
    { title: "Present", content: "", class: "middle" },
    { title: "Past", content: "", class: "bottom" },
]

const indexName = d3.scaleOrdinal()
  .domain([
    "happiness",
    "freedom",
    "gdp",
    "generosity",
    "corruption",
    "life_expectancy",
    "social_support",
    "smile",
    "worry",
    "donate"
  ])
  .range([
    "Happiness Score",
    "Freedom Score",
    "Log GDP per Capita",
    "Generosity Score",
    "Corruption Score",
    "Life Expectancy",
    "Social Support",
    "Have you smiled today?",
    "Have you felt worried today?",
    "Percentage of people donated money to charity"
  ])
//Economic Growth: GDP growth (annual %)

const indexUnit = d3
  .scaleOrdinal()
  .domain([
    "happiness",
    "freedom",
    "gdp",
    "generosity",
    "corruption",
    "life_expectancy",
    "social_support",
    "smile",
    "worry"
  ])
  .range([null, null, null, '%', null,null, null, null, null])


const yDomain = d3
  .scaleOrdinal()
  .domain([
    "happiness",
    "freedom",
    "gdp",
    "generosity",
    "corruption",
    "life_expectancy",
    "social_support",
    "smile",
    "worry"
  ])
  .range([true, true, false, false, true, true, true, true, true])

const getLeaficon = (color) => {
    const fill = color || '#56a6bb';
    const icon = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='${fill}'><path d='M70.17,93C76.18,57.41,56.71,22.41,23.29,8.76c-6.01,35.59,13.46,70.59,46.88,84.25'/></svg>`
    return `data:image/svg+xml,${encodeURIComponent(icon)}`
}
const getCoreicon = (color) => {
    const fill = color || '#f00056';
    const icon = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='${fill}'><path d='M32.7,49.01c-.55,8.77,6.12,16.33,14.89,16.87,8.76,.55,16.31-6.11,16.87-14.87,.55-8.77-6.12-16.33-14.89-16.87-8.76-.55-16.31,6.11-16.87,14.87'/></svg>`
    return `data:image/svg+xml,${encodeURIComponent(icon)}`
}

const getSnowicon = (color) => {
    const fill = color || '#dbe6f7';
    const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="${fill}" stroke="#f4f7fc" stroke-width="0.5" ><path d="M15.74,47.34c-1.18,18.97,13.24,35.31,32.21,36.49,18.95,1.18,35.28-13.21,36.49-32.16,1.18-18.97-13.24-35.31-32.21-36.49-18.95-1.18-35.28,13.21-36.49,32.16"/></svg>`
    return `data:image/svg+xml,${encodeURIComponent(icon)}`
}
const sources = {}; //type-key:year,performance,source,link

const presentData_row = d3.csv('./static/data/df_present.csv', parsePresent);
// const futureData_row = d3.csv('./static/data/structure - future-final.csv', parseFuture);
const pastData_row = d3.csv('./static/data/df_past.csv', parsePast);
// const sourceData_row = d3.csv('./static/data/structure - data-sources.csv', parseSource);

// function parseSource(d) {
//     // years for past only displayed 2010-2020;

//     if (!sources[d['type']]) sources[d['type']] = {};
//     if (!sources[d['type']][d['key']]) sources[d['type']][d['key']] = {};
//     sources[d['type']][d['key']] = d;
//     return d;
// }

function parsePast(d) {
    let t = {};

    t.year = +d["year"];
    t.happiness = +(+d["happiness"] * 10).toFixed(1);
    t.social_support = +(+d["social_support"] * 100).toFixed(1);
    t.corruption = +(+d["corruption"] * 100).toFixed(1);
    t.freedom = +(+d["freedom"] * 100).toFixed(1);
    t.donate = +(+d["donate"] * 100).toFixed(1);
    
    return t;
}


function parsePresent(d) {

    let t = {}

    t.country = d["geo"];
    t.name = d["country_code"];
    t.region = d["region"];
    t.regionId = d["region"];
    t.happiness = +(+d["happiness"] * 10).toFixed(1);
    t.freedom = +(+d["freedom"] * 100).toFixed(1);
    t.gdp = +(+d["gdp"]).toFixed(1);
    t.generosity = +(+d["generosity"] * 100).toFixed(1);
    t.corruption =  +(+d["corruption"] * 100).toFixed(1);
    t.life_expectancy = +(+d["life_expectancy"]).toFixed(1);
    t.social_support = +(+d["social_support"] * 100).toFixed(1);
    t.smile = +(+d["smile"] * 100).toFixed(1);
    t.worry = +(+d["worry"] * 100).toFixed(1);
    t.year = +d['year'];
    t.region_order = +d['region_order'];
    return t;

}