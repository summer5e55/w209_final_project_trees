function distance(a, b) {
    return Math.pow(Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2), 0.5);
    // return Math.pow(Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2), 0.45);
}
// const textColor = "#fff";
const textColor = "#333";
// const colors = ['#6f9db1', '#FFF143', '#ffc107', '#F00056'];
// const colors = ['#ffc107', '#F00056',"#a1317f"];  //d970a5
const colors = ["#e42a66","#ffc107","#7ea25d"] //#eeaf61//#7a98d6
// const colors = ['#ffc107',"#F26A44","#EC1B4B"];
// const colors_leaf = ['#56a6bb','#85B1B1','#95a95e']; //, '#85B1B1' #56a6bb,'#95a95e' #9bb34c
const colors_leaf = ['#ffc107','#7ea25d'];
const color = chroma
    .scale(colors)
    .nodata('#000')
const color_leaf = chroma
    .scale(colors_leaf)
    .nodata('#000')
const regionorder = [
    "America North",
    // "America Latin and Caribbean",
    "Central America",
    "Caribbean",
    "South America",
    "Europe South",
    "Europe West",
    "Europe North",
    "Europe East",
    "Western Africa",
    "Africa North",
    // "Africa Sub-Sahara",
    "Middle Africa",
    "Southern Africa",
    "Eastern Africa",
    "Asia West",
    "Asia Central",
    "Asia South",
    "Asia East",
    "Asia South-East",
    "Australia and New Zealand",
    "Micronesia",
    "Melanesia",
    "Polynesia",
]

// const regionorder = [
//     "America North",
//     "America Latin and Caribbean",


//     "Africa North",
//     "Africa Sub-Sahara",

//     "Europe South",
//     "Europe West",
//     "Europe North",
//     "Europe East",

//     "Asia West",
//     "Asia Central",
//     "Asia South",

//     "Asia East",
//     "Asia South-East",


//     // "Micronesia",
//     // "Melanesia",
//     "Polynesia",
//     "Australia and New Zealand",
// ]