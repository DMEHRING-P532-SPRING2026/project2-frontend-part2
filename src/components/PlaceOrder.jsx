import { useState, useEffect } from 'react';
import config from '../config';

const PlaceOrder = ({ onOrderPlaced }) => {
  const [patient, setPatient] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('ROUTINE');
  const [type, setType] = useState('LAB');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [clinicians, setClinicians] = useState([]);
  const [selectedClinician, setSelectedClinician] = useState('');

  useEffect(() => {
    const fetchClinicians = async () => {
      try {
        const res = await fetch(`${config.BASE_URL}/api/staff/clinicians`);
        const data = await res.json();
        setClinicians(data);
        if (data.length > 0) setSelectedClinician(data[0].id);
      } catch (err) {
        console.error('Failed to load clinicians', err);
      }
    };
    fetchClinicians();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${config.BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          patient,
          description,
          priority,
          staffId: selectedClinician,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${errorText}`);
      }

      setPatient('');
      setDescription('');
      setPriority('ROUTINE');
      setType('LAB');
      setSelectedClinician(clinicians.length > 0 ? clinicians[0].id : '');

      if (onOrderPlaced) onOrderPlaced();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">

      <div>
        <label className="block text-white text-sm font-bold mb-2">Clinician</label>
        <select
          value={selectedClinician}
          onChange={(e) => setSelectedClinician(parseInt(e.target.value))}
          className="w-full px-3 py-2 rounded-md bg-neutral-700 text-white border border-neutral-500 focus:outline-none focus:border-neutral-300"
          required
        >
          {clinicians.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-white text-sm font-bold mb-2">Order Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full px-3 py-2 rounded-md bg-neutral-700 text-white border border-neutral-500 focus:outline-none focus:border-neutral-300"
        >
          <option value="LAB">LAB</option>
          <option value="MEDICATION">MEDICATION</option>
          <option value="IMAGING">IMAGING</option>
        </select>
      </div>

      <div>
        <label className="block text-white text-sm font-bold mb-2">Patient</label>
        <input
          type="text"
          value={patient}
          onChange={(e) => setPatient(e.target.value)}
          className="w-full px-3 py-2 rounded-md bg-neutral-700 text-white placeholder-neutral-400 border border-neutral-500 focus:outline-none focus:border-neutral-300"
          required
        />
      </div>

      <div>
        <label className="block text-white text-sm font-bold mb-2">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 rounded-md bg-neutral-700 text-white placeholder-neutral-400 border border-neutral-500 focus:outline-none focus:border-neutral-300"
          rows="3"
          required
        />
      </div>

      <div>
        <label className="block text-white text-sm font-bold mb-2">Priority</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full px-3 py-2 rounded-md bg-neutral-700 text-white border border-neutral-500 focus:outline-none focus:border-neutral-300"
        >
          <option value="ROUTINE">ROUTINE</option>
          <option value="URGENT">URGENT</option>
          <option value="STAT">STAT</option>
        </select>
      </div>

      {error && <div className="text-red-400 text-sm">{error}</div>}

      <button
        type="submit"
        disabled={loading || !selectedClinician}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? 'Placing...' : 'Place Order'}
      </button>
    </form>
  );
};

export default PlaceOrder;