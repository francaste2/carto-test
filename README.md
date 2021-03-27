# Earthquakes test - carto

## Description

This is the resolution for Earthquakes Map Visualizer.

## Setup 

```sh
cd carto-test
npm install
npm run
```
Go to http://localhost:3000 in your browser


## Plugins

| Plugin | Why |
| ------ | ------ |
| mapbox-gl | Mapbox GL JS is a JavaScript library that uses WebGL to render interactive maps from vector tiles and Mapbox styles. |
| axios | Axios is easy to use for get(async, promises) data API |
| react-router-dom | Manage the routes |
| material-ui | Use material components to responsive web-app |

## TODO

- Implement a client cache (localStorage) to reduce API calls, this TODO increment the performace.
- Install and use Redux to make a global store to delete the state.params
- Make more magnitudes into filter colors.
- Layer selector, to change map style and hide/show tectonic plates layer.
