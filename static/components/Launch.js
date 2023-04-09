const bodyContainer = d3.select('body');
const visContainer = d3.select('#visContainer');

const tooltip = d3.select('#tooltip');
const tooltipContent = d3.select('#tooltipContent');

const legendBtn = d3.select('#btn-legend')

let showLegend = false;

let currentSeasonId = 0;

const allData = {};

const menuList = d3.select('#menu-list');
const btnNext = d3.select('#btn-next');
const btnPre = d3.select('#btn-pre');
// const selectYear = d3.select("#select_year");

const select_year = document.querySelector('#select-year');



let currentYear = 2021

Promise.all([presentData_row, pastData_row])
    .then(([presentData, pastData]) => {


        allData.past = pastData;
        presentDataNow = presentData.filter( d => d.year===currentYear);
        allData.present = presentDataNow.sort((a, b) => a.region_order - b.region_order);


        // presentDataNow = presentData.filter( d => d.year===currentYear);
        // allData.present = presentDataNow.sort((a, b) => a.regionId - b.regionId);
        // allData.future = futureData;

        // console.log(allData,sources)
        const seasonSize = seasonsData.length;
        btnNext.on('click', function() {
            if(btnNext.classed('disabled'))return;
            currentSeasonId++;
            updateSeason();
            console.log(currentSeasonId);
            if(currentSeasonId >= (seasonSize - 1))btnNext.classed('disabled',true);
            if(currentSeasonId > 0)btnPre.classed('disabled',false)
        })
        btnPre.on('click', function() {
            if(btnPre.classed('disabled'))return;
            currentSeasonId--;
            updateSeason();
            if(currentSeasonId < (seasonSize - 1))btnNext.classed('disabled',false);
            if(currentSeasonId ==0)btnPre.classed('disabled',true)
        })

        function updateSeason(){

            const seasonInfo = seasonsData[currentSeasonId];
            menuList.select('.title').html(seasonInfo.id)
            menuList.select('.menu-subtitle').html(seasonInfo.title)
            menuList.select('.menu-treecontent').selectAll('.treecontent-item')
                .data(seasonInfo.treefilter).join('div').attr('class', 'treecontent-item mb-1 fw-light')
                .html((d,i) => {
                    let icon = `branch`;
                    if(i == 1)icon = `leaf_${seasonInfo.id}`;
                    if(i == 2)icon = `core`;
                    return `
                    <div class="d-flex"><img class="legend me-1" src="./static/imgs/${icon}.png">${indexName(d)}</div>
                    `
                })
            menuList.select('.menu-rootcontent').selectAll('.rootcontent-item')
                .data(seasonInfo.rootkey).join('div').attr('class', 'rootcontent-item mb-1 fw-light')
                .html(d => `
                    <div class="d-flex"><img class="legend me-1" src="./static/imgs/root.png">${indexName(d)}</div>
                    `)

            chartVis.resize();

            if(showLegend)legendBtn.dispatch('click')
        }


        let chartVis = chart(visContainer, allData)
        chartVis.legend(showLegend)
        updateSeason()



        select_year.addEventListener('change', function() {
            currentYear = +this.value;
            presentDataNow = presentData.filter( d => d.year===currentYear);
            allData.present = presentDataNow.sort((a, b) => a.region_order - b.region_order);
            chartVis = chart(visContainer, allData);
            chartVis.legend(showLegend);

        });


        legendBtn.on('click', function() {
            showLegend = !showLegend;
            chartVis.legend(showLegend);

            legendBtn.select('i').classed('icon-question', !showLegend)
            legendBtn.select('i').classed('icon-close', showLegend)

            d3.selectAll('.hoverable').classed('hovering',!showLegend)
        });

        menuList.style('left','1.5em')
        menuList.classed('open',true)


    })