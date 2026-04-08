import { useEffect, useRef, useState } from 'react';
import config from '../config';
import OrderList from '../components/OrderList';
import OrderDetails from '../components/OrderDetails';

function Fulfillment({ type }) {
  const [orders, setOrders] = useState([]);
  const [claimedOrders, setClaimedOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderSource, setSelectedOrderSource] = useState(null);
  const [triageStrategy, setTriageStrategy] = useState('PRIORITY_FIRST');
  const [preferences, setPreferences] = useState({
    console: false,
    inApp: false,
    email: false,
  });
  const [badgeCount, setBadgeCount] = useState(0);
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const selectedStaffRef = useRef(selectedStaff);

  const togglePreference = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    selectedStaffRef.current = selectedStaff;
  }, [selectedStaff]);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await fetch(`${config.BASE_URL}/api/staff/department?department=${type}`);
        const data = await res.json();
        setStaffList(data);
        if (data.length > 0) setSelectedStaff(data[0]);
      } catch (err) {
        console.error('Failed to load staff', err);
      }
    };
    fetchStaff();
  }, [type]);

  const fetchData = async () => {
    const res = await fetch(`${config.BASE_URL}/api/orders?staffId=${selectedStaff?.id}&department=${type}&strategy=${triageStrategy}`);
    const orders_data = await res.json();
    setOrders(orders_data);
  };

  const fetchClaimedOrders = async () => {
    if (!selectedStaff) return;
    try {
      const res = await fetch(`${config.BASE_URL}/api/orders/claimed?staffId=${selectedStaff.id}&department=${type}`);
      const data = await res.json();
      setClaimedOrders(data.sort((a, b) => new Date(a.lastModifiedAt) - new Date(b.lastModifiedAt)));
    } catch (err) {
      console.error('Failed to load claimed orders', err);
    }
  };

  useEffect(() => {
    if (!selectedStaff) return;
    fetchData();
    fetchClaimedOrders();
    const interval = setInterval(() => {
      fetchData();
      fetchClaimedOrders();
    }, 3000);
    return () => clearInterval(interval);
  }, [type, triageStrategy, selectedStaff]);

  useEffect(() => {
    let eventSource;
    let retryTimeout;

    const connect = () => {
      eventSource = new EventSource(`${config.BASE_URL}/badge/stream`);
      eventSource.onmessage = (e) => {
        const actorId = parseInt(e.data);
        const currentId = parseInt(selectedStaffRef.current?.id);
        if (actorId === currentId) {
          setBadgeCount(prev => prev + 1);
        }
      };
      eventSource.onerror = () => {
        eventSource.close();
        retryTimeout = setTimeout(connect, 3000);
      };
      
    };

    connect();
    return () => {
      eventSource?.close();
      clearTimeout(retryTimeout);
    };
  }, []);

  const handleClaim = async () => {
    const res = await fetch(`${config.BASE_URL}/api/orders/${selectedOrder.id}/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ staffId: selectedStaff?.id, preferences }),
    });
    const updatedOrder = await res.json();
    setSelectedOrder(updatedOrder);
    setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
    fetchData();
    fetchClaimedOrders();
  };

  const handleSubmit = async () => {
    const res = await fetch(`${config.BASE_URL}/api/orders/${selectedOrder.id}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ staffId: selectedStaff?.id, preferences }),
    });
    const updatedOrder = await res.json();
    setSelectedOrder(updatedOrder);
    setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
    fetchData();
    fetchClaimedOrders();
  };

  const handleCancel = async () => {
    const res = await fetch(`${config.BASE_URL}/api/orders/${selectedOrder.id}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ staffId: selectedStaff?.id, preferences }),
    });
    const updatedOrder = await res.json();
    setSelectedOrder(updatedOrder);
    setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
    fetchData();
    fetchClaimedOrders();
  };

  const handleSelectQueueOrder = (order) => {
    setSelectedOrder(order);
    setSelectedOrderSource('queue');
  };

  const handleSelectClaimedOrder = (order) => {
    setSelectedOrder(order);
    setSelectedOrderSource('claimed');
  };

  return (
    <div className="grid grid-cols-3 w-full h-screen gap-8 px-8 py-8 bg-neutral-800 overflow-hidden">

      <div className="flex flex-col gap-8 min-h-0">

        <div className="flex-1 bg-neutral-600 rounded overflow-hidden flex flex-col min-h-0">
          <div className="bg-neutral-700 px-4 py-3 border-b border-neutral-500 flex justify-between items-center">
            <h1 className="text-white font-bold text-3xl tracking-wide">Queue</h1>
            {badgeCount > 0 && (
              <span
                className="bg-red-500 text-white text-sm font-bold px-2 py-1 rounded-full cursor-pointer"
                onClick={() => setBadgeCount(0)}
              >
                {badgeCount}
              </span>
            )}
          </div>
          <div className="overflow-y-auto flex-1 min-h-0">
            <OrderList orders={orders} onSelect={handleSelectQueueOrder} />
          </div>
        </div>

        <div className="flex-1 bg-neutral-600 rounded overflow-hidden flex flex-col min-h-0">
          <div className="bg-neutral-700 px-4 py-3 border-b border-neutral-500">
            <h1 className="text-white font-bold text-3xl tracking-wide">Claimed</h1>
          </div>
          <div className="overflow-y-auto flex-1 min-h-0">
            {claimedOrders.length > 0
              ? <OrderList orders={claimedOrders} onSelect={handleSelectClaimedOrder} />
              : <p className="text-white p-4">No claimed orders</p>
            }
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
                onClaim={selectedOrderSource === 'queue' ? handleClaim : undefined}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                actorName={selectedStaff?.name}
                actorType={selectedStaff?.type}
              />
            : <p className="text-white p-4">Select an order</p>
          }
        </div>
      </div>

      <div className="flex flex-col gap-8">

        <div className="bg-neutral-600 rounded overflow-hidden flex flex-col min-h-0">
          <div className="bg-neutral-700 px-4 py-3 border-b border-neutral-500">
            <h1 className="text-white font-bold text-3xl tracking-wide">Staff</h1>
          </div>
          <div className="p-4">
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
        </div>
        <div className="bg-neutral-600 rounded overflow-hidden flex flex-col min-h-0">
          <div className="bg-neutral-700 px-4 py-3 border-b border-neutral-500">
            <h1 className="text-white font-bold text-3xl tracking-wide">Queue Sorted By</h1>
          </div>
          <div className="p-4 space-y-2">
            {['PRIORITY_FIRST', 'DEADLINE_FIRST', 'LOAD_BALANCING'].map(option => (
              <button
                key={option}
                onClick={() => setTriageStrategy(option)}
                className={`w-full px-3 py-2 rounded-md text-white text-left border transition-colors ${
                  triageStrategy === option
                    ? 'bg-neutral-500 border-neutral-300'
                    : 'bg-neutral-700 border-neutral-500 hover:bg-neutral-600'
                }`}
              >
                {option.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-neutral-600 rounded overflow-hidden flex flex-col min-h-0">
          <div className="bg-neutral-700 px-4 py-3 border-b border-neutral-500">
            <h1 className="text-white font-bold text-3xl tracking-wide">Notifications</h1>
          </div>
          <div className="p-4 space-y-2">
            {[
              { key: 'console', label: 'Console Log' },
              { key: 'inApp',   label: 'Dashboard Notification' },
              { key: 'email',   label: 'Email Summary' },
            ].map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center gap-3 px-3 py-2 rounded-md bg-neutral-700 border border-neutral-500 cursor-pointer hover:bg-neutral-600 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={preferences[key]}
                  onChange={() => togglePreference(key)}
                  className="w-4 h-4 accent-neutral-300"
                />
                <span className="text-white">{label}</span>
              </label>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

export default Fulfillment;