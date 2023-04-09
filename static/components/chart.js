function chart(_, data, year) {
    const dom = _;
    let _width = null;
    let _height = null;

    const page_w = 1200;

    const svg = dom.selectAll('.canvas').data([0])
        .join('svg').attr('class', 'canvas')


    const landscape = svg.selectAll('.landscape').data([0])
        .join('g').attr('class', 'landscape')

    // const sunlightViz = landscape.selectAll('.sunlight-viz').data([0])
    //     .join('g').attr('class', 'sunlight-viz')

    // if (!landscape.selectAll('.seasons-viz').node()){
    //     landscape.selectAll('.seasons-viz').remove();
    // }

    const seasonsViz = landscape.selectAll('.seasons-viz').data([0])
        .join('g').attr('class', 'seasons-viz')


    seasonsViz.selectAll('.season-viz').remove();

    const seasonViz = seasonsViz.selectAll('.season-viz').data(seasonsData)
        .join('g').attr('class', d => `season-viz ${d.id}-viz`)
        .attr('transform', (d, i) => {d.x = (i + 1) * page_w;
                return `translate(${d.x},0)`;})



    // seasonViz.selectAll('.tree-viz').remove();
    // seasonViz.selectAll('.treeroot-viz').remove();
    // seasonViz.selectAll('.legend').remove();

    const treerootViz = seasonViz.selectAll('.treeroot-viz').data(d => [d])
        .join('g').attr('class', 'treeroot-viz')

    const treeViz = seasonViz.selectAll('.tree-viz').data(d => [d])
        .join('g').attr('class', 'tree-viz')

    const legend = seasonViz.selectAll('.legend').data(d => [d])
        .join('g').attr('class', 'legend')

    //  // Clear any existing tree legend
    legend.selectAll('.tree-legend').remove();
    legend.selectAll('.treeroot-legend').remove();


    const treeLegend = legend.selectAll('.tree-legend').data(d => [d])
        .join('g').attr('class', 'tree-legend')
        
    const treerootLegend = legend.selectAll('.treeroot-legend').data(d => [d])
        .join('g').attr('class', 'treeroot-legend')


    seasonViz.each(function(s) {
        d3.select(this).call(g => {

            const treeDom = g.select('.tree-viz');
            const _data = data.present.filter(e => s.treefilter.reduce((acc, cur) => acc && e[cur], true));
            

            const treelegendDom = g.select('.tree-legend');
            const leafId = s.treelegend[0];
            const branchId = s.treelegend[1];

            const treerootlegendDom = g.select('.treeroot-legend')
            const treerootDom = g.select('.treeroot-viz')

            console.log(treelegendDom.node().getBoundingClientRect());
            console.log(treeDom.node().getBoundingClientRect());



            treeroot(treerootDom, data.past, s.rootkey).offset_y(410).trunk_h(200)(); //leave l max = 160, branch max = 500/2
            treeroot_legend(treerootlegendDom, g, s.rootkey)(410, 200, s.x)

            switch (s.id) {
                case 'spring':
                    springtree(treeDom, _data,s.treefilter).size(500)()
                    springtree_legend(treelegendDom, g,leafId, branchId)(500 - 90, s.x)
                    
                    break;
                case 'summer':
                    summertree(treeDom, _data,s.treefilter).size(500)()
                    summertree_legend(treelegendDom, g, leafId, branchId)(500 - 90, s.x)
                    
                    break;
                case 'fall':
                    falltree(treeDom, _data,s.treefilter).size(500)()
                    falltree_legend(treelegendDom, g, leafId, branchId)(500 - 90, s.x)
    
                    break;
                default:
                    wintertree(treeDom, _data,s.treefilter).size(500)()
                    wintertree_legend(treelegendDom, g, leafId, branchId)(500 - 90, s.x)
                    
            }

        })
    })


    //update func
    const update = {};
    update.resize = () => {
        // const [view_w, view_h] = [_width || dom.node().clientWidth, _height || dom.node().clientHeight];
        const [view_w, view_h] = [dom.node().clientWidth, dom.node().clientHeight];
        const [mx, my] = [50, 50]

        const box = landscape.node().getBBox();
        // const sunlightbox = sunlightViz.node().getBBox()
        // console.log(view_w, view_h, box, sunlightbox)

        // svg.attr('viewBox', `${box.x - mx} ${box.y - my} ${box.width + mx*2} ${box.height+my*2}`)
        svg.attr('viewBox', `${ - 600 - mx} ${- my} ${box.width/4 + mx*2} ${box.height+my*2}`)
            .attr('width', view_w)
            .attr('height', view_h)

        //locate to selected season
        const move_x = -(currentSeasonId === false ? -1 : currentSeasonId + 1) * page_w;
        seasonsViz.transition().duration(800).attr('transform', `translate(${move_x},0)`)
        console.log(move_x)

    }

    update.legend = (show) => {
        if (show) {
            legend.classed('d-none', false);
            treeViz.attr('opacity', 0.1);
            treerootViz.attr('opacity', 0.3);
        } else {
            legend.classed('d-none', true);
            treeViz.attr('opacity', 1);
            treerootViz.attr('opacity', 1);
        }
        // sunlightViz.classed('d-none', show);
    }


    return update;
}