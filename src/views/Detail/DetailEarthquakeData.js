import React, {useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import './DetailEarthquakeData.css';

export default function DetailearthquakeData(){
    //declare history to get params
    const history = useHistory();
    const [detailEarthquakeData, setDetailEarthquakeData] = useState(null);
    // get detail properties from button inside popup
    const properties = history.location.state.detail;
    const accessToken = "pk.eyJ1IjoiZnJhbi1vbW5pdW0iLCJhIjoiY2p2ZGdtbWhyMDU1ZDQwcXUxcmtxNHdrMyJ9.Tc56C3wmFC03GiB3_TXfQA";
    // Epoch time converter.
    const timeConverter = (time, offset) => {
        const d = new Date(time);
        const utc = d.getTime() + d.getTimezoneOffset() * 60000; // This converts to UTC 00:00
        const nd = new Date(utc + 3600000 * offset);
        return nd.toLocaleString();
    };

    useEffect(() => {},[detailEarthquakeData]);

    useEffect(() => {
        getDetailData(properties);
      }, []); // eslint-disable-line react-hooks/exhaustive-deps
      
    //async function to get earthquake detail data.
    const getDetailData = async (url)=>{
        const response = await axios.get(url.detail)
        setDetailEarthquakeData(response);
    }

    return (
        <>
            <div className="flotating-div">
                <div className="content-data">
                    {!detailEarthquakeData 
                    ? 
                        (
                            <CircularProgress color="inherit" />
                        ) 
                    : 
                        (
                            <>
                                <Grid container spacing={2}>
                                    <Grid item xs={4}>
                                        <Card>
                                            <CardContent className="titleCard">
                                                <Typography ><h3>ID</h3></Typography>
                                                <Typography> {detailEarthquakeData.data.id} </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Card>
                                            <CardContent className="titleCard">
                                                <Typography ><h3>Place</h3></Typography>
                                                <Typography> {detailEarthquakeData.data.properties.place} </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Card>
                                            <CardContent className="titleCard">
                                                <Typography ><h3>Title</h3></Typography>
                                                <Typography> {detailEarthquakeData.data.properties.title} </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Card>
                                            <CardContent className="titleCard">
                                                <Typography ><h3>Date</h3></Typography>
                                                <Typography> {timeConverter(detailEarthquakeData.data.properties.time, 0)} </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Card>
                                            <CardContent className="titleCard">
                                                <Typography ><h3>Type</h3></Typography>
                                                <Typography> {detailEarthquakeData.data.properties.type} </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Card>
                                            <CardContent className="titleCard">
                                                <Typography ><h3>Magnitude</h3></Typography>
                                                <Typography> {detailEarthquakeData.data.properties.mag} </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    
                                    <Grid item xs={12}>
                                     <img className="img-static"  alt="img_static_map"
                                        src={'https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+eb0505('+
                                            detailEarthquakeData.data.geometry.coordinates[0]+','+detailEarthquakeData.data.geometry.coordinates[1]+')/'
                                            +detailEarthquakeData.data.geometry.coordinates[0]+','+detailEarthquakeData.data.geometry.coordinates[1]+
                                            ',9,0/500x400?access_token='+accessToken}>
                                        </img>
                                       
                                    </Grid>
                                    
                                </Grid>
                               
                             
                                
                                <Link to="/" className="button-close">
                                    <Button variant="contained" color="secondary">
                                        X
                                    </Button>
                                </Link>
                            </>
                        )
                    }
                </div>
            </div>
        </>
    )
}