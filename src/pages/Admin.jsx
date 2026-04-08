import { useEffect, useState } from 'react';
import config from '../config';
import CommandList from '../components/CommandList';

function Admin() {
  const [commands, setCommands] = useState([]);
  const [selectedCommand, setSelectedCommand] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchData = async () => {
    const commands_data = await fetch(`${config.BASE_URL}/api/orders/commands`)
      .then(r => r.json());
    setCommands(commands_data);
  };

    const fetchStaff = async () => {
    const res = await fetch(`${config.BASE_URL}/api/staff`);
    const data = await res.json();
    setStaffList(data);
    if (data.length > 0) setSelectedStaff(data[0]);
    };

  useEffect(() => {
    fetchData();
    fetchStaff();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const showMessage = (text, isError = false) => {
    setMessage({ text, isError });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleReplay = async () => {
    if (!selectedCommand) return;
    try {
      const res = await fetch(`${config.BASE_URL}/api/orders/replay/${selectedCommand.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffId: selectedStaff?.id }),
      });
      if (!res.ok) throw new Error(await res.text());
      showMessage(`Replayed command #${selectedCommand.id} successfully`);
      fetchData();
    } catch (err) {
      showMessage(`Replay failed: ${err.message}`, true);
    }
  };

  const handleUndo = async () => {
    try {
      const res = await fetch(`${config.BASE_URL}/api/orders/undo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error(await res.text());
      showMessage('Last command undone successfully');
      fetchData();
    } catch (err) {
      showMessage(`Undo failed: ${err.message}`, true);
    }
  };

  return (
    <div className="grid grid-cols-3 w-full h-screen gap-8 px-8 py-8 bg-neutral-800 overflow-hidden">

      <div className="col-span-2 bg-neutral-600 rounded overflow-hidden flex flex-col min-h-0">
        <div className="bg-neutral-700 px-4 py-3 border-b border-neutral-500">
          <h1 className="text-white font-bold text-3xl tracking-wide">Command Log</h1>
        </div>
        <div className="overflow-y-auto flex-1 min-h-0">
          <CommandList commands={commands} onSelect={setSelectedCommand} selectedId={selectedCommand?.id} />
        </div>
      </div>

      <div className="flex flex-col gap-8">

        <div className="bg-neutral-600 rounded overflow-hidden flex flex-col min-h-0">
          <div className="bg-neutral-700 px-4 py-3 border-b border-neutral-500">
            <h1 className="text-white font-bold text-3xl tracking-wide">Undo</h1>
          </div>
          <div className="p-4">
            <p className="text-neutral-400 text-sm mb-4">Reverts the most recently executed command.</p>
            <button
              onClick={handleUndo}
              className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-md transition-colors"
            >
              Undo Last Command
            </button>
          </div>
        </div>

        <div className="bg-neutral-600 rounded overflow-hidden flex flex-col min-h-0">
          <div className="bg-neutral-700 px-4 py-3 border-b border-neutral-500">
            <h1 className="text-white font-bold text-3xl tracking-wide">Replay</h1>
          </div>
          <div className="p-4 flex flex-col gap-4">
            <p className="text-neutral-400 text-sm">Re-executes the selected command against current system state.</p>

            {selectedCommand
              ? (
                <div className="bg-neutral-700 rounded p-3 text-white text-sm space-y-1">
                  <p><span className="text-neutral-400">Command:</span> #{selectedCommand.id}</p>
                  <p><span className="text-neutral-400">Type:</span> {selectedCommand.commandType}</p>
                  <p><span className="text-neutral-400">Order:</span> #{selectedCommand.orderId}</p>
                  <p><span className="text-neutral-400">Staff:</span> {selectedCommand.staffName}</p>
                  <p><span className="text-neutral-400">Executed:</span> {new Date(selectedCommand.executedAt).toLocaleString()}</p>
                </div>
              )
              : <p className="text-neutral-400 text-sm italic">Select a command from the log</p>
            }

            <div>
              <label className="block text-white text-sm font-bold mb-2">Replay As</label>
              <select
                value={selectedStaff?.id ?? ''}
                onChange={(e) => {
                  const staff = staffList.find(s => s.id === parseInt(e.target.value));
                  setSelectedStaff(staff);
                }}
                className="w-full px-3 py-2 rounded-md bg-neutral-700 text-white border border-neutral-500 focus:outline-none focus:border-neutral-300"
              >
                {staffList.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleReplay}
              disabled={!selectedCommand}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-500 disabled:cursor-not-allowed text-white font-bold rounded-md transition-colors"
            >
              Replay Command
            </button>
          </div>
        </div>

        {message && (
          <div className={`px-4 py-3 rounded text-white text-sm font-medium ${message.isError ? 'bg-red-600' : 'bg-green-600'}`}>
            {message.text}
          </div>
        )}

      </div>

    </div>
  );
}

export default Admin;