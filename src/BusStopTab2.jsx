import React, { useEffect } from "react";
import { useState } from "react";
import StopCard from "./StopCard";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const localData = {
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    get(key) {
        const stored = localStorage.getItem(key);
        return stored == null ? [] : JSON.parse(stored);
    },
    remove(key, value) {
        localStorage.removeItem(key);
    }
};

const client = new ApolloClient({
    uri: 'https://busstop-769bfe5a671a.herokuapp.com/',
    cache: new InMemoryCache(),
});


function combineData(stopsData) {
    stopsData = stopsData || [];
    let stops = {};
    stopsData.forEach(stop => {
        if (stops[stop.stpid] === undefined) {
            stops[stop.stpid] = [];
        }
        stops[stop.stpid].push(stop);
    });

    let stopList = [];
    for (let key in stops) {
        stopList.push(stops[key]);
    }
    return stopList;
}


const getListString = (list) => {
    let str = '[';
    list.forEach((item, index) => {
        str += '"'
        str += item;
        str += '"'
        if (index !== list.length - 1) {
            str += ',';
        }
    });
    str += ']';
    return str;
}

const BusStopTab2 = ({tabid}) => {

    const [tab, setTab] = useState(tabid);
    // setTab(tabid);


    let stopsIds = localData.get(`Tab ${tabid+1}`) || [''];

    const [stopsData, setStopsData] = useState([]);

    useEffect(() => {
        console.log("quering");
        client
            .query({
                query: gql(`
                    query Query {
                        live(stpids: ${getListString(stopsIds)}) {
                            stpid,
                            stpnm,
                            prdtm,
                            rt,
                            rtdir
                        }
                    }
                `)
            })
            .then(result => {
                console.log(result.data.live);  
                setStopsData(combineData(result.data.live));
            });
    }
    , [tab]);



    return (
        <div>
            {   stopsData.length === 0 ? <div className="text-center text-2xl">No buses available or No Busstops Added</div> :
                stopsData.map((stop, index) => {
                    return (<StopCard key={index} stops={stop} />)
                })
            }
        </div>
    )
}




export default BusStopTab2;