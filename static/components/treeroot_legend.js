const treeroot_legend = (_, vis,key) => {
    const node = _;
    const indicator_w = 30;
    const indicator_gap = 10;
    const text_gap = 5;
    const fontsize = [14, 14];

    const targetTrunk = vis.select('.trunk');
    const targetBranch = vis.selectAll('.root-branch');
    const targetNode = vis.select('.root-node');


    const legendData = [{
            targetNode: targetNode,
            title: "Annual value",
            content: ["The distance from the root center", "shows value of the yearly performance","A dot indicates the value increased","compare to previous year."],
            sideRight: true,
            offset_y: 0.5,
            image:null,
            // image:`./static/imgs/legend/root_mark.png`,
        },
        {
            targetNode: targetTrunk,
            title: "Performances",
            // content:key.map((d,i) => `${i+1}. ${indexName(d)} (${sources['root'][d].year})`),
            content:key.map((d,i) => `${i+1}. ${indexName(d)}`),
            sideRight: false,
            offset_y: 1,
            image:null,
            // source: key.map(d => sources.root[d])
        },
    ]
    const item = node.selectAll('.legent-item').data(legendData)
        .join('g').attr('class', 'legent-item')

    item.selectAll('.indicator').data(d => [d])
        .join('path').attr('class', 'indicator')
        .attr('d', d => `M${(d.sideRight ? -1:-2) * indicator_w} 0 h${(d.sideRight ? 1:0) * indicator_w}`)
        .attr('fill', 'none')
        .attr('stroke', textColor)
        .attr('stroke-width', 1)

    item.selectAll('.item-text').data(d => [d])
        .join('text').attr('class', 'item-text')
        .attr('fill', textColor)
        // .attr('text-anchor', d => d.sideRight ? 'start' : 'end')
        .attr('y', d => d.sideRight ? -fontsize[0] : fontsize[0] * 0.4).attr('transform', d => `translate(${d.sideRight ? 0 : -220-text_gap},0)`)
        .html(d => `
    		<tspan x='${(d.sideRight ? 1:-1) * text_gap}' font-size="${fontsize[0]}" class="fw-bold">${d.title}</tspan>
    		${d.content.map((e,i) => `
    			<tspan x='${(d.sideRight ? 1:-1) * text_gap}' dy="${fontsize[0] * 1.4}" font-size="${fontsize[1]}" class="fw-light">${e}</tspan>
    			${d.source? `<a href="${d.source[i].link}" target="_blank"><tspan class="fst-italic fw-light" font-size="${fontsize[1]}">source</tspan></a>`:""}
                `).join('')}
    		`)

    item.filter(d => d.image)
        .selectAll('.item-image').data(d => [d])
        .join('image').attr('class', 'item-image')
        .attr('width', 100).attr('height',40)
        .attr('href',d => d.image)
        .attr('x',d => d.sideRight ? text_gap : -220-text_gap*2)
        .attr('y', d => d.content.length * fontsize[0]*1.4 - fontsize[0]/2)

    const clones = node.selectAll('.clones').data([0])
        .join('g').attr('class', 'clones')



    const itemTitle = node.selectAll('.legent-item-title').data([0])
        .join('text').attr('class', 'legent-item-title fw-bold')
        .attr('font-size', fontsize[0]).attr('text-anchor', 'middle')
        .attr('fill', textColor)
        .html(`
        	<tspan x=0 dy="${fontsize[0] * 1.4}">Each root represents one</tspan>
        	<tspan x=0 dy="${fontsize[0] * 1.4}">performance over past years.</tspan>
        	`)


    //branch leave
    const copyNode1 = targetNode.node();
    const clone1 = copyNode1.cloneNode(true);
    clones.node().appendChild(clone1);

    //trunk
    const copyNode2 = vis.select('.trunks').node();
    const clone2 = copyNode2.cloneNode(true);
    clones.node().appendChild(clone2);

    //branch
    targetBranch.nodes().forEach(d => {
        const copyNode3 = d;
        const clone3 = copyNode3.cloneNode(true);
        clones.node().appendChild(clone3);
    })


    //nums
    const copyNode4 = vis.select('.root-branch-nums').node();
    const clone4 = copyNode4.cloneNode(true);
    clones.node().appendChild(clone4);

    //arrow
    const copyNode5 = vis.select('.root-arrow').node();
    const clone5 = copyNode5.cloneNode(true);
    clones.node().appendChild(clone5);

    function update(offset_y1, offset_y2,offset_x) {
        // const leftNodeSize = leftNode.node().getBoundingClientRect();
        // const rightNodeSize = rightNode.node().getBoundingClientRect();
        const targetTrunkSize = targetTrunk.node().getBoundingClientRect();

        legendData.forEach(d => {
            const targetNodeSize = d.targetNode.node().getBoundingClientRect();
            d.x = d.sideRight ? targetNodeSize.x + targetNodeSize.width + indicator_gap + indicator_w : targetNodeSize.x - indicator_gap - indicator_w;
            d.y = targetNodeSize.y + targetNodeSize.height * d.offset_y;
        })

        item.attr('transform', d => `translate(${d.x-offset_x}, ${d.y})`)
        itemTitle.attr('transform', d => `translate(${targetTrunkSize.x + targetTrunkSize.width/2-offset_x}, ${targetTrunkSize.y + targetTrunkSize.height - fontsize[0]*5})`)

        clones.attr('transform', `translate(${0},${offset_y1 + offset_y2})`)
        d3.select(clone2).attr('transform', `translate(${0},${-offset_y2})`)
        d3.select(clone4).classed('d-none', false)
        d3.select(clone5).classed('d-none', false)
    }
    return update;
}