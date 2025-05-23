import { useEffect } from 'react';

const RouteDetails = ({ routeInfo }) => {
  // Función para extraer departamentos de la ruta
  const extractDepartments = (pasos) => {
    const departamentos = new Set();
    
    // Mapeo de ciudades principales a departamentos de Guatemala
    const ciudadDepartamento = {
      'Guatemala': 'Guatemala',
      'Mixco': 'Guatemala',
      'Villa Nueva': 'Guatemala',
      'Petapa': 'Guatemala',
      'San José Pinula': 'Guatemala',
      'San José del Golfo': 'Guatemala',
      'Palencia': 'Guatemala',
      'Chinautla': 'Guatemala',
      'San Pedro Ayampuc': 'Guatemala',
      'San Juan Sacatepéquez': 'Guatemala',
      'San Raymundo': 'Guatemala',
      'Chuarrancho': 'Guatemala',
      'San Pedro Sacatepéquez': 'Guatemala',
      'San Martín Jilotepeque': 'Chimaltenango',
      'Chimaltenango': 'Chimaltenango',
      'San José Poaquil': 'Chimaltenango',
      'Tecpán': 'Chimaltenango',
      'Patzún': 'Chimaltenango',
      'Patzicía': 'Chimaltenango',
      'Santa Apolonia': 'Chimaltenango',
      'San Bartolomé Milpas Altas': 'Sacatepéquez',
      'Antigua Guatemala': 'Sacatepéquez',
      'Jocotenango': 'Sacatepéquez',
      'Pastores': 'Sacatepéquez',
      'Sumpango': 'Sacatepéquez',
      'Santo Domingo Xenacoj': 'Sacatepéquez',
      'Santiago Sacatepéquez': 'Sacatepéquez',
      'San Bartolomé Milpas Altas': 'Sacatepéquez',
      'Santa Lucía Milpas Altas': 'Sacatepéquez',
      'Magdalena Milpas Altas': 'Sacatepéquez',
      'Santa María de Jesús': 'Sacatepéquez',
      'Ciudad Vieja': 'Sacatepéquez',
      'San Miguel Dueñas': 'Sacatepéquez',
      'Alotenango': 'Sacatepéquez',
      'San Antonio Aguas Calientes': 'Sacatepéquez',
      'Santa Catarina Barahona': 'Sacatepéquez',
      'Jalapa': 'Jalapa',
      'San Pedro Pinula': 'Jalapa',
      'San Luis Jilotepeque': 'Jalapa',
      'San Manuel Chaparrón': 'Jalapa',
      'San Carlos Alzatate': 'Jalapa',
      'Monjas': 'Jalapa',
      'Mataquescuintla': 'Jalapa',
      'El Progreso': 'El Progreso',
      'Guastatoya': 'El Progreso',
      'Morazán': 'El Progreso',
      'San Agustín Acasaguastlán': 'El Progreso',
      'San Cristóbal Acasaguastlán': 'El Progreso',
      'El Jícaro': 'El Progreso',
      'Sansare': 'El Progreso',
      'Sanarate': 'El Progreso'
    };
    
    // Agregar departamentos de origen y destino
    if (routeInfo.origen && ciudadDepartamento[routeInfo.origen]) {
      departamentos.add(ciudadDepartamento[routeInfo.origen]);
    }
    if (routeInfo.destino && ciudadDepartamento[routeInfo.destino]) {
      departamentos.add(ciudadDepartamento[routeInfo.destino]);
    }
    
    // Buscar menciones de lugares en las instrucciones
    pasos.forEach(paso => {
      const instruccion = paso.instrucciones.toLowerCase();
      Object.keys(ciudadDepartamento).forEach(ciudad => {
        if (instruccion.includes(ciudad.toLowerCase())) {
          departamentos.add(ciudadDepartamento[ciudad]);
        }
      });
      
      // Buscar menciones directas de carreteras que cruzan departamentos
      if (instruccion.includes('ca-14') || instruccion.includes('rn-5')) {
        departamentos.add('El Progreso');
        departamentos.add('Jalapa');
      }
      if (instruccion.includes('ca-9')) {
        departamentos.add('Guatemala');
        departamentos.add('El Progreso');
      }
    });
    
    return Array.from(departamentos).sort();
  };

  // Función para descargar el archivo JSON
  const descargarJSON = () => {
    if (!routeInfo) return;
    
    const dataStr = JSON.stringify(routeInfo, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'Salida.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Si no hay datos de ruta, mostrar mensaje de carga o error
  if (!routeInfo) {
    return (
      <div className="details-container">
        <p>Cargando detalles de la ruta...</p>
      </div>
    );
  }

  const departamentos = extractDepartments(routeInfo.pasos || []);

  return (
    <div className="details-container">
      <h2>Detalles del Recorrido</h2>
      
      <div className="details-section">
        <h3>Información de la Ruta</h3>
        <p><strong>Origen:</strong> {routeInfo.origen}</p>
        <p><strong>Destino:</strong> {routeInfo.destino}</p>
        <p><strong>Distancia total:</strong> {routeInfo.distancia}</p>
        <p><strong>Duración estimada:</strong> {routeInfo.duracion}</p>
        <p><strong>Fecha de consulta:</strong> {new Date(routeInfo.fecha).toLocaleString()}</p>
      </div>
      
      <div className="details-section">
        <h3>Departamentos que se cruzan en la ruta:</h3>
        <div className="departments-list">
          {departamentos.length > 0 ? (
            <ul>
              {departamentos.map((departamento, index) => (
                <li key={index}>{departamento}</li>
              ))}
            </ul>
          ) : (
            <p>No se pudo determinar los departamentos en esta ruta.</p>
          )}
        </div>
      </div>
      
      <div className="details-section">
        <h3>Instrucciones paso a paso:</h3>
        <div className="steps-container">
          {routeInfo.pasos && routeInfo.pasos.map((paso, index) => (
            <div key={index} className="step-item">
              <div className="step-number">{index + 1}</div>
              <div className="step-content">
                <div 
                  className="step-instructions" 
                  dangerouslySetInnerHTML={{ __html: paso.instrucciones }}
                />
                <div className="step-details">
                  <span className="step-distance">{paso.distancia}</span>
                  <span className="step-duration">({paso.duracion})</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="details-section">
        <h3>Archivo de Salida</h3>
        <p>Descarga el archivo JSON con toda la información de la ruta.</p>
        <button 
          onClick={descargarJSON}
          className="download-button"
        >
          Descargar Salida.json
        </button>
      </div>
    </div>
  );
};

export default RouteDetails;

