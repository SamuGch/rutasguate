import { useState, useEffect, useCallback } from 'react';
import { GoogleMap, DirectionsService, DirectionsRenderer, LoadScript } from '@react-google-maps/api';
import { generateOutputFile } from '../utils/apiHelpers';
import RouteDetails from './RouteDetails'; // Asegúrate de importar RouteDetails

// Declarar el array de librerías fuera del componente para evitar recreaciones
const GOOGLE_MAPS_LIBRARIES = ['places']; // Solo necesitas 'places' si la usas, quita 'routes'

const mapContainerStyle = {
  width: '100%',
  height: '500px'
};

const defaultCenter = {
  lat: 15.6359,
  lng: -90.5069
};

const MapDisplay = ({ routeData }) => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [routeDetails, setRouteDetails] = useState(null); // Estado para los detalles de la ruta
  const [showDetails, setShowDetails] = useState(false); // Estado para mostrar/ocultar detalles

  const directionsCallback = useCallback((result, status) => {
    if (status === 'OK') {
      setResponse(result);
      setError(null);
      
      // Generar los datos de salida y guardarlos en el estado
      try {
        const outputData = generateOutputFile(result, routeData);
        setRouteDetails(outputData);
      } catch (error) {
        console.error('Error generando outputData:', error);
        
        // Fallback: crear datos básicos manualmente
        if (result && result.routes && result.routes[0]) {
          const route = result.routes[0];
          const legs = route.legs[0];
          
          const fallbackData = {
            origen: routeData?.Origen?.Ciudad || 'Origen desconocido',
            destino: routeData?.Destino?.Ciudad || 'Destino desconocido',
            distancia: legs?.distance?.text || 'N/A',
            duracion: legs?.duration?.text || 'N/A', 
            pasos: legs?.steps?.map(step => ({
              instrucciones: step.instructions || 'Sin instrucciones',
              distancia: step.distance?.text || 'N/A',
              duracion: step.duration?.text || 'N/A'
            })) || [],
            fecha: new Date().toISOString()
          };
          
          setRouteDetails(fallbackData);
        }
      }
    } else {
      const errorMessages = {
        'ZERO_RESULTS': 'No se encontró ruta entre los puntos seleccionados',
        'NOT_FOUND': 'Ubicación no encontrada',
        'OVER_QUERY_LIMIT': 'Límite de consultas excedido',
        'REQUEST_DENIED': 'API key inválida o no autorizada',
        'INVALID_REQUEST': 'Solicitud inválida - verifica los parámetros'
      };
      
      setError(errorMessages[status] || `Error de la API: ${status}`);
    }
    setLoading(false);
  }, [routeData]);

  useEffect(() => {
    if (routeData) {
      setLoading(true);
      setError(null);
      setRouteDetails(null);
      setShowDetails(false);
    }
  }, [routeData]);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="error">
        <h3>Error de configuración</h3>
        <p>La API key de Google Maps no está configurada.</p>
        <p>Por favor, configura VITE_GOOGLE_MAPS_API_KEY en tu archivo .env</p>
      </div>
    );
  }

  return (
    <div className="map-container">
      <h2>Recorrido de {routeData?.Origen?.Ciudad} a {routeData?.Destino?.Ciudad}</h2>
      
      {error && (
        <div className="error-details">
          <h3>Error</h3>
          <p>{error}</p>
          <div className="debug-info">
            <p><strong>Origen:</strong> {JSON.stringify(routeData?.Origen)}</p>
            <p><strong>Destino:</strong> {JSON.stringify(routeData?.Destino)}</p>
          </div>
        </div>
      )}
      
      {loading && <div className="loading">Calculando ruta...</div>}

      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        libraries={GOOGLE_MAPS_LIBRARIES} // Usar la constante declarada arriba
        onLoad={() => setMapLoaded(true)}
        onError={() => setError('Error al cargar Google Maps API')}
      >
        {mapLoaded && (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={7}
            center={defaultCenter}
          >
            {routeData && (
              <DirectionsService
                options={{
                  destination: routeData.Destino.Ciudad + ', Guatemala',
                  origin: routeData.Origen.Ciudad + ', Guatemala',
                  travelMode: 'DRIVING',
                  provideRouteAlternatives: true
                }}
                callback={directionsCallback}
              />
            )}
            
            {response && (
              <DirectionsRenderer
                options={{
                  directions: response,
                  polylineOptions: {
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.8,
                    strokeWeight: 6
                  }
                }}
              />
            )}
          </GoogleMap>
        )}
      </LoadScript>

      {response && (
        <div className="route-info">
          <h3>Detalles de la ruta:</h3>
          <p><strong>Distancia:</strong> {response.routes[0].legs[0].distance.text}</p>
          <p><strong>Duración:</strong> {response.routes[0].legs[0].duration.text}</p>
          
          {routeDetails && (
            <div className="route-actions">
              <button 
                onClick={toggleDetails}
                className="details-button"
              >
                {showDetails ? 'Ocultar Detalles' : 'Ver Detalles Completos'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mostrar RouteDetails cuando showDetails sea true */}
      {showDetails && routeDetails && (
        <RouteDetails routeInfo={routeDetails} />
      )}
    </div>
  );
};

export default MapDisplay;