const bodyContainer = d3.select('body');
const visContainer = d3.select('#visContainer');

const tooltip = d3.select('#tooltip');
const tooltipContent = d3.select('#tooltipContent');

const legendBtn = d3.select('#btn-legend')

let showLegend = false;
let sortBranch = false;

let currentSeasonId = 0;

const allData = {};

const menuList = d3.select('#menu-list');
const btnNext = d3.select('#btn-next');
const btnPre = d3.select('#btn-pre');
// const selectYear = d3.select("#select_year");
const btnSort = d3.select('#btn-sort');
const btnSearch = d3.select('#btn-search');

// const select_year = document.querySelector('#select-year');
let currentYear = 2021

const years = Array.from({length:12}, (_, i)=> 2010 + i);
const yearScrubber = Scrubber(years, {
    format: value => `${value}`,
    initial: currentYear - years[0],
    delay: 500,
    loop: false
});
yearScrubber.id = 'year-scrubber';
document.querySelector("#scrubber-container").append(yearScrubber);

Promise.all([presentData_row, pastData_row])
    .then(([presentData, pastData]) => {


        allData.past = pastData;
        presentDataNow = presentData.filter( d => d.year===currentYear);
        allData.present = presentDataNow.sort((a, b) => a.region_order - b.region_order);


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
                .data(seasonInfo.treefilter.slice(0,3)).join('div').attr('class', 'treecontent-item mb-1 fw-light')
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


        let chartVis = chart(visContainer, allData, sortBranch, true)
        chartVis.legend(showLegend)
        updateSeason()


        // select_year.addEventListener('change', function() {
        //     currentYear = +this.value;
        //     // urlSearchParams.set('year', currentYear);
        //     // window.location.search=urlSearchParams.toString();
        //     presentDataNow = presentData.filter( d => d.year===currentYear);
        //     allData.present = presentDataNow.sort((a, b) => a.region_order - b.region_order);
        //     chartVis = chart(visContainer, allData, sortBranch, false);
        //     // chartVis.resize();
        //     chartVis.legend(showLegend);
        // });


        btnSort.on('click', function () {
            sortBranch = !sortBranch
            chartVis = chart(visContainer, allData, sortBranch, false);
            chartVis.legend(showLegend);
        });

        const searchInput = document.querySelector("#search-input");

        let searchMode = true;
        searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            btnSearch.dispatch('click');
        }
        });

        btnSearch.on("click", () => {
        // Reset the selected and faded classes
        visContainer.selectAll(".selected").classed("selected", false);
        visContainer.selectAll(".faded").classed("faded", false);
        
        if (searchMode) {
            const searchValue = document.getElementById("search-input").value.trim();
        
            if (searchValue) {
            highlightNodeById(visContainer, searchValue);
            }
        
            btnSearch.text('Clear');
        } else {
            // Clear the search input
            document.getElementById("search-input").value = '';
            btnSearch.text('Search');
        }
        
        // Toggle search mode
        searchMode = !searchMode;
        });
        
        yearScrubber.addEventListener("input", function() {
            currentYear = +yearScrubber.value;
            presentDataNow = presentData.filter(d => d.year === currentYear);
            allData.present = presentDataNow.sort((a,b) => a.region_order - b.region_order);
            chartVis = chart(visContainer, allData, sortBranch, false);
            chartVis.legend(showLegend);
            const search_val = document.getElementById('search-input').value
            if (search_val != ''){
                highlightNodeById(visContainer, search_val)
            }
        })


        legendBtn.on('click', function() {
            showLegend = !showLegend;
            chartVis.legend(showLegend);
            legendBtn.select('i').classed('icon-question', !showLegend);
            legendBtn.select('i').classed('icon-close', showLegend);
            d3.selectAll('.hoverable').classed('hovering', !showLegend);        

        });

        menuList.style('left','1.5em')
        menuList.classed('open',true)    
    })
