import React from "react";
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import { useEffect, useState } from "react";

const localData = {
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    get(key) {
        const stored = localStorage.getItem(key);
        return stored == null ? null : JSON.parse(stored);
    },
    remove(key, value) {
        localStorage.removeItem(key);
    }
};

const client = new ApolloClient({
    uri: 'https://busstop-769bfe5a671a.herokuapp.com/',
    cache: new InMemoryCache(),
  });

const Edit = () => {

    const [routes, setRoutes] = useState([]);
    const [curState, setCurState] = useState(0);
    const [route, setRoute] = useState(null);
    const [dirs, setDirs] = useState(null);
    const [dir, setDir] = useState(null);
    const [stops, setStops] = useState(null);
    const [stops1, setStops1] = useState(null);
    const [stops2, setStops2] = useState(null);
    const [stop, setStop] = useState(null);
    const [tab, setTab] = useState(null);
    const [stopName, setStopName] = useState(null);

    useEffect(() => {
        client
          .query({
            query: gql`
            query Query {
                routes {
                  rt
                }
              }
              
            `
          })
          .then(result => {setRoutes(result.data.routes); console.log(result.data.routes)});
      }, []);

    const update = (data) => {
        console.log(data);
        if(data.dir2){
            setDirs([data.dir1, data.dir2]);
            setStops1(data.stops1);
            setStops2(data.stops2);
        }
        else{
            setDirs([data.dir1]);
            setStops1(data.stops1);
        }
        
    }

    useEffect(() => {
        if (route && route !== "Choose a Route") {
            client
            .query({
                query: gql`
                query Query {
                    route(rt: "${route}") {
                        dir1,
                        dir2,
                        stops1{
                            stpid,
                            stpnm,
                        }
                        stops2{
                            stpid,
                            stpnm,
                        }
                    }
                }
                `
            })
            .then(result => {update(result.data.route); console.log(result.data.route); setCurState(1);});
        }else{
            setCurState(0);
        }
    }
    , [route]);

    useEffect(() => {
        if (dir && dirs && dir !== "Choose a Direction") {
            console.log(curState);
            console.log(dirs);
            console.log(dir);
            if(dirs.length === 1){
                setStops(dirs[0] === dirs[0] ? stops1 : stops2);
            }else{
                if(dir === dirs[0]){
                    setStops(stops1);
                }else{
                    setStops(stops2);
                }
            }
            setCurState(2);
        }else{
            if(dirs){
                setCurState(1);
            } 
        }
    }
    , [dir]);

    useEffect(() => {
        if (stop && stop !== "Choose a Stop") {
            console.log(stop);
            setCurState(3);
        }
    }
    , [stop]);

    useEffect(() => {
        if (tab && tab !== "Choose a Tab") {
            setCurState(4);
        }
    }
    , [tab]);


    const addStop = () => {
        let stops = localData.get(tab) || [];
        let stopNames = localData.get("map") || {};
        stopNames[stop] = stopName;
        stops.push(stop);
        console.log(stops);
        console.log(stopNames);
        localData.set(tab, stops);
        localData.set("map", stopNames);
        setCurState(0);
    }





    
    return (
        <div className="flex flex-col space-y-4">
            <form className="max-w-sm mx-auto my-2">
            <label for="routes" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select a Route</label>
            <select id="routes" onChange={(e) => setRoute(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" >
                <option selected>Choose a Route</option>
                {routes.map((route, index) => {
                    return <option key={index}>{route.rt}</option>
                })}
            </select>
            </form>

            {
                curState > 0 ?
                    <form className="max-w-sm mx-auto my-2">
                    <label for="dir" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select a Direction</label>
                    <select id="dir" onChange={(e) => setDir(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" >
                        <option selected>Choose a Direction</option>
                        {dirs.map((dir, index) => {
                            return <option key={index}>{dir}</option>
                        })}
                    </select>
                    </form>
                : null
            }

            {
                curState > 1 ?
                    <form className="max-w-sm mx-auto my-2">
                    <label for="stop" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select a Stop</label>
                    <select id="stop" onChange={(e) => {setStop(e.target.value);setStopName(e.target.options[e.target.selectedIndex].textContent) ; console.log(e.target.options[e.target.selectedIndex])}} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" >
                        <option selected value="none">Choose a Stop</option>
                        {stops.map((stop, index) => {
                            return <option key={index} value={stop.stpid}>{stop.stpnm}</option>
                        })}
                    </select>
                    </form>
                : null
            }

            {
                curState > 2 ?
                    <form className="max-w-sm mx-auto my-2">
                    <label for="tab" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select a Tab</label>
                    <select id="tab" onChange={(e) => setTab(e.target.value) } className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" >
                        <option selected>Choose a Tab</option>
                        <option>Tab 1</option>
                        <option>Tab 2</option>
                    </select>
                    </form>
                : null
            }

            {
                curState > 3 ?
                    <button onClick={addStop} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-auto">Add Stop</button>
                : null
            }
        </div>
    )
}

export default Edit;
