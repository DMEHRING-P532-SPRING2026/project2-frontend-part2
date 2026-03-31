import { useEffect, useState } from 'react';
import './App.css';
import config from './config';
import OrderList from './components/OrderList';
import OrderDetails from './components/OrderDetails';
import CommandList from './components/CommandList';
import PlaceOrder from './components/PlaceOrder';

function App() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actorName, setActorName] = useState('');
  const [orderType, setOrderType] = useState('LAB');
  const [commands, setCommands] = useState([]);

  const fetchData = async () => {
    const [orders_data, commands_data] = await Promise.all([
      fetch(`${config.BASE_URL}/api/orders`).then(r => r.json()),
      fetch(`${config.BASE_URL}/api/orders/commands`).then(r => r.json()),
    ]);
    setOrders(orders_data);
    setCommands(commands_data);

    setSelectedOrder(prev => {
      if (!prev) return null;
      const found = orders_data.find(o => o.id === prev.id);
      return found ?? prev;
    });
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleClaim = async () => {
    const res = await fetch(`${config.BASE_URL}/api/orders/${selectedOrder.id}/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actor: actorName }),
    });
    const updatedOrder = await res.json();
    setSelectedOrder(updatedOrder);
    setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
  };

  const handleSubmit = async () => {
    const res = await fetch(`${config.BASE_URL}/api/orders/${selectedOrder.id}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actor: actorName }),
    });
    const updatedOrder = await res.json();
    setSelectedOrder(updatedOrder);
    setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
  };

  const handleCancel = async () => {
    const res = await fetch(`${config.BASE_URL}/api/orders/${selectedOrder.id}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actor: actorName }),
    });
    const updatedOrder = await res.json();
    setSelectedOrder(updatedOrder);
    setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
  };

  return (
    <div className="grid grid-cols-4 w-full h-screen gap-8 px-8 py-8 bg-neutral-800 overflow-hidden">

      <div className="grid grid-rows-4 gap-8 min-h-0">
        <div className="row-span-4 bg-neutral-600 rounded overflow-hidden flex flex-col min-h-0">
          <div className="bg-neutral-700 px-4 py-3 border-b border-neutral-500">
            <h1 className="text-white font-bold text-3xl tracking-wide">Queue</h1>
          </div>
          <div className="overflow-y-auto flex-1 min-h-0">
            <OrderList orders={orders} onSelect={setSelectedOrder}/>
          </div>
        </div>
      </div>

      <div className="bg-neutral-600 rounded overflow-hidden flex flex-col min-h-0">
        <div className="bg-neutral-700 px-4 py-3 border-b border-neutral-500">
          <h1 className="text-white font-bold text-3xl tracking-wide">Details</h1>
        </div>
        <div className="overflow-y-auto flex-1 min-h-0">
          {selectedOrder 
            ? <OrderDetails
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
                isFirst={
                  selectedOrder?.status === 'IN_PROGRESS' ||
                  orders.findIndex(o => o.id === selectedOrder?.id) === 0
                }
                onClaim={handleClaim}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                actorName={actorName}
              />
            : <p className="text-white p-4">Select an order</p>
          }
        </div>
      </div>

      <div className="grid grid-rows-4 gap-8 min-h-0">
        <div className="bg-neutral-600 rounded overflow-hidden row-span-3 flex flex-col min-h-0">
          <div className="bg-neutral-700 px-4 py-3 border-b border-neutral-500">
            <h1 className="text-white font-bold text-3xl tracking-wide">Command Log</h1>
          </div>
          <div className="overflow-y-auto flex-1 min-h-0">
            <CommandList commands={commands}/>
          </div>
        </div>
        <div className="bg-neutral-600 rounded overflow-hidden flex flex-col row-span-1 min-h-0">
          <div className="bg-neutral-700 px-4 py-3 border-b border-neutral-500">
            <h1 className="text-white font-bold text-3xl tracking-wide">Staff</h1>
          </div>
          <div className="overflow-y-auto flex-1 p-4 min-h-0 space-y-4">
            <input
              type="text"
              placeholder="Enter your name"
              value={actorName}
              onChange={(e) => setActorName(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-neutral-700 text-white placeholder-neutral-400 border border-neutral-500 focus:outline-none focus:border-neutral-300"
            />
            <div>
              <label className="block text-white text-sm font-bold mb-2">Order Type</label>
              <select
                value={orderType}
                onChange={(e) => setOrderType(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-neutral-700 text-white border border-neutral-500 focus:outline-none focus:border-neutral-300"
              >
                <option value="LAB">LAB</option>
                <option value="MEDICATION">MEDICATION</option>
                <option value="IMAGING">IMAGING</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-neutral-600 rounded overflow-hidden flex flex-col min-h-0">
        <div className="bg-neutral-700 px-4 py-3 border-b border-neutral-500">
          <h1 className="text-white font-bold text-3xl tracking-wide">Place Order</h1>
        </div>
        <div className="overflow-y-auto flex-1 min-h-0">
          <PlaceOrder actorName={actorName} onOrderPlaced={fetchData} orderType={orderType} />
        </div>
      </div>
    </div>
  );
}

export default App;