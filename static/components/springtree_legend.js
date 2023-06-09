const springtree_legend = (_, vis, leafId, branchId) => {
    const node = _;
    const indicator_w = 30;
    const indicator_gap = 25;
    const text_gap = 5;
    const fontsize = [14, 14];

    const targetNode = vis.select(`.${leafId}`);
    const targetBranch = vis.select(`.${branchId}`);

    const leftNode = targetNode.select('.core');
    const rightNode = targetNode.select('.leaf');

    const legendData = [{
            targetNode: rightNode,
            title: "Freedom Score",
            content: ["The length of leave shows the freedom score", "(Are you satisfied with your freedom to choose what","  you do with your life). (%Satisfied, higher = better)"],
            sideRight: true,
            offset_y: 0.5,
            image:null,
            source:'https://analyticscampus.gallup.com/Tables/'
        },
        {
            targetNode: leftNode,
            title: "Happiness Score",
            content: ["The color shows the happiness ", "score. (1-100, higher = better)"],
            sideRight: false,
            offset_y: 0.5,
            image:`./static/imgs/core_color.png`,
            source:'https://analyticscampus.gallup.com/Tables/'
        },
        {
            targetNode: targetNode.select('.link-fill'),
            title: "Life Expecancy",
            content: ["The length of the twig shows country specific"," life expectancy value, (years)."],
            sideRight: true,
            offset_y: 0.7,
            image:null,
            source: 'https://www.who.int/data/gho/data/themes/mortality-and-global-health-estimates/ghe-life-expectancy-and-healthy-life-expectancy',
        },
        {
            targetNode: targetBranch.select('.branch-fill'),
            title: "",
            content: ["The length of the larger branch shows ", "the average life expectancy value of the ", "countries in the sub-region. (years)."],
            sideRight: true,
            offset_y: 0.2,
            image:null,
        },
    ]


    const item = node.selectAll('.legent-item').data(legendData)
        .join('g').attr('class', 'legent-item')


    item.selectAll('.indicator').data(d => [d])
        .join('path').attr('class', 'indicator')
        .attr('d', d => `M${(d.sideRight ? -1:0) * indicator_w} 0 h${indicator_w}`)
        .attr('fill', 'none')
        .attr('stroke', textColor)
        .attr('stroke-width', 1)

    item.selectAll('.item-text').data(d => [d])
        .join('text').attr('class', 'item-text')
        .attr('fill', textColor)
        // .attr('text-anchor', d => d.sideRight ? 'start' : 'end')
        .attr('y', -fontsize[0]).attr('transform', d => `translate(${d.sideRight ? 0 : -200-text_gap},0)`)
        .html(d => `
            <tspan x='${(d.sideRight ? 1:-1) * text_gap}' font-size="${fontsize[0]}" class="fw-bold">${d.title}</tspan>
            ${d.source ? `<a href="${d.source}" target="_blank"><tspan class="fst-italic fw-light" font-size="${fontsize[1]}">source</tspan></a>`: ""}
            ${d.content.map(e => `
                <tspan x='${(d.sideRight ? 1:-1) * text_gap}' dy="${fontsize[0] * 1.4}" font-size="${fontsize[1]}" class="fw-light">${e}</tspan>
                `).join('')}
            `)
    item.filter(d => d.image)
        .selectAll('.item-image').data(d => [d])
        .join('image').attr('class', 'item-image')
        .attr('width', 100).attr('height',40)
        .attr('href',d => d.image)
        .attr('x',-200-text_gap*2)
        .attr('y', d => d.content.length * fontsize[0]*1.4 - fontsize[0]/2)

    const itemTitle = node.selectAll('.legent-item-title').data([0])
        .join('text').attr('class', 'legent-item-title fw-bold')
        .attr('font-size', fontsize[0]).attr('text-anchor', 'middle')
        .attr('fill', textColor)
        .html(`
            <tspan x=0 dy="${fontsize[0] * 1.4}">Each branch represents one</tspan>
            <tspan x=0 dy="${fontsize[0] * 1.4}">country with its performances</tspan>
            `)

    const clones = node.selectAll('.clones').data([0])
        .join('g').attr('class', 'clones')


 
    const copyNode1 = targetNode.node();
    // const copyNode1 = d3.select(vis.node().cloneNode(true)).select(`.${leafId}`).node();
    const clone1 = copyNode1.cloneNode(true);
    clones.node().appendChild(clone1);

    const copyNode2 = targetBranch.select('.branch-fill').node();
    const clone2 = copyNode2.cloneNode(true);
    clones.node().appendChild(clone2);

    // function getNodePositionRelativeToSvg(node, svg) {
    //   let currentNode = node;
    //   let transformMatrix = svg.getScreenCTM().inverse();

    //   while (currentNode !== svg) {
    //     transformMatrix = currentNode.getCTM().multiply(transformMatrix);
    //     currentNode = currentNode.parentNode;
    //   }
    //    return {
    // x: transformMatrix.e,
    // y: transformMatrix.f};
    // }


    function update(offset_y, offset_x) {
        const leftNodeSize = leftNode.node().getBoundingClientRect();
        const rightNodeSize = rightNode.node().getBoundingClientRect();

        // console.log(leftNode);
        // console.log(leftNodeSize.x, leftNodeSize.y);
        // const left_pos = getNodePositionRelativeToSvg(leftNode.node(), vis.node());
        // const right_pos = getNodePositionRelativeToSvg(rightNode.node(),vis.node());


        // legendData.forEach(d => {
        //     const targetNodeSize = d.targetNode.node().getBoundingClientRect();
        //     const target_pos = getNodePositionRelativeToSvg(d.targetNode.node(), vis.node());
        //     d.x = d.sideRight ? right_pos.x + rightNodeSize.width + indicator_gap + indicator_w : left_pos.x - indicator_gap - indicator_w;
        //     d.y = target_pos.y + targetNodeSize.height * d.offset_y;
        // })

        // item.attr('transform', d => `translate(${d.x-offset_x}, ${d.y})`)
        // itemTitle.attr('transform', d => `translate(${right_pos.x + rightNodeSize.width/2-offset_x}, ${right_pos.y - fontsize[0]*3})`)
        // clones.attr('transform', `translate(${0},${offset_y})`)

        legendData.forEach(d => {
            const targetNodeSize = d.targetNode.node().getBoundingClientRect();
            d.x = d.sideRight ? rightNodeSize.x + rightNodeSize.width + indicator_gap + indicator_w : leftNodeSize.x - indicator_gap - indicator_w;
            d.y = targetNodeSize.y + targetNodeSize.height * d.offset_y;
        })

        item.attr('transform', d => `translate(${d.x-offset_x}, ${d.y})`)
        itemTitle.attr('transform', d => `translate(${rightNodeSize.x + rightNodeSize.width/2-offset_x}, ${rightNodeSize.y - fontsize[0]*3})`)
        clones.attr('transform', `translate(${0},${offset_y})`)
    }
    return update;
}