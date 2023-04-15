function treeroot(_, data,keys,growtree) {
    const dom = _;
    let _offset_y = 500;
    let _startAngle = Math.PI * 0.5;
    let _trunk_h = 200;
    let _key;

    // let _branchColor = "#ad9b5d";
    const trunk_w = 8;

    const scaleL = d3.scaleLinear().range([0.7, 1]).nice();
    const truckColor = "#b0a39e";

    const _data = { name: 'all', children: [] };
    keys.forEach(k => {
        const values = { name: k, children: [] };

        const validData = data.filter(e => e[k])

        scaleL.domain(d3.extent(validData, d => d[k]))

        let dif = 0; //calc change to last year;
        validData.forEach((d,i) => {
            let t = {};
            t.name = d.year;
            t.value = d[k];
            t.ratio = scaleL(t.value);
            t.change = t.value - dif;
            dif = t.value;

            if(t.name > 2005 && t.name < 2022)values.children.push(t)
        })
        _data.children.push(values)
    })


    const tree = d3.cluster()
        .size([Math.PI * 1, _offset_y * 0.2])
    // .separation((a, b) => a.parent == b.parent ? 2 : 0)
    const root = tree(d3.hierarchy(_data));
    const drawData = root.children;
    // console.log(drawData)

    drawData.forEach(d => {
        d.target = { "angle": d.x + _startAngle, "radius": 10 };
        d.target.x = Math.sin(d.target.angle) * d.target.radius;
        d.target.y = -Math.cos(d.target.angle) * d.target.radius;
        d.source = { "angle": 0, "radius": 0, x: 0, y: 0 };

        d.target.xx = Math.sin(d.target.angle) * (d.target.radius + 10);
        d.target.yy = -Math.cos(d.target.angle) * (d.target.radius + 10);
        d.target.num_x = Math.sin(d.target.angle) * (d.target.radius + 20);
        d.target.num_y = -Math.cos(d.target.angle) * (d.target.radius + 20);

        // d.link = d3.linkRadial()
        //     .angle(e => e.angle)
        //     .radius(e => e.radius)(d)
        d.strokeWidth = 2;
        d.link = `M${d.source.x-trunk_w/2} ${d.source.y} L${d.target.xx} ${d.target.yy} L${d.source.x+trunk_w/2} ${d.source.y}`

        d.children.forEach(e => {
            e.markR = e.data.change > 0 ? 2 : 0;

            e.strokeWidth = 1.5;
            // e.strokeColor = "rgba(173, 155, 93,0.5)";
            e.strokeColor = truckColor;

            e.source = d.target;
            e.target = { "angle": e.x + _startAngle, "radius": e.y * e.data.ratio };
            e.target.x = Math.sin(e.target.angle) * e.target.radius;
            e.target.y = -Math.cos(e.target.angle) * e.target.radius;

            // e.target.x = Math.sin(e.target.angle) * e.target.radius + e.source.x;
            // e.target.y = -Math.cos(e.target.angle) * e.target.radius + e.source.y;

            e.c1 = { "angle": e.source.angle, "radius": (d.target.radius + e.y*0.3) }
            e.c1.x = Math.sin(e.c1.angle) * e.c1.radius
            e.c1.y = -Math.cos(e.c1.angle) * e.c1.radius

            e.c2 = { "angle": e.target.angle, "radius": (d.target.radius + e.y*0.3)  }
            e.c2.x = Math.sin(e.c2.angle) * e.c2.radius
            e.c2.y = -Math.cos(e.c2.angle) * e.c2.radius

            e.link = `M${e.source.x} ${e.source.y} C${e.c1.x} ${e.c1.y} ${e.c2.x} ${e.c2.y} ${e.target.x} ${e.target.y}`
            // e.link = `M${e.source.x} ${e.source.y} L${e.target.x} ${e.target.y}`
            // e.link = d3.linkRadial()
            //     .angle(t => t.angle)
            //     .radius(t => t.radius)(e)
        })
    })

    function update() {
        dom.attr('transform', `translate(${0},${_offset_y})`)
        const roots = dom.selectAll('.roots').data(drawData)
            .join('g').attr('class', 'roots')
            .attr('transform', `translate(0, ${_trunk_h})`)
            // .on("click", d => {
            //     d3.event.stopPropagation();
            //     updateProfile(d, `past`);
            // })

        const trunks = dom.selectAll('.trunks').data([0])
            .join('g').attr('class', 'trunks')
        if (growtree==false){
        trunks.selectAll('.trunk').data([0])
            .join('path').attr('class', 'trunk')
            // .attr('d', `M0 0 v${_trunk_h}`)
            .attr('d', `M0 0 C${-2} 0 ${-15} ${_trunk_h * 0.5} ${-trunk_w/2} ${_trunk_h} h${trunk_w} C${-10} ${_trunk_h * 0.5} ${2} 0 0 0`)
            .attr("fill", truckColor)
            .attr("stroke", truckColor)
        }else{
            const trunk = trunks.selectAll('.trunk').data([0])
            .join(enter => enter.append('path').attr("opacity",0))
            .attr('class', 'trunk')
            // .attr('d', `M0 0 v${_trunk_h}`)
            .attr('d', `M0 0 C${-2} 0 ${-15} ${_trunk_h * 0.5} ${-trunk_w/2} ${_trunk_h} h${trunk_w} C${-10} ${_trunk_h * 0.5} ${2} 0 0 0`)
            .attr("fill", truckColor)
            .attr("stroke", truckColor)
            trunk.transition().delay((wait_dur + 1)*dur).duration(dur).attr("opacity",1);
        }

        roots.selectAll('.node-hover').data(d => d.children)
            .join('path').attr('class', 'node-hover hoverable hovering')
            .attr('d', d => d.link)
            .attr('fill', 'none')
            .attr('stroke-width', 8)
            .attr('stroke','#000')
            .attr("stroke-linecap","round")
            .attr('opacity',0)
            .on("mouseover", function(d) {
                if(showLegend)return;
                d3.event.stopPropagation();
                updateTooltip(d, d3.select(this).node(), `past`);

            })
            .on("mouseout", d => {
                d3.event.stopPropagation();
                updateTooltip();
            })
        
        if (growtree===false){
        const node = roots.selectAll('.root-link').data(d => d.children)
            .join('g').attr('class', 'root-link')
            .attr("stroke-linecap","round")

        node.selectAll('.root-node').data(d => [d])
            .join('path')
            .attr('class', 'root-node')
            .attr("fill", "none")
            .attr("stroke", d => d.strokeColor)
            // .attr("stroke-opacity", 0.4)
            .attr("stroke-width", d => d.strokeWidth)
            .attr("d", d => d.link)

        node.selectAll('.root-node-mark').data(d => [d])
            .join('circle')
            .attr('class', 'root-node-mark')
            .attr("fill", d => d.strokeColor)
            .attr("stroke-width", 0)
            .attr("r", d => d.markR)
            .attr("cx", d => d.target.x)
            .attr("cy", d => d.target.y)
            

        roots.selectAll('.root-branch').data(d => [d])
            .join('path')
            .attr('class', 'root-branch')
            // .attr("fill", "none")
            // .attr("stroke", "rgba(173, 155, 93,1)")
            // .attr("fill", "#9f8d57")
            // .attr("stroke", "#9f8d57")
            .attr("fill", truckColor)
            .attr("stroke", truckColor)
            .attr("stroke-width", d => d.strokeWidth)
            .attr("d", d => d.link)

    }else{
        const node = roots.selectAll('.root-link').data(d => d.children)
        .join("g")
        .attr('class', 'root-link')
        .attr("stroke-linecap","round")


        const root_node = node.selectAll('.root-node').data(d => [d])
            .join(enter => enter.append('path').attr('opacity',0))
            .attr('class', 'root-node')
            .attr("fill", "none")
            .attr("stroke", d => d.strokeColor)
            // .attr("stroke-opacity", 0.4)
            .attr("stroke-width", d => d.strokeWidth)
            .attr("d", d => d.link)
        root_node.transition().delay(wait_dur * dur).duration(dur).attr("opacity",1);

        const root_node_mark = node.selectAll('.root-node-mark').data(d => [d])
            .join(enter => enter.append("circle").attr("opacity",0))
            .attr('class', 'root-node-mark')
            .attr("fill", d => d.strokeColor)
            .attr("stroke-width", 0)
            .attr("r", d => d.markR)
            .attr("cx", d => d.target.x)
            .attr("cy", d => d.target.y)
        root_node_mark.transition().delay(wait_dur*dur).duration(dur).attr("opacity",1);

        const root_branch = roots.selectAll('.root-branch').data(d => [d])
            .join('path')
            .attr('class', 'root-branch')
            // .attr("fill", "none")
            // .attr("stroke", "rgba(173, 155, 93,1)")
            // .attr("fill", "#9f8d57")
            // .attr("stroke", "#9f8d57")
            .attr("fill", truckColor)
            .attr("stroke", truckColor)
            .attr("stroke-width", d => d.strokeWidth)
            .attr("d", d => d.link)
        
        root_branch.transition().delay(wait_dur *dur).duration(dur).attr("opacity",1);
    }
    const nums = dom.selectAll('.root-branch-nums').data([0])
    .join('g').attr('class', 'root-branch-nums')
    .classed('d-none', true)

    nums.selectAll('.root-branch-num').data(drawData)
        .join('text')
        .attr('class', 'root-branch-num')
        .attr("fill", textColor)
        .text((d,i) => `${i+1}`)
        .attr('x', d => d.target.num_x)
        .attr('y', d => d.target.num_y)
        .attr('font-size',12)
        .attr('text-anchor', 'middle')
        
    const arrows = roots.filter((d,i) => i === 0)
        .selectAll('.root-arrow').data(d => [d])
        .join('g').attr('class', 'root-arrow')
        .classed('d-none', true)
    arrows.selectAll('.arrow-label').data(d => [d.children[0], d.children[d.children.length-1]])
        .join('text').attr('class', 'arrow-label')
        // .text((d,i) => i === 0 ? 'earliest year' : 'latest year')
        .text((d,i) => i === 0 ? '2010' : '2021')
        // .attr('text-anchor', (d,i) => i === 0 ?'middle' : 'end')
        .attr('text-anchor','middle')
        .attr('font-size',12)
        .attr("fill", textColor)
        .attr('x', d => `${Math.sin(d.target.angle) * drawData[0].children[0].target.radius}`)
        .attr('y', (d,i) => `${-Math.cos(d.target.angle) * drawData[0].children[0].target.radius + (i === 0? -12/2:(drawData.length > 1?12:-12/2))}`)
    arrows.selectAll('.arrow-path').data(d => [d])
        .join('path').attr('class', 'arrow-path')
        .attr('fill','none')
        .attr('stroke',textColor)
        .attr('stroke-width',1)
        .attr('d', d => d3.lineRadial().angle(e => e.target.angle).radius(d.children[0].target.radius).curve(d3.curveBasis)(d.children))

    }

    update.offset_y = function(_) {
        if (typeof _ === 'undefined') return _offset_y;
        _offset_y = _;
        return this;
    }
    update.trunk_h = function(_) {
        if (typeof _ === 'undefined') return _trunk_h;
        _trunk_h = _;
        return this;
    }

    // update.truckColor = function(_) {
    //     if (typeof _ === 'undefined') return truckColor;
    //     truckColor = _;
    //     return this;
    // }
    
    
    return update;
}