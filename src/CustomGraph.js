import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "./demo.css";
import PropTypes from "prop-types";

const CustomGraph = ({ tasks, height, width, changeTasks }) => {
    const svgRef = useRef();

    useEffect(() => {

        d3.select(svgRef.current)
            .selectAll("*")
            .remove();

        const margin = { top: 10, right: 10, bottom: 10, left: 10 },
            w = width - margin.left - margin.right,
            h = height - margin.top - margin.bottom;

        //new
        const zoom = d3.zoom()
            .scaleExtent([1 / 2, 4])
            .on("zoom", zoomed);

        const svg = d3
            .select(svgRef.current)
            .call(zoom) //new 
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        const x = d3
            .scaleLinear()
            .domain([0, w])
            .rangeRound([0, w]);

        const y = d3
            .scaleLinear()
            .domain([h, 0])
            .range([h, 0]);

        const curvedLine = d3.line()
            .curve(d3.curveCardinal)
            .x((value) => x(document.documentElement.clientWidth * (value.shiftX - 23) / 100))
            .y(value => y(value.shiftY - 110));


        svg
            .append("path")
            .datum(tasks)
            .attr("fill", "none")
            .attr("stroke", "#C0C6CE")
            .attr("stroke-width", 2)
            // .attr("stroke-dasharray", "3")
            .attr("d", value => curvedLine(value));

        //new 
        function zoomed() {
            svg.attr('transform', `translate(${d3.event.transform.x}, ${d3.event.transform.y}) scale(${d3.event.transform.k})`);
        };

        function transition(zoomLevel) {
            svg.transition()
                .delay(50)
                .duration(500)
                .call(zoom.scaleBy, zoomLevel);
        }
        //////
        svg
            .selectAll("rect")
            .data(tasks)
            .enter()
            .append("rect")
            .attr("id", d => { return d.id; })
            .attr("x", d => x(document.documentElement.clientWidth * (d.shiftX - 28) / 100))
            .attr("y", d => y(d.shiftY - 130))
            .attr("rx", d => { return d.name === "Component" ? 20 : 5; })
            .attr("ry", d => { return d.name === "Component" ? 20 : 5; })
            .attr("width", 160)
            .attr("height", 38)
            .attr("fill", d => { return d.bgcolor; })
            .attr("cursor", "pointer")
            .call(d3.drag()
                .on("drag", function () {
                    changeTasks(d3.event.x, d3.event.y, d3.select(this)._groups[0][0].id);
                })
            );

        svg
            .selectAll("names")
            .data(tasks)
            .enter()
            .append("text")
            .attr("class", "names")
            .attr("x", d => x(document.documentElement.clientWidth * (d.shiftX - 23) / 100))
            .attr("y", d => y(d.shiftY - 110))
            .attr("text-anchor", "middle")
            .attr("font-size", 12)
            .attr("fill", "black")
            .text(d => { return d.name; });

        d3.selectAll("button")
            .on("click", function () {
                if (this.id === 'zoom_in') {
                    transition(1.2); // increase on 0.2 each time
                }
                if (this.id === 'zoom_out') {
                    transition(0.8); // deacrease on 0.2 each time
                }
            })

    }, [tasks, width, height]);


    return (
        <>
            <svg ref={svgRef} width={width} height={height} />
            {/*  */}
            <div className="buttons">
                <button id="zoom_in">+</button>
                <button id="zoom_out">-</button>
            </div>
        </>
    );
};

CustomGraph.propTypes = {
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    changeTasks: PropTypes.func,
    tasks: PropTypes.array,
};

export default CustomGraph;
