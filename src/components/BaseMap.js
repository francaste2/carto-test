import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import './BaseMap.css';
import tectonicPlates from '../data/TectonicPlates'
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useLocation } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

const BaseMap = () => {
    const history = useHistory();
    // map container to ref
    const mapContainerRef = useRef(null);
    const buttonRef = useRef(null);
    // lat - long to useState to reactive
    const [lng, setLng] = useState(5);
    const [lat, setLat] = useState(34);
    const [zoom, setZoom] = useState(1.5);
    // earthquakeData - store with all features. (watchers)
    const [earthquakeData, setEarthquakeData] = useState(null);
    // use state to get/params
    const { state } = useLocation();
    const [loadingEarthquakes, setLoadingEarthquake] = useState(null);

    let map = null;

    useEffect(() => {
        if(earthquakeData){
            if(map === null){
                map = new mapboxgl.Map({
                    container: mapContainerRef.current,
                    style: 'mapbox://styles/mapbox/dark-v10',
                    center: [lng, lat],
                    zoom: zoom
                });
                // Add navigation control (the +/- zoom buttons)
                map.addControl(new mapboxgl.NavigationControl(), 'top-right');
            }
            //Conditionals to change color by magnitude.
            var mag1 = ['<', ['get', 'mag'], 2];
            var mag2 = ['all', ['>=', ['get', 'mag'], 2], ['<', ['get', 'mag'], 3]];
            var mag3 = ['all', ['>=', ['get', 'mag'], 3], ['<', ['get', 'mag'], 4]];
            var mag4 = ['all', ['>=', ['get', 'mag'], 4], ['<', ['get', 'mag'], 5]];
        // var mag5 = ['>=', ['get', 'mag'], 5]; 
            map.on('load', ()=> {
                // add tectonic plates source to map
                map.addSource('tectonic', {
                    'type': 'geojson',
                    'data': tectonicPlates
                });
                // add earthquakesData source to map
                map.addSource('earthquakes', {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features': earthquakeData
                    }
                });
                // add Layer in map id: tectonic
                map.addLayer({
                    'id': 'tectonic',
                    'type': 'line',
                    'source': 'tectonic',
                    'layout': {
                        'visibility': 'visible',
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    'paint': {
                    'line-color': '#FF9B00',
                    'line-width': 1
                    }
                });
                // add Layer in map id: earthquakes
                map.addLayer({
                    'id': 'earthquakes',
                    'type': 'circle',
                    'source': 'earthquakes',
                    'paint': {
                    'circle-radius':  ['*', ['get','mag'],  2.5] ,
                    'circle-color': [
                        'case',
                        mag1, "#ffffb2",
                        mag2, "#fed976", 
                        mag3, "#feb24c",
                        mag4, "#f03b20","#bd0026"
                        ]
                    }

                });
                // interaction to change pointer icon over
                map.on('mouseenter', 'earthquakes', function () {
                    map.getCanvas().style.cursor = 'pointer';
                    });
                // add click control layer, to display a popup / flyto
                map.on('click', 'earthquakes', function (e) { 
                    var coordinates = e.features[0].geometry.coordinates.slice();
                    var mag = e.features[0].properties.mag;
                    var location = e.features[0].properties.place;
                    var properties = e.features[0].properties;
                    map.flyTo({
                        // These options control the ending camera position: centered at
                        // the target, at zoom level 9, and north up.
                        center: e.features[0].geometry.coordinates,
                        zoom: 7,
                        bearing: 0,
                        // These options control the flight curve, making it move
                        // slowly and zoom out almost completely before starting
                        speed: 1, // make the flying slow
                        curve: 1, // change the speed at which it zooms out
                        // this animation is considered essential with respect to prefers-reduced-motion
                        essential: true
                    });
                    
                    // Ensure that if the map is zoomed out such that multiple
                    // copies of the feature are visible, the popup appears
                    // over the copy being pointed to.
                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                    }
                    //add popup with detail button.
                    new mapboxgl.Popup()
                        .setLngLat(coordinates)
                        .setHTML(`<h2 style="text-align:center">Description</h2> 
                                <p> <h3>Magnitude:</h3>   ${mag}</p>
                                <p> <h3>Location: </h3> ${location} </p>
                                <div style="text-align:center">
                                    <button 
                                    class="btn" 
                                    style="  
                                        background-color: #f7cf19; 
                                        color: black;
                                        border: none;
                                        padding: 15px 32px;
                                        text-align: center;
                                        text-decoration: none;
                                        display: inline-block;
                                        font-size: 12px;
                                        margin: 4px 2px;
                                        cursor: pointer;" 
                                    ref=${buttonRef.current}>Detail data</button>
                                </div>
                                `)
                        .addTo(map);
                        // get buttonclick to push data to detail view
                        const btn = document.getElementsByClassName("btn")[0];
                        btn.addEventListener("click", () => {
                            history.push({pathname:"/Detail",state:{detail: properties}});
                        })
                    });
                    
            });
        
            //Function on Move.
            map.on('move', () => {
                setLng(map.getCenter().lng.toFixed(4));
                setLat(map.getCenter().lat.toFixed(4));
                setZoom(map.getZoom().toFixed(2));
                });
            // Clean up on unmount
            return () => map.remove(); 
        }
    },[earthquakeData]);
    // state control to find earthquakes filtered by date
    useEffect(() => {
        if(!state){return}
        //control dateForm to render new date, and loading when fetchdata
        if(state.date !== undefined){
            setLoadingEarthquake(true);
            getEarthquakeData(state.date[0], state.date[1])
        }
    }, [state]);
    // We can get a specific range of time, by default render this dates.
    useEffect(() => {
        setLoadingEarthquake(true);
        getEarthquakeData('2017-10-01', '2017-10-16');
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  /**
   * @funtion async getEarthquakeData()
   * @param {date_from} from 
   * @param {date_to} to
   * 
   * function to get earthquakes from a especific data range.
   * 
   * @returns FeatureObject
   *  
   */
    const getEarthquakeData  = async (from, to) => {
        const response = await axios.get(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${from}&endtime=${to}`);
        
        //setData to listener
        setEarthquakeData(response.data.features.map((feature)=>{ 
            const resDataFeature =  
            {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [
                        feature.geometry.coordinates[0],                
                        feature.geometry.coordinates[1]                
                    ]
                },
                properties: feature.properties
            }
            return resDataFeature; 
        })); 
        //setLoading to false
        setLoadingEarthquake(false);
    }
    
  return (
    <div>
      <div className='sidebarStyle'>
        <div>
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
      </div>
      
        {!earthquakeData 
            ? 
                (
                    <>
                        <div className="loading">
                            <CircularProgress  color="inherit" />
                        </div>
                    </>
                ) 
            : 
                (   <>
                        <div className='map-container' ref={mapContainerRef} /> 
                        {loadingEarthquakes == true ? (<div className="loading"> <CircularProgress  color="inherit" /> </div>) : (<div></div>)}
                        <div className="map-overlay" id="legend">
                        <small> Magnitude </small>
                            <div>
                                <span className="legend-key lg1"></span>
                                <span>0 - 1</span>
                            </div>
                            <div>
                                <span className="legend-key lg2"></span>
                                <span>1 - 2 </span>
                            </div>
                            <div>
                                <span className="legend-key lg3"></span>
                                <span>2 - 3</span>
                            </div>
                            <div>
                                <span className="legend-key lg4"></span>
                                <span>3 - 4</span>
                            </div>
                            <div>
                                <span className="legend-key lg5"></span>
                                <span>4 - 5</span>
                            </div>
                            <div>
                                <span className="legend-key lg5"></span>
                                <span>+5</span>
                            </div>
                        
                        </div>
                    </>
                )
        }
    </div>
  );
};

export default BaseMap;