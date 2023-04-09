const profileContainer = d3.select('#profile');
const profileBody = profileContainer.select('.modal-body');
const profileChart = profileBody.select('.profile-chart')
const profileTitle = profileChart.select('.profile-title');
const profileSubtitle = profileChart.select('.profile-subtitle');
const profileViz = profileBody.select('.profile-viz');
const profileIndex = profileBody.select('.profile-index');



const updateProfile = (data, chart) => {
    $('#profile').modal('show');

    // console.log(chart)
    tooltip.classed('d-none', true);
    let chartFunc = () => {};

    $('#profile').on('shown.bs.modal', function(event) {

        switch (chart) {
            case 'future':
                profileTitle.html(`${data.name}`);
                profileSubtitle.html(`${data.Frontier} ${data.type}`);
                profileChart.classed('col-6', true).classed('col-12', false);
                profileIndex.classed('d-none', false).html(`
                <div class="d-flex flex-column col-12">
                    <div class="d-flex flex-column">
                        <div class="text-capitalize">${data.type} Buzz</div>
                        <div class="fs-7 fst-italic text-muted fw-light">Google returns for each keyword</div>
                        <div class="profile-index-chart"></div>
                    </div>
                    <div class="border-top mt-2 pt-3 col-12 d-flex flex-column ps-3">
                        ${data.times.map(d => `
                            <div class="col-12 d-flex flex-column pb-3 item">
                                <div class="text-capitalize lh-1 mb-1">${d.t}</div>
                                <div class="ps-2 fw-light">${d.v}</div>
                            </div>
                            `).join('')}
                    </div>
                </div>
                `)

                chartFunc = () => {
                    indexChart(profileIndex.select('.profile-index-chart'), allData.future)(data)
                }

            //     break;
            case 'past':
                profileTitle.html(`${indexName(data.data.name)}`);
                // console.log(data)
                profileSubtitle.html(`${d3.extent(data.children, d => d.data.name).join(' - ')}`);
                profileIndex.classed('d-none', true).html('');
                profileChart.classed('col-6', false).classed('col-12', true);

                break;
            case 'present-country':
                const indexData = [];
                seasonsData[currentSeasonId].treefilter.slice(0,3).forEach((d, i) => {
                    if (i<=3){
                    const indexD = { id: d };
                    // indexD.year = sources['tree'][d].year;
                    indexD.year = data.data.year;
                    indexD.y_domain = yDomain(d);
                    // indexD.hl_color = "branch_strokeColor";
                    indexD.hl_color = data.branch_strokeColor;
                    // indexD.icon = 'branch';
                    indexD.icon = "./static/imgs/branch.png";
                    if (i == 1) {
                        // indexD.hl_color = "leaf_fillColor";
                        indexD.hl_color = seasonsData[currentSeasonId].id ==="winter" ? "#000" : data.leaf_fillColor;
                        indexD.icon = seasonsData[currentSeasonId].id ==="winter" ? getSnowicon(data.leaf_fillColor): getLeaficon(data.leaf_fillColor);
                    }
                    if (i == 2) {
                        // indexD.hl_color = "coreColor";
                        indexD.hl_color = data.coreColor;
                        // indexD.icon = 'core';
                        const typeColor = typeof data.coreColor === 'string'
                        indexD.icon = getCoreicon(typeColor ? data.coreColor: data.coreColor.hex())
                        // indexD.icon = getCoreicon(data.coreColor.name())
                    }
                    // [branch_key, leaf_key, core_key] = treekeys;

                    indexData.push(indexD)}
                })

                profileTitle.html(`${data.data.country}`);
                profileSubtitle.html(`${data.data.region}`);
                profileChart.classed('col-6', true).classed('col-12', false);

                profileIndex.classed('d-none', false).html(`
                <div class="d-flex flex-column col-12">
                    ${indexData.map(d => `
                    <div class="d-flex flex-column">
                        <div class="my-2 d-flex align-items-end">
                            <img class="legend mx-1" src="${d.icon}">
                            <div class="me-1">${indexName(d.id)}</div> 
                            <div class="fs-7 fw-light">${d.year}</div>
                        </div>
                        <div class="profile-index-chart profile-index-chart-${d.id}"></div>
                    </div>
                        `).join('')}
                </div>
                `)
                chartFunc = () => {
                    indexData.forEach(d => {
                        valueChart(profileIndex.select(`.profile-index-chart-${d.id}`), allData.present)
                            .key(d.id).y_domain(d.y_domain).hl_color(d.hl_color)(data)
                    })
                }

                break;
            case 'present-region':

                break;
            default:

        }


        updateProfileViz(data, profileViz, chart);
        chartFunc();

    })


}

function updateProfileViz(data, dom, chart) {
    const [view_w, view_h] = [dom.node().clientWidth, dom.node().clientHeight];
    // console.log(data, dom, view_w, view_h)
    const svg = dom.select('svg')
    const landscape = svg.select('.landscape')
    landscape.html('');
    switch (chart) {
        case 'future':

            landscape.selectAll('.trackline').data([data])
                .join('path').attr('class', 'trackline')
                .attr('d', d => d.path)
                .attr('fill', 'none')
                .attr('stroke', d => d.color)
                .attr('stroke-width', d => d.strokeWidth)
                .attr('stroke-opacity', d => d.strokeOpacity)
                .attr("stroke-linecap", "round")

            const time = landscape.selectAll('.time').data([data])
                .join('g').attr('class', 'time')

            time.selectAll('.dot').data(d => d.times)
                .join('circle').attr('class', 'dot')
                .attr('r', d => d.r)
                // .attr('cx', d => d.x).attr('cy', d => d.y)
                .attr('fill', d => d.fill)
                .html(d => `
                <animateMotion dur="1s" repeatCount="indefinite" path="${d.path}" />
                `)

            time.selectAll('.line').data(d => d.times)
                .join('path').attr('class', 'line')
                .attr('stroke-width', d => d.r)
                .attr('stroke', d => d.fill)
                .attr('d', d => d.path)

            time.selectAll('.year').data(d => d.times)
                .join('text').attr('class', 'year fst-italic fw-lighter')
                .text(d => d.t).attr('x', d => d.x + 5).attr('y', d => d.y + 5 / 2)
                .attr('font-size', 5).attr('fill', textColor)

            break;
        case 'past':
            const roots = landscape.selectAll('.roots').data([data])
                .join('g').attr('class', 'roots')
                .attr('transform', d => `rotate(${-d.x * 180/Math.PI})`)
            const root = roots.selectAll('.root-link').data(d => d.children)
                .join('g').attr('class', 'root-link')
            root.selectAll('.root-node').data(d => [d])
                .join('path')
                .attr('class', 'root-node')
                .attr("fill", "none")
                .attr("stroke", d => d.strokeColor)
                .attr("stroke-width", d => d.strokeWidth)
                .attr("d", d => d.link)
                .attr("stroke-linecap", "round")
            root.selectAll('.root-node-mark').data(d => [d])
                .join('circle')
                .attr('class', 'root-node-mark')
                .attr("fill", d => d.strokeColor)
                .attr("stroke-width", 0)
                .attr("r", d => d.markR)
                .attr("cx", d => d.target.x)
                .attr("cy", d => d.target.y)

            const arrowRange = d3.extent(data.children, d => d.data.value)
            const arrowData = [];
            const endData = [];
            data.children.forEach((d, i) => {
                if (arrowRange.includes(d.data.value)) arrowData.push(d);
                if (i === 0 || !data.children[i + 1]) endData.push(d)
            })

            endData.forEach((d, i) => {
                const angle = i == 0 ? d.target.angle - Math.PI * 0.01 : d.target.angle + Math.PI * 0.01
                d.label_x = Math.sin(angle) * arrowData[1].target.radius;
                d.label_y = -Math.cos(angle) * arrowData[1].target.radius + 5 / 2;

            })

            landscape.selectAll('.root-label').data(arrowData)
                .join('text').attr('class', 'root-label')
                .attr('text-anchor', 'end').attr('font-size', 5)
                .attr('x', d => d.target.radius - 5 / 2)
                // .attr('y', d => d.target.y - 12/2)
                .text(d => d.data.value)
                .attr('fill', textColor)

            roots.selectAll('.arrow-label').data(endData)
                .join('text').attr('class', 'arrow-label')
                .attr('text-anchor', 'middle').attr('font-size', 5)
                .attr('x', d => d.label_x)
                .attr('y', d => d.label_y)
                .text(d => d.data.name).attr('fill', textColor)
                .attr('transform', d => `rotate(${data.x * 180/Math.PI},${d.label_x},${d.label_y})`)

            roots.selectAll('.arrow-path').data(arrowData)
                .join('path').attr('class', 'arrow-path')
                .attr('fill', 'none')
                .attr('stroke', textColor).attr('stroke-width', 1)
                .attr('d', d => d3.lineRadial().angle(e => e.target.angle).radius(d.target.radius).curve(d3.curveBasis)(data.children))

            break;
        case 'present-country':

            const branch = landscape.selectAll('.branch').data([data.parent])
                .join('g').attr('class', 'branch')
                .attr('transform', d => `rotate(${-data.source.angle * 180/Math.PI})`)
            branch.selectAll('.branch-fill').data(d => [d])
                .join('path')
                .attr('class', 'branch-fill')
                .attr("fill", "none")
                .attr("stroke", d => d.strokeColor)
                .attr("stroke-opacity", d => d.strokeOpacity)
                .attr("stroke-width", d => d.strokeWidth)
                .attr("stroke-dasharray", d => d.branch_strokeDash)
                .attr("d", d => d.link)

            const node = branch.selectAll('.node').data(d => d.children)
                .join('g').attr('class', 'node')
                .attr('opacity', d => d.data.name === data.data.name ? 1 : 0.1)

            node.selectAll('.link-fill').data(d => [d])
                .join('path')
                .attr('class', 'link-fill')
                .attr("fill", "none")
                .attr("stroke", d => d.branch_strokeColor)
                .attr("stroke-opacity", d => d.branch_strokeOpacity)
                .attr("stroke-width", d => d.branch_strokeWidth)
                .attr("stroke-dasharray", d => d.branch_strokeDash)
                .attr("d", d => d.link)

            node.selectAll('.leaf').data(d => [d])
                .join('path').attr('class', 'leaf')
                .attr('fill', d => d.leaf_fillColor)
                .style('fill-opacity', d => d.leaf_fillOpacity)
                .attr('d', d => d.leave)
            node.selectAll('.core').data(d => [d])
                .join('circle').attr('class', 'core')
                .attr('r', d => d.coreR)
                .attr('fill', d => d.coreColor)
                .attr('cx', d => d.a.x)
                .attr('cy', d => d.a.y)
            break;
        default:

    }
    const [mx, my] = [20, 20];
    const box = landscape.node().getBBox();
    svg.attr('viewBox', `${-Math.max(box.width,view_w*0.2)/2 - mx} ${box.y - my} ${Math.max(box.width,view_w*0.2) + mx*2} ${box.height+my*2}`)
        .attr('width', view_w).attr('height', view_h)
}