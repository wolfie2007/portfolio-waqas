// Dev-only: renders one piece large for inspection. ?gs-preview=sketch | graph
import Schematic from '../components/Schematic';
import LightCurve from '../sections/LightCurve';
import '../sections/instruments.css';

export default function Preview() {
  const mode = new URLSearchParams(location.search).get('gs-preview');
  if (mode === 'graph') return <main><LightCurve /></main>;
  if (mode === 'sketch') {
    return (
      <div style={{ background: '#fff', padding: 40, display: 'grid', gap: 60, width: 900 }}>
        {['SiteMind', 'CodeDuel', 'Encrypto'].map((n) => <figure key={n} className="in-sheet"><Schematic name={n} /></figure>)}
      </div>
    );
  }
  return <main><LightCurve /></main>;
}
