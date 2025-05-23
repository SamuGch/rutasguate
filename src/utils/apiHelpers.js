// Helper para validar datos de ruta
export const validateRouteData = async (data) => {
  if (!data.Origen || !data.Destino) {
    throw new Error('Estructura del archivo incorrecta');
  }

  if (data.Origen.Pais !== 'Guatemala' || data.Destino.Pais !== 'Guatemala') {
    throw new Error('Solo se admiten rutas dentro de Guatemala');
  }

  return data;
};

// Helper para generar el archivo de salida
export const generateOutputFile = (directionsResult, routeData) => {
  if (!directionsResult || !directionsResult.routes || !directionsResult.routes[0]) {
    console.error('Datos de ruta inválidos para generar salida');
    return null;
  }

  const route = directionsResult.routes[0];
  const legs = route.legs[0];

  const outputData = {
    origen: routeData.Origen.Ciudad,
    destino: routeData.Destino.Ciudad,
    distancia: legs.distance.text,
    duracion: legs.duration.text,
    pasos: legs.steps.map(step => ({
      instrucciones: step.instructions,
      distancia: step.distance.text,
      duracion: step.duration.text
    })),
    fecha: new Date().toISOString()
  };

  // Retornar los datos para que puedan ser usados por otros componentes
  return outputData;
};

// Helper para geocodificación (opcional)
export const geocodeLocation = async (locationName) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(locationName + ', Guatemala')}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.status === 'OK' && data.results.length > 0) {
      return data.results[0].geometry.location;
    }
    
    throw new Error(data.status || 'No se encontraron resultados');
  } catch (error) {
    console.error('Error en geocodificación:', error);
    throw error;
  }
};