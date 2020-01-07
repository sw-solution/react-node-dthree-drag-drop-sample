import React, { useEffect, useState } from "react";
import useDimensions from "./useDimensions";
import "./demo.css";
import CustomGraph from "./CustomGraph";
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';


//new
const dummyDatas = [
    { name: "Service name", id: "service1", bgcolor: "#CBF4FF" },
    { name: "Service name", id: "service2", bgcolor: "#CBF4FF" },
    { name: "Service name", id: "service3", bgcolor: "#DAF9D6" },
    { name: "Service name", id: "service4", bgcolor: "#F2F4F6" },
    { name: "Component", id: "component1", bgcolor: "#CBF4FF" },
    { name: "Component", id: "component2", bgcolor: "#CBF4FF" },
    { name: "Component", id: "component3", bgcolor: "#CBF4FF" },
    { name: "Component", id: "component4", bgcolor: "#CBF4FF" },
];

const ÀppDragAndDropDemo = () => {
    const [svgContainerRef, svgSize] = useDimensions();
    const [tasks, setTasks] = useState([]);
    const [tools, setTools] = useState(dummyDatas)
    const [shiftX, setShiftX] = useState(0);
    const [shiftY, setShiftY] = useState(0);

    const onDragOver = (event) => {
        event.preventDefault();
        setShiftX(event.clientX);
        setShiftY(event.clientY);
    };

    const onDragStart = (event, id) => {
        event.dataTransfer.setData("id", id);
    };

    const onDrop = (event) => {
        event.preventDefault();
        let id = event.dataTransfer.getData("id");
        let [selected] = dummyDatas.filter(e => e.id === id);
        if (selected) {
            let newTask = {
                shiftX: (shiftX / document.documentElement.clientWidth) * 100,
                shiftY: shiftY,
                name: selected.name,
                bgcolor: selected.bgcolor,
                id: selected.id + new Date().getTime().toString()
            };
            setTasks([...tasks, newTask]);
        }
        else {
            const buf = [];
            tasks.forEach(element => {
                if (element.id === id) {
                    buf.push({ ...element, shiftX: (shiftX / document.documentElement.clientWidth) * 100, shiftY: shiftY });
                }
                else
                    buf.push(element);
            });
            setTasks(buf);
        }
    };

    const handleScreenshot = () => {
        domtoimage.toBlob(document.getElementById('myCanvas'))
            .then(function (blob) {
                window.saveAs(blob, 'my-node.png');
            });
    }


    const changeTasks = (x, y, taskId) => {
        const buf = [];
        tasks.forEach(element => {
            if (element.id === taskId) {
                buf.push({ ...element, shiftX: (x / document.documentElement.clientWidth) * 100, shiftY: y });
            }
            else
                buf.push(element);
        });
        setTasks(buf);
    }

    useEffect(() => {

    }, [tasks]);

    //new
    const handleFilter = (e) => {
        if (e.target.value !== '') {
            setTools(
                tools.filter(tool => {
                    const regex = new RegExp(`${e.target.value}`, 'i');
                    return tool.name.match(regex)
                })
            )
        }
        else
            setTools(dummyDatas)
    }

    return (
        <div className="container-drag">
            <div className="header">
                Service model name
                <button onClick={handleScreenshot} className="svg-download"> Download Svg </button>
            </div>
            <div className="main">
                <div className="wip"
                    onDragOver={event => onDragOver(event)}
                    onDrop={event => onDrop(event, "wip")}
                >
                    <div style={{ display: 'flex', height: '4%' }}>
                        <div className="catalog-header">Catalog</div>
                        {/* new */}
                        <div className="search-input">
                            <input type="text" onChange={handleFilter} className="search-form" />
                            <i className="fa fa-search search-icon"></i>
                        </div>
                        {/* <SearchwChips
                            chips={tools}
                            onUpdate={handleFilter}
                        /> */}

                    </div>
                    <div className="components">
                        {tools.map((e, index) => {

                            return (
                                <div key={index}
                                    className="tools"
                                    onDragStart={event => onDragStart(event, e.id)}
                                    draggable
                                    style={{ backgroundColor: e.bgcolor, borderRadius: e.name === "Component" ? "50px" : "5px" }}
                                >
                                    {e.name}
                                </div>
                            );
                        }
                        )}
                    </div>
                </div>
                <div className="board"
                    onDragOver={event => onDragOver(event)}
                    onDrop={event => onDrop(event, "complete")}
                    id="myCanvas"
                    ref={svgContainerRef}
                >
                    <span className="task-header">Service model</span>

                    {svgSize.width &&
                        <CustomGraph
                            tasks={tasks}
                            width={svgSize.width - 30} height={svgSize.height - svgSize.top}
                            changeTasks={changeTasks}
                        />
                    }
                    {/* {tasks && tasks.map(e => {

                        return (
                            <div key={e.id}
                                onDragStart={event => onDragStart(event, e.id)}
                                className="draggable"
                                draggable
                                style={{
                                    backgroundColor: e.bgcolor, left: e.shiftX + "%", top: e.shiftY + "px",
                                    borderRadius: e.name === "Component" ? "50px" : "5px", fontSize: "12px", opacity: 0.8
                                }}
                            >
                                {e.name}
                            </div>
                        );
                    }
                    )} */}

                </div>
                <div className="complete">
                    <span className="task-header">Service model</span>
                    <div className="list-board">
                        <div className="section1">
                            <span className="list-header">Service name</span>
                            <div className="sub-component">Component name</div>
                            <div className="sub-component">Component name</div>
                            <div className="sub-component">Component name</div>
                        </div>

                        <div className="section2">
                            <div className="top-component">Component name</div>
                            <div className="top-component">Component name</div>
                            <div className="top-component">Component name</div>
                        </div>

                        <div className="section3">
                            <span className="list-header">Service name</span>
                            <div className="section3">
                                <span className="list-header">Service name</span>
                                <div className="sub-component">Component name</div>
                                <div className="sub-component">Component name</div>
                            </div>
                            <div className="top-component">Component name</div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ÀppDragAndDropDemo;