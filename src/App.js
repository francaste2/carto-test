
import './App.css';
import { Route, Switch } from "react-router-dom";
import BaseMap from './components/BaseMap';
import DetailearthquakeData from './views/Detail/DetailEarthquakeData';
import NavMenu from './views/Menu/NavMenu';
function App() {
  return (
    <>
      <NavMenu/> 
      <BaseMap/>
      <Switch className="App-header">
        <Route path="/Detail" exact component={DetailearthquakeData} />
      </Switch>
    </>
    
  );
}

export default App;
