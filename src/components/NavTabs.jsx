const NavTabs = ({ activeTab, setActiveTab, hasRoute }) => {
  return (
    <nav className="nav-tabs">
      <button 
        className={activeTab === 'input' ? 'active' : ''}
        onClick={() => setActiveTab('input')}
      >
        Entrada
      </button>
      
      <button 
        className={activeTab === 'map' ? 'active' : ''}
        onClick={() => setActiveTab('map')}
        disabled={!hasRoute}
      >
        Ruta
      </button>
      
      <button 
        className={activeTab === 'exit' ? 'active' : ''}
        onClick={() => setActiveTab('exit')}
      >
        Salida
      </button>
    </nav>
  );
};

export default NavTabs;