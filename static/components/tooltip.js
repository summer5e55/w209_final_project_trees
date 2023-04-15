const updateTooltip = (_data, dom, chart, keys) => {
    // console.log(data,dom)
    if (_data) {
        let html = "";

        switch (chart) {
            case 'future':

                html = `
                <div class="d-flex flex-column fs-7">
                    <div class="d-flex flex-column fw-light">
                        <div class="fs-7 fw-bold text-capitalize" style="color:${_data.color}">${_data.type}</div>
                        <div class="fs-5 lh-1 mb-1">${_data.name}</div>
                        <div class="fs-7">${_data['Frontier']}</div>
                    </div>
                    <div class="border-top mt-2 pt-1 col-12">
                        <div class="fs-7 d-flex justify-content-between">
                            <div class="pe-2 fw-light">Buzz</div>
                            <div>${_data.index}</div>
                        </div>
                    </div>
                    <div class="border-top text-center mt-1 pt-1 col-12">
                        <p class="fs-7 text-muted">Click to read more</p>
                    </div>
                </div>
                `

                break;
            case 'past':
                const unit = indexUnit(_data.parent.data.name) || '';
                html = `
                    <div class="d-flex flex-column fs-7">
                        <div class="d-flex flex-column">
                            <div class="fs-6 fw-light">
                                ${indexName(_data.parent.data.name)}
                            </div>
                        </div>
                        <div class="border-top mt-2 pt-1 col-12">
                            <div class="fs-7 d-flex justify-content-between">
                                <div class="pe-2">${_data.data.name}</div>
                                <div>${_data.data.value}<span class="">${unit}</span></div>
                            </div>
                        </div>
                    </div>
                `
                break;
            case 'present-country':
            // <div class="legend me-1" style="background-image:url(${icon})"></div>
                html = `
                    <div class="d-flex flex-column fs-7">
                        <div class="d-flex flex-column fw-light">
                            <div class="fs-7">${_data.data.region}</div>
                            <div class="fs-5">${_data.data.country}</div>
                        </div>
                        <div class="border-top mt-2 pt-1 col-12">
                            ${keys.map((d,i) => {
                                let icon = "./static/imgs/branch.png";
                                if (i == 1) {
                                    // icon = `leaf_${seasonsData[currentSeasonId].id}`;
                                    icon = seasonsData[currentSeasonId].id ==="winter" ? getSnowicon(_data.leaf_fillColor) : getLeaficon(_data.leaf_fillColor);
                                }
                                if (i == 2) {
                                    // icon = 'core';
                                    const typeColor = typeof _data.coreColor === 'string'
                                    icon = getCoreicon(typeColor ? _data.coreColor: _data.coreColor.hex())
                                }
                                let unit = indexUnit(d) || '';
                                return ` 
                                    <div class="fs-7 d-flex justify-content-between">
                                        <div class="pe-2 fw-light d-flex">
                                            <img class="legend me-1" src="${icon}">
                                            <div>${indexName(d)}</div>
                                        </div>
                                        <div>${_data.data[d]}<span class="">${unit}</span></div> 
                                    </div>
                                `
                            }).join('')}
                        </div>
                        <div class="border-top text-center mt-1 pt-1 col-12">
                            <p class="fs-7 text-muted">Click leaf to read more</p>
                        </div>
                    </div>
                `
                break;
                // case 'present-country':
                //     html = `
                //         <div class="d-flex flex-column fs-7">
                //             <div class="d-flex flex-column fw-lighter">
                //                 <div class="fst-italic fs-7">
                //                     ${data.data.region}
                //                 </div>
                //                 <div>${data.data.country}</div>
                //                 <div class="fs-7">
                //                     <span class="me-1 fst-italic">${indexName(key)}</span>
                //                     <span>${data.data[key]}</span>
                //                 </div>
                //             </div>
                //             <div class="border-top text-center mt-2 pt-1 col-12">
                //                 <p class="fs-7 text-muted">Click to read more</p>
                //             </div>
                //         </div>
                //     `
                // break;
                // case 'present-region':
                //     html = `
                //         <div class="d-flex flex-column fs-7">
                //             <div class="d-flex flex-column fw-lighter">
                //                 <div>${indexName(data.data.name)}</div>
                //                 <div class="fs-7">
                //                     <span class="me-1 fst-italic">${key}</span>
                //                     <span>Avg. ${data.data[key]}</span>
                //                 </div>
                //             </div>
                //         </div>
                //     `
                // break;
            default:
                html = ``
        }

        tooltipContent.html(html)

        tooltip.classed('d-none', false);

        const nodeDomSize = dom.getBoundingClientRect();
        let [x, y] = [nodeDomSize.x, nodeDomSize.y]
        const tooltipSize = tooltip.node().getBoundingClientRect();

        if (x > w - tooltipSize.width - nodeDomSize.width) {
            x = x - tooltipSize.width - 10
        } else {
            x = x + nodeDomSize.width + 10;
        }

        tooltip.style('top', `${y+10}px`)
            .style('left', `${x}px`)


    } else {
        tooltip.classed('d-none', true)
    }
}
