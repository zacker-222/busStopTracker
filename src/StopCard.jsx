import React from "react";
import { useState } from "react";
import {
    Collapse,
    Button,
    Card,
    Typography,
    CardBody,
  } from "@material-tailwind/react";

const StopCard = ({ stops }) => {

    const [open, setOpen] = useState(false);
    // return (<h1>Hello</h1>)
    return (
        <div className="relative">
            <h6 className="flex">
                <button
                    className="relative w-full p-4 font-semibold text-left transition-all ease-in border-b border-solid cursor-pointer border-slate-100 text-slate-700 rounded-t-1 group text-dark-500"
                    onClick={() => setOpen(!open)}
                >
                    <span className="relative flex w-full flex-row items-end"> <div className="text-right">{stops[0].stpnm}</div> <div className="text-right grow text-green-500">{stops[0].prdtm.split(" ")[1]}</div> </span>
                </button>
            </h6>
            {open ?   <Collapse open={open}>
                    {
                    stops.map((stop, index) => {
                        return (<Card key = {index}>
                        <CardBody className="border-b flex flex-col space-y-0 grow">
                            <Typography color="gray" className="relative flex flex-row items-end "><span>Route:</span> <span className="text-right grow text-green-500">{stop.rt}</span></Typography>
                            <Typography color="gray" className="relative flex flex-row items-end ">Direction: <span className="text-right grow text-green-500">{stop.rtdir}</span></Typography>
                            <Typography color="gray" className="relative flex flex-row items-end ">Predicted Time: <span className="text-right grow text-green-500">{stop.prdtm.split(" ")[1]}</span> </Typography>
                        </CardBody>
                    </Card>)
                    })
                }
                
                </Collapse>
                : null
            }
        </div>
    )
}

export default StopCard;