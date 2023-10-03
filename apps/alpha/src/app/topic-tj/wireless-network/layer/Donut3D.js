/**
 * 3D饼图绘制js
 */

import * as d3 from 'd3';

const pieTop = (d, rx, ry, ir) => {
    if (d.endAngle - d.startAngle == 0) return "M 0 0";
    let sx = rx * Math.cos(d.startAngle),
        sy = ry * Math.sin(d.startAngle),
        ex = rx * Math.cos(d.endAngle),
        ey = ry * Math.sin(d.endAngle);

    let ret = [];
    ret.push("M", sx, sy, "A", rx, ry, "0", (d.endAngle - d.startAngle > Math.PI ? 1 : 0), "1", ex, ey, "L", ir * ex, ir * ey);
    ret.push("A", ir * rx, ir * ry, "0", (d.endAngle - d.startAngle > Math.PI ? 1 : 0), "0", ir * sx, ir * sy, "z");
    return ret.join(" ");
}

const pieOuter = (d, rx, ry, h) => {
    let startAngle = (d.startAngle > Math.PI ? Math.PI : d.startAngle);
    let endAngle = (d.endAngle > Math.PI ? Math.PI : d.endAngle);

    let sx = rx * Math.cos(startAngle),
        sy = ry * Math.sin(startAngle),
        ex = rx * Math.cos(endAngle),
        ey = ry * Math.sin(endAngle);

    let ret = [];
    ret.push("M", sx, h + sy, "A", rx, ry, "0 0 1", ex, h + ey, "L", ex, ey, "A", rx, ry, "0 0 0", sx, sy, "z");
    return ret.join(" ");
}

const pieInner = (d, rx, ry, h, ir) => {
    let startAngle = (d.startAngle < Math.PI ? Math.PI : d.startAngle);
    let endAngle = (d.endAngle < Math.PI ? Math.PI : d.endAngle);

    let sx = ir * rx * Math.cos(startAngle),
        sy = ir * ry * Math.sin(startAngle),
        ex = ir * rx * Math.cos(endAngle),
        ey = ir * ry * Math.sin(endAngle);

    let ret = [];
    ret.push("M", sx, sy, "A", ir * rx, ir * ry, "0 0 1", ex, ey, "L", ex, h + ey, "A", ir * rx, ir * ry, "0 0 0", sx, h + sy, "z");
    return ret.join(" ");
}

const getPercent = (d) => {
    return d.data.value + '%'
}

const transition = (id, data, rx, ry, h, ir) => {
    function arcTweenInner(a) {
        let i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function (t) { return pieInner(i(t), rx + 0.5, ry + 0.5, h, ir); };
    }
    function arcTweenTop(a) {
        let i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function (t) { return pieTop(i(t), rx, ry, ir); };
    }
    function arcTweenOuter(a) {
        let i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function (t) { return pieOuter(i(t), rx - .5, ry - .5, h); };
    }
    function textTweenX(a) {
        let i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function (t) { return 0.6 * rx * Math.cos(0.5 * (i(t).startAngle + i(t).endAngle)); };
    }
    function textTweenY(a) {
        let i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function (t) { return 0.6 * rx * Math.sin(0.5 * (i(t).startAngle + i(t).endAngle)); };
    }

    let _data = d3.pie().sort(null).value(function (d) { return d.value; })(data);

    d3.select("#" + id).selectAll(".innerSlice").data(_data)
        .transition().duration(750).attrTween("d", arcTweenInner);

    d3.select("#" + id).selectAll(".topSlice").data(_data)
        .transition().duration(750).attrTween("d", arcTweenTop);

    d3.select("#" + id).selectAll(".outerSlice").data(_data)
        .transition().duration(750).attrTween("d", arcTweenOuter);

    // d3.select("#" + id).selectAll(".percent").data(_data).transition().duration(750)
    //     .attrTween("x", textTweenX).attrTween("y", textTweenY).text(getPercent);
}

const draw = (id, data, x /*center x*/, y/*center y*/,
    rx/*radius x*/, ry/*radius y*/, h/*height*/, ir/*inner radius*/) => {

    let _data = d3.pie().sort(null).value(function (d) { return d.value; })(data);
    

    let slices = d3.select("#" + id).append("g").attr("transform", "translate(" + x + "," + y + ")")
        .attr("class", "slices")
        .on('mouseover', function (d) {
            const { data } = d.target.__data__;
            let tooltip = d3.select('#wirelessContainer').append('div').attr('class', 'tooltip')
            tooltip.html(`
                      <p style="margin: 0; line-height: 18px; font-size: 12px;">
                          <span style="display: inline-block; width: 45px; color: #61d6ff; white-space: nowrap;">BBU数：</span>
                          <span style="color: #1eeaff; font-weight: 600;">${data.numWan}</span>
                      </p>
                      <p style="margin: 0;line-height: 18px; font-size: 12px;">
                          <span style="display: inline-block; width: 45px; color: #61d6ff; white-space: nowrap;">占比：</span>
                          <span style="color: #1eeaff; font-weight: 600;">${data.value}%</span>
                      </p>
                  `)
                .style('position', 'fixed')
                .style('padding', '3px 5px')
                .style('z-index', '999')
                .style('border', '1px solid #20D3FF')
                .style('background', '#000')
                .style('border-radius', '3px')
                .style('left', `${d.pageX - 54}px`)
                .style('top', `${d.pageY - 64}px`)

            const quotesDonut = document.querySelector('#quotesDonut')
            quotesDonut.addEventListener('mousemove', (e) => { moveTooltip(e, tooltip) })
        })
        .on('mouseout', function (d) {
            d3.selectAll(".tooltip").remove()
            const quotesDonut = document.querySelector('#quotesDonut')
            quotesDonut.removeEventListener('mousemove', moveTooltip)
        });

    // slices.selectAll(".innerSlice").data(_data).enter().append("path").attr("class", "innerSlice")
    //     .style("fill", function (d) { return d3.hsl(d.data.color).darker(0.7); })
    //     .attr("d", function (d) { return pieInner(d, rx + 0.5, ry + 0.5, h, ir); })
    //     .each(function (d) { this._current = d; });

    slices.selectAll(".topSlice").data(_data).enter().append("path").attr("class", "topSlice")
        .style("fill", function (d) { return d.data.color; })
        .style("stroke", function (d) { return d.data.color; })
        .attr("d", function (d) { return pieTop(d, rx, ry, ir); })
        .each(function (d) { this._current = d; });

    slices.selectAll(".outerSlice").data(_data).enter().append("path").attr("class", "outerSlice")
        .style("fill", function (d) { return d3.hsl(d.data.color).darker(0.7); })
        .attr("d", function (d) { return pieOuter(d, rx - .5, ry - .5, h); })
        .each(function (d) { this._current = d; });

    // slices.selectAll(".percent").data(_data).enter().append("text").attr("class", "percent")
    //     .attr("x", function (d) { return 0.6 * rx * Math.cos(0.5 * (d.startAngle + d.endAngle)); })
    //     .attr("y", function (d) { return 0.6 * ry * Math.sin(0.5 * (d.startAngle + d.endAngle)); })
    //     .text(getPercent).each(function (d) { this._current = d; });
}

// tooltip跟随鼠标移动事件
const moveTooltip = (e, tooltip) => {
    const event = e || window.event
    const widthWidth = window.innerWidth;
    tooltip
        .style('transform-origin', `0% 0%`)
        .style('left', `${(event.clientX * (1 / (widthWidth / 1920)) - 54)}px`)
        .style('top', `${(event.clientY * (1 / (widthWidth / 1920)) - 64)}px`)
}

export default {
    transition,
    draw
}