import { useState } from 'react';
import { validateRouteData } from '../utils/apiHelpers';

const FileInput = ({ onRouteCalculated }) => {
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target.result);
        const validated = await validateRouteData(data);
        onRouteCalculated(validated, {
          status: 'success',
          message: 'Archivo cargado correctamente'
        });
        setError('');
      } catch (err) {
        setError(err.message || 'Error al procesar el archivo');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="input-section">
      <h2>Cargar archivo JSON</h2>
      <input type="file" accept=".json" onChange={handleFileChange} />
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default FileInput;