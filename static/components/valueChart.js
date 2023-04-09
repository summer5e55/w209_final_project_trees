const valueChart = (_, data) => {
    let node = _;
    let _width = null;
    let _height = null;
    // let _type = 'value';
    let _y_domain = true;
    let _key = 'hpi';
    let _hl_color = false;

    let drawData = JSON.parse(JSON.stringify(data));
    // console.log(node.node(),'indexchart')
    function updateViz(cur_data) {

        const [width, height] = [_width || node.node().clientWidth, _height || node.node().clientHeight];
        // dash = dash || [];

        const unit = indexUnit(_key);
        const font_size = 12;
        const x_range = [font_size * 4, width - font_size * 2];
        const y_range = [height - font_size * 1, font_size * 1 + (unit ? 1 : 0) * 2];

        drawData = drawData.filter(d => d[_key])
        // const y_domain = d3.extent(data, d => d[_key]);
        drawData.sort((a, b) => a[_key] - b[_key]);

        const y_domain = _y_domain ? [0, 100] : d3.extent(drawData, d => d[_key]);

        // console.log(drawData, cur_data)
        // console.log(nestedData)
        const scaleX = d3.scalePoint().domain(drawData.map((d, i) => i)).range(x_range);
        // const scaleY = d3.scaleLinear().domain([0,y_domain[1]]).range(y_range);
        let scaleY = d3.scaleLinear().domain(y_domain).range(y_range).nice();
        let scaleY_ticks = scaleY.ticks(4);

        // const strokeColor = "#585365";
        const strokeColor = "#c1c5cd";

        drawData.forEach((d, i) => {
            d.y = scaleY(d[_key]);
            d.x = scaleX(i);
            d.line = `M${d.x} ${d.y} V${y_range[0]}`;
            d.strokeOpacity = 1;
            d.strokeWidth = 2;
            // d.stroke = 'rgba(255,255,255,0.3)';
            d.stroke = strokeColor;
            d.hl = false;
            // if(_hl_color){
            // if (d.region === cur_data.data.region) d.stroke = cur_data[_hl_color];
            if (d.region === cur_data.data.region) d.stroke = _hl_color;
            if (d.country === cur_data.data.country) d.hl = true;

            // }else{
            //     if(d.name === cur_data.name){
            //         d.stroke = strokeColor;
            //         d.hl = true;
            //     }
            //     d.line = `M${d.x} ${y_range[0]} v${-d.y}`;
            //     d.strokeWidth = 2;
            // }
            if (!d.hl) d.strokeOpacity = 0.4;

            d.strokeDash = d[_key] > 0 ? 'none' : '4 1';
        })

        const svg = node.selectAll('.canvas').data([0]).join('svg')
            .attr('width', width).attr('class', 'canvas')
            .attr('height', height);


        const lines = svg.selectAll('.line').data(drawData)
            .join('g').attr('class', 'line')
        lines.selectAll('.path').data(d => [d])
            .join('path').attr('class', 'path')
            .attr('stroke', d => d.stroke)
            .attr('stroke-width', d => d.strokeWidth)
            .attr('stroke-opacity', d => d.strokeOpacity)
            .attr("stroke-dasharray", d => d.strokeDash)
            .attr('d', d => d.line)

        lines.filter(d => d.hl)
            .selectAll('.text').data(d => [d])
            .join('text').attr('class', 'text')
            .text(d => d[_key])
            .attr('x', d => d.x).attr('y', d => d.y - font_size / 2)
            .attr('text-anchor', 'middle')
            .attr('font-size', font_size)
            .attr('fill', textColor)



        const y_axis = d3.axisLeft()
            .tickValues(scaleY_ticks)
            .tickSizeOuter(0)
            // .tickSizeInner(5)
            // .tickSizeInner((scaleX.range()[1] - scaleX.range()[0]))
            .tickFormat(d3.format(".2s"))
            .scale(scaleY);

        let axis = svg.selectAll('.axis').data([0])
            .join("g").attr('class', 'axis')


        axis.selectAll('.unit').data([unit])
            .join('text').attr('class', 'unit')
            .attr('text-anchor','middle')
            .text(d => d)
            .attr('font-size', font_size)
            .attr('transform', `translate(${x_range[0]-font_size * 0.7}, ${font_size*1})`)


        let axisY = axis.selectAll('.axis-y').data([0]).join("g").attr('class', 'axis-y light')
            .attr('transform', `translate(${x_range[0]-font_size * 0.7}, ${0})`);


        axisY.transition().call(y_axis);

        axisY.selectAll('text').attr('font-size', font_size)

        axis.selectAll('.hl-item').data([
                // { opacity: 1, name: "selected country" },
                { opacity: 1, name: "countries in the sub-region" }
            ])
            .join('g').attr('class', 'hl-item fst-italic').attr('font-size', font_size)
            .attr('transform', (d,i) => `translate(${x_range[0]}, ${font_size*2 + i * font_size})`)
            .html(d => `
                <text x="20">${d.name}</text>
                <path d="M0 ${-font_size * 0.3} h15" stroke="${_hl_color}" stroke-width=2 stroke-opacity="${d.opacity}" />
                `)


    }


    updateViz.width = function(_) {
        if (typeof _ === 'undefined') return _width;
        _width = _;
        return this;
    }
    updateViz.height = function(_) {
        if (typeof _ === 'undefined') return _height;
        _height = _;
        return this;
    }

    updateViz.y_domain = function(_) {
        if (typeof _ === 'undefined') return _y_domain;
        _y_domain = _;
        return this;
    }
    updateViz.key = function(_) {
        if (typeof _ === 'undefined') return _key;
        _key = _;
        return this;
    }
    updateViz.hl_color = function(_) {
        if (typeof _ === 'undefined') return _hl_color;
        _hl_color = _;
        return this;
    }


    return updateViz
}