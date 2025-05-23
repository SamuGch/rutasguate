import { useState } from 'react';
import { departments } from '../utils/guatemalaData';
import { validateRouteData } from '../utils/apiHelpers';

const ManualInput = ({ onRouteCalculated }) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!origin || !destination) {
      setError('Debe seleccionar origen y destino');
      return;
    }
    
    try {
      const data = {
        Origen: {
          Pais: 'Guatemala',
          Ciudad: origin
        },
        Destino: {
          Pais: 'Guatemala',
          Ciudad: destination
        }
      };
      
      const validated = await validateRouteData(data);
      onRouteCalculated(validated, {
        status: 'success',
        message: 'Ruta calculada correctamente'
      });
      setError('');
    } catch (err) {
      setError(err.message || 'Error al calcular la ruta');
    }
  };

  return (
    <div className="input-section">
      <h2>Ingreso manual</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Origen:</label>
          <select value={origin} onChange={(e) => setOrigin(e.target.value)}>
            <option value="">Seleccione un departamento</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Destino:</label>
          <select value={destination} onChange={(e) => setDestination(e.target.value)}>
            <option value="">Seleccione un departamento</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        
        <button type="submit">Calcular Ruta</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default ManualInput;