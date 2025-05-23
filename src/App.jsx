import logo from './assets/logo.png';
import { useState } from 'react';
import NavTabs from './components/NavTabs';
import FileInput from './components/FileInput';
import ManualInput from './components/ManualInput';
import MapDisplay from './components/MapDisplay';
import RouteDetails from './components/RouteDetails';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('input');
  const [routeData, setRouteData] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);

  const handleRouteCalculated = (data, info) => {
    setRouteData(data);
    setRouteInfo(info);
    setActiveTab('map');
  };

  const resetCalculation = () => {
    setRouteData(null);
    setRouteInfo(null);
    setActiveTab('input');
  };

  return (
    <div className="app-container dark">
      <header className="app-header">
        <img src={logo} alt="Logo" className="logo" />
        <h1>Rutas entre Departamentos de Guatemala</h1>
      </header>

      <NavTabs activeTab={activeTab} setActiveTab={setActiveTab} hasRoute={!!routeData} />

      <div className="tab-content">
        {activeTab === 'input' && (
          <div className="input-options">
            <FileInput onRouteCalculated={handleRouteCalculated} />
            <ManualInput onRouteCalculated={handleRouteCalculated} />
          </div>
        )}

        {activeTab === 'map' && routeData && (
          <MapDisplay routeData={routeData} />
        )}

        {activeTab === 'details' && routeInfo && (
          <RouteDetails routeInfo={routeInfo} />
        )}

        {activeTab === 'exit' && (
          <div className="exit-section">
            <h2>¿Desea calcular otra ruta?</h2>
            <button onClick={resetCalculation}>Nuevo Cálculo</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
