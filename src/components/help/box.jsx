import React from 'react';
import './box.css';
import TableLineChart from './linechart';


function Box({index, params}) {
    return (
        <div className="box">
            <h1>{index} {params}</h1>
        </div>
    )
}

function BoxTableLineChart({lastData}) {
    return (
        <div className="box">
            <TableLineChart lastData={lastData}/>
        </div>
    )
}

function BoxController({controller}) {
    return (
        <div className="box">
        </div>
    )
}

export { Box, BoxTableLineChart, BoxController };