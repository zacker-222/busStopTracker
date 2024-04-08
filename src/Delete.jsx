import React, { useEffect, useState } from "react";

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

const Delete = () => {
    const [stops, setStops] = useState([]);

    const [update, setUpdate] = useState(false);

    useEffect(() => {
        setStops((localData.get('Tab 1') || []).concat(localData.get('Tab 2') || []));
    }, [update]);
    
    let stopNames = localData.get('map');

    const remove = (stop) => {
        let stops = localData.get('Tab 1') || [];

        stops = stops.filter((item) => item !== stop);

        localData.set('Tab 1', stops);

        stops = localData.get('Tab 2') || [];

        stops = stops.filter((item) => item !== stop);

        localData.set('Tab 2', stops);

    }


    return (
        <div className="flex flex-col space-y-5">
            {
                stops.map((stop, index) => {
                    return (
                        <div key={index} className="flex flex-row m-2 border">
                            <div className="flex-grow p-4">
                                {stopNames[stop]}
                            </div>
                            <div>
                                <button className="border border-radius-1 bg-red-200 p-4" onClick={() => {remove(stop); setUpdate(!update)}   }>Delete</button>
                            </div>
                        </div>
                    )
                })
            }

        </div>
    )
}

export default Delete;