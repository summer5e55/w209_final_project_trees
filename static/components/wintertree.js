const wintertree = (_, data, treekeys, sort) => {

    let dom = _;
    let _width = null;
    let _height = null;
    let size1 = 1.22;
    let _radial = size1 * Math.PI;
    let _startAngle = (2 - size1 / 2) * Math.PI;
    let gap = 0.036 * Math.PI;
    let _size = 500;
    // let gap = 15; //arc length
    const branchColor = "#b0a39e";
    // const branchColor = "#827887"
    // const branch_key = 'renewables';
    // const snow_key = 'co2_p';
    // const core_key = 'gdp';
    const [branch_key, snow_key, core_key, year_key] = treekeys;

    let rotate = {
        1: -15,
        2: -10,
        3: -5,
        4: -5,
        5: -3,
        6: 10,
        7: 5,
        8: 4,
        9: 3,
        10:-20,
        11:-3,
        12: -3,
        13: -3,
        14: -3,
        15: 2,
        16: 5,
        17: 5,
        18: 7
    }

    const scaleGap = d3.scaleLinear().domain([0, d3.sum(data, d => d[snow_key])])
        .range([_radial*0.02, _radial * 2])
    // console.log(d3.extent(data, d => d[snow_key]))
    let nestTreeData = d3.nest().key(d => d.region).entries(data);
    // nestTreeData.sort((a,b) => a.regionId - b.regionId)
    nestTreeData.forEach((d, n) => {
        d.id = `branch-${n}`;
        d.name = d.key;
        d.children = d.values;
        d.count = d.children.length;
        d.wipe = (d.count - 1) * gap;
        d.children.sort((a, b) => a[branch_key] - b[branch_key])
        d.rotate = rotate[n] || 0;
        // d.rotate = 0;
        delete d.values;
        delete d.key;
        let _wipe = 0;
        d.children.forEach((e, i) => {
            e.order = i;
            e.id = `leaf-${e.name}`;
            // e.wipe = scaleGap(e[snow_key]);
            // e.wipe_s = _wipe;
            // _wipe = _wipe + e.wipe
        })
        // d.wipe = d3.sum(d.children, e => e.wipe)

        // d[snow_key] = d3.mean(d.children, n => n[snow_key]);
        d[branch_key] = d3.mean(d.children, n => n[branch_key]);


    })

    if (sort){
    nestTreeData.sort((a, b) => a[branch_key] - b[branch_key]);
    // rotate = {}
    };


    // console.log(nestTreeData)

    function update() {

        // let [view_w, view_h] = [_width || dom.node().clientWidth, _height || dom.node().clientHeight];
        // const [mx, my] = [10, 50];
        // const size = Math.min(view_w, view_h);
        // const radius = Math.max(Math.min(size * 0.8,size - 220),300);
        // const radius = Math.min(size * 0.9,size - 220);

        // const radius = Math.max(size, 100)
        // const radius = 600;
        const fontsize = 8;

        dom.attr('transform', `translate(${0},${_size-90})`)

        const LRange = d3.extent(nestTreeData, d => d[branch_key])
        const LLRange = d3.extent(data, d => d[branch_key]);

        const scaleRR = d3.scaleLinear().domain(d3.extent(data, d => d[snow_key]))
            // .range([12, 60])
            .range([12, 40])

        const scaleLL = d3.scaleLinear().domain(LLRange)
            .range([20, 200])
        // .range([40, 160])

        //region branch
        const scaleL = d3.scaleLinear().domain(LRange)
            .range([0.1, 0.9])
            // .range([0.6, 0.6])

        color.domain(d3.extent(data, d => d[core_key]))


        const tree = d3.cluster()
            // const tree = d3.tree()
            .size([_radial, _size])
        // .separation((a, b) => a.parent == b.parent ? 2 : 1)
        // .separation((a, b) => (a.parent == b.parent ? 2 : 1) / a.depth)


        // console.log(data)
        const _data = { name: 'all', children: nestTreeData }



        const root = tree(d3.hierarchy(_data)
            // .sort((a, b) => d3.ascending(a.data.name, b.data.name))
        );
        // console.log(_data)
        const drawData = root.children;
        drawData.sort((a, b) => a.data[branch_key] - b.data[branch_key])
        drawData.forEach(d => {
            // x as an angle and y as a radius
            // d.target.angle = d.x + _startAngle;
            // d.target.radius = d.y;
            // d.source.angle = 0;
            // d.source.radius = 0;
            d.y0 = d.y;
            // d.target = { "angle": d.x + _startAngle, "radius": d.y * scaleL(d.data[branch_key]) };
            d.target = { "angle": d.x + _startAngle + d.data.rotate / 180 * Math.PI, "radius": d.y * scaleL(d.data[branch_key]) };
            d.target.x = Math.sin(d.target.angle) * d.target.radius;
            d.target.y = -Math.cos(d.target.angle) * d.target.radius;
            d.source = { "angle": d.target.angle, "radius": 0, x: 0, y: 0 };

            d.link = d3.linkRadial()
                .angle(e => e.angle)
                .radius(e => e.radius)(d)
            // d.link = `M${d.source.x} ${d.source.y} L${d.target.x} ${d.target.y}`

            // d.strokeWidth = scaleR(d.data.pop_area);
            // d.strokeColor = "#ad9b5d";
            d.branch_strokeDash = "none";
            d.strokeColor = branchColor;
            d.strokeOpacity = 0.9;
            d.strokeWidth = 1.5;
            d.text_anchor = "middle";
            d.text = d.data.name.split(' ').map(e => ({ offset_y: d.target.y, offset_x: d.target.x, name: e }))

            d.children.forEach(e => {
                e.coreR = 3;
                e.coreColor = color(e.data[core_key]);
                // e.strokeWidth = scaleR(e.data.pop_area);
                // e.branch_strokeColor = "#ad9b5d";
                e.branch_strokeDash = "none";
                e.branch_strokeColor = branchColor;
                e.branch_strokeWidth = 1;
                e.branch_strokeOpacity = 0.5;
                // e.leaf_fillColor = '#48e2e4';
                // e.leaf_fillColor = '#95a95e';  
                // e.leaf_fillColor = '#FFFAFA' fbfcfc
                e.leaf_fillColor = "#e3e9f3"  //#dbe6f7
                e.leaf_fillOpacity = 0.9;
                e.leaf_strokeColor = "#f4f7fc";
                // e.leaf_strokeWidth = 2;
                e.leaf_strokeWidth = 0.5;

                // e.target = {"angle":d.target.x - d.target.data.wipe / 2 / d.target.y + gap / d.target.y * e.data.order,"radius":d.target.y};
                // e.source = {"angle":d.target.angle,"radius":0,x:0,y:0};
                e.source = d.target;
                // e.target = { "angle": e.source.angle - d.data.wipe / 2 / e.source.radius + gap / e.source.radius * e.data.order, "radius": e.source.radius + 40 };
                e.target = {"angle":e.source.angle - d.data.wipe/2 + gap*e.data.order,"radius":scaleLL(e.data[branch_key])}
                // e.target = { "angle": e.source.angle - d.data.wipe / 2 + e.data.wipe / 2 + e.data.wipe_s, "radius": scaleLL(e.data[branch_key]) }
                // e.link = d3.linkRadial()
                //     .angle(n => n.angle)
                //     .radius(n => n.radius)(e)

                // e.target.radius_e = e.target.radius + scaleLL(e.data.hpi)
                e.target.x = Math.sin(e.target.angle) * e.target.radius + e.source.x;
                e.target.y = -Math.cos(e.target.angle) * e.target.radius + e.source.y;
                // e.link = e.link + `L${e.target.x} ${e.target.y}`;
                // e.link = `M${e.source.x} ${e.source.y} L${e.target.x} ${e.target.y}`

                e.c1 = { "angle": e.source.angle, "radius": e.target.radius * 0.4 }
                // e.c1 = {"angle":e.source.angle,"radius":scaleLL.range()[0]}
                e.c1.x = Math.sin(e.c1.angle) * e.c1.radius + e.source.x;
                e.c1.y = -Math.cos(e.c1.angle) * e.c1.radius + e.source.y;

                // e.c2 = {"angle":e.target.angle,"radius":(e.target.radius - e.source.radius)*0.7 + e.source.radius}
                // e.c2 = {"angle":e.target.angle,"radius":Math.min(scaleLL.range()[1],e.target.radius)}
                e.c2 = { "angle": e.target.angle, "radius": e.target.radius * 0.7 }
                e.c2.x = Math.sin(e.c2.angle) * e.c2.radius + e.source.x;
                e.c2.y = -Math.cos(e.c2.angle) * e.c2.radius + e.source.y;


                e.link = `M${e.source.x} ${e.source.y} C${e.c1.x} ${e.c1.y} ${e.c2.x} ${e.c2.y} ${e.target.x} ${e.target.y}`

                e.a = e.target;
                // e.r = e.data.hdi ? scaleRR(e.data.hdi) : 0;
                e.r = scaleRR(e.data[snow_key]);
                // console.log(e.a.x_e,e.a.y_e)
                e.b = { x: Math.sin(e.a.angle) * e.r + e.a.x, y: -Math.cos(e.a.angle) * e.r + e.a.y }
                const radial = distance(e.a, e.b) * 0.5;
                // console.log(d.r)
                e.leave = `M${e.a.x} ${e.a.y} A${radial} ${radial} 0,0,0 ${e.b.x} ${e.b.y} A${radial} ${radial} 0,0,0 ${e.a.x} ${e.a.y}`
            })
            // d.children.sort((a, b) => b.data[snow_key] - a.data[snow_key])
        })

        const branch = dom.selectAll('.branch').data(drawData)
            .join('g').attr('class', d => `branch ${d.data.id}`)
            // .attr('id', d => d.data.id)
            .html((d, i) => `
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="rotate"
              values="0 0 0;0.5 0 0;0 0 0;-0.5 0 0;0 0 0"
              dur="${Math.random()*2 + 3}s"

              repeatCount="indefinite" />
            `)

        // branch.selectAll('.link-branch').data(d => [d])
        //     .join('path')
        //     .attr('class', 'link-branch')
        //     .attr("fill", "none")
        //     .attr("stroke", "#b99068")
        //     .attr("stroke-opacity", 0.4)
        //     .attr("stroke-width", d => d.strokeWidth)
        //     .attr("d", d => d.link)

        branch.selectAll('.branch-fill').data(d => [d])
            .join('path')
            .attr('class', 'branch-fill')
            .attr("fill", "none")
            .attr("stroke", d => d.strokeColor)
            .attr("stroke-opacity", d => d.strokeOpacity)
            .attr("stroke-width", d => d.strokeWidth)
            .attr("d", d => d.link)
        // .on("mouseover", function(d) {
        //     d3.event.stopPropagation();
        //     updateTooltip(d, d3.select(this).node(), `present-region`, branch_key);

        // })
        // .on("mouseout", d => {
        //     d3.event.stopPropagation();
        //     updateTooltip();
        // })
        // .style('cursor', 'pointer')

        // branch.selectAll('.label').data(d => [d])
        //     .join('text').attr('class', 'label')
        //     .filter(d => d.depth === 1)
        //     .attr('font-size', fontsize)
        //     .selectAll("tspan")
        //     .data(d => d.text)
        //     .join("tspan")
        //     .attr("x", d => d.offset_x)
        //     .attr("y", (d, i) => i * fontsize + d.offset_y)
        //     .text(d => d.name)

        const node = branch.selectAll('.node').data(d => d.children)
            .join('g').attr('class', d => `node ${d.data.id}`)
            .selectAll('.node-g').data(d => [d])
            .join('g').attr('class','node-g hoverable hovering')
            .on("click", d => {
                if(showLegend)return;
                d3.event.stopPropagation();
                updateProfile(d, `present-country`);
            })
            .on("mouseover", function(d) {
                if(showLegend)return;
                d3.event.stopPropagation();
                updateTooltip(d, d3.select(this).node(), `present-country`, treekeys);

            })
            .on("mouseout", d => {
                if(showLegend)return;
                d3.event.stopPropagation();
                updateTooltip();
            })
            // .style('cursor', 'pointer')

        // node.selectAll('.link-branch').data(d => [d])
        //     .join('path')
        //     .attr('class', 'link-branch')
        //     .attr("fill", "none")
        //     .attr("stroke", "#b99068")
        //     .attr("stroke-opacity", 0.4)
        //     .attr("stroke-width", d => d.strokeWidth)
        //     .attr("d", d => d.link)

        node.selectAll('.link-fill').data(d => [d])
            .join('path')
            .attr('class', 'link-fill')
            .attr("fill", "none")
            .attr("stroke", d => d.branch_strokeColor)
            .attr("stroke-opacity", d => d.branch_strokeOpacity)
            .attr("stroke-width", d => d.branch_strokeWidth)
            .attr("d", d => d.link)
            // .on("mouseover", function(d) {
            //     d3.event.stopPropagation();
            //     updateTooltip(d, d3.select(this).node(), `present-country`, branch_key);

            // })
            // .on("mouseout", d => {
            //     d3.event.stopPropagation();
            //     updateTooltip();
            // })
            // .style('cursor', 'pointer')

        node.selectAll('.leaf').data(d => [d])
            .join('path').attr('class', 'leaf')
            .attr('fill', d => d.leaf_fillColor)
            .style('fill-opacity', d => d.leaf_fillOpacity)
            .attr('stroke', d => d.leaf_strokeColor)
            .attr('stroke-width', d => d.leaf_strokeWidth)
            .attr('d', d => d.leave)
            // .on("mouseover", function(d) {
            //     d3.event.stopPropagation();
            //     updateTooltip(d, d3.select(this).node(), `present-country`, snow_key);

            // })
            // .on("mouseout", d => {
            //     d3.event.stopPropagation();
            //     updateTooltip();
            // })
            // .style('cursor', 'pointer')

        node.selectAll('.core').data(d => [d])
            .join('circle').attr('class', 'core')
            .attr('r', d => d.coreR)
            .attr('fill', d => d.coreColor)
            .attr('cx', d => d.a.x)
            .attr('cy', d => d.a.y)
            // .on("mouseover", function(d) {
            //     d3.event.stopPropagation();
            //     updateTooltip(d, d3.select(this).node(), `present-country`, core_key);

            // })
            // .on("mouseout", d => {
            //     d3.event.stopPropagation();
            //     updateTooltip();
            // })
            // .style('cursor', 'pointer')


        // const box = landscape.node().getBBox();
        // svg.attr('viewBox', `${box.x - Math.max((view_w-box.width)*0.5,20)} ${box.y - 40 - Math.max((view_h-box.height)/2,0)} ${Math.max(box.width, view_w) + 40} ${Math.max(box.height, view_h) + 50}`)

    }

    update.size = function(_) {
        if (typeof _ === 'undefined') return _size;
        _size = _;
        return this;
    }
    update.height = function(_) {
        if (typeof _ === 'undefined') return _height;
        _height = _;
        return this;
    }
    update.width = function(_) {
        if (typeof _ === 'undefined') return _width;
        _width = _;
        return this;
    }
    update.radial = function(_) {
        if (typeof _ === 'undefined') return _radial;
        _radial = _;
        return this;
    }
    update.startAngle = function(_) {
        if (typeof _ === 'undefined') return _startAngle;
        _startAngle = _;
        return this;
    }



    return update;
}