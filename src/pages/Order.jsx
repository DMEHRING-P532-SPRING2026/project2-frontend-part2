import { useEffect, useState } from 'react';
import config from '../config';
import PlaceOrder from '../components/PlaceOrder';
import OrderList from '../components/OrderList';
import OrderDetails from '../components/OrderDetails';

function Order() {
  const [clinicianList, setClinicianList] = useState([]);
  const [selectedClinician, setSelectedClinician] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchClinicians = async () => {
      try {
        const res = await fetch(`${config.BASE_URL}/api/staff/clinicians`);
        const data = await res.json();
        setClinicianList(data);
        if (data.length > 0) setSelectedClinician(data[0]);
      } catch (err) {
        console.error('Failed to load clinicians', err);
      }
    };
    fetchClinicians();
  }, []);

  const fetchOrders = async () => {
    if (!selectedClinician) return;
    try {
      const res = await fetch(`${config.BASE_URL}/api/orders/clinician?staffId=${selectedClinician.id}`);
      const data = await res.json();
      setOrders(data);
    setSelectedOrder(prev => {
      if (!prev) return null;
      return data.find(o => o.id === prev.id) ?? prev;
    });
    } catch (err) {
      console.error('Failed to load orders', err);
    }
  };

  useEffect(() => {
    if (!selectedClinician) return;
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, [selectedClinician]);

  const handleCancel = async () => {
    const res = await fetch(`${config.BASE_URL}/api/orders/${selectedOrder.id}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ staffId: selectedClinician?.id }),
    });
    const updatedOrder = await res.json();
    setSelectedOrder(updatedOrder);
    setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
    fetchOrders();
  };

  return (
    <div className="grid grid-cols-3 w-full h-screen gap-8 px-8 py-8 bg-neutral-800 overflow-hidden">
      <div className="bg-neutral-600 rounded overflow-hidden flex flex-col min-h-0">
        <div className="bg-neutral-700 px-4 py-3 border-b border-neutral-500">
          <h1 className="text-white font-bold text-3xl tracking-wide">Place Order</h1>
        </div>
        <div className="overflow-y-auto flex-1 min-h-0">
          <PlaceOrder onOrderPlaced={fetchOrders} />
        </div>
      </div>
      <div className="flex flex-col gap-8 min-h-0">
        <div className="bg-neutral-600 rounded overflow-hidden flex flex-col min-h-0">
          <div className="bg-neutral-700 px-4 py-3 border-b border-neutral-500">
            <h1 className="text-white font-bold text-3xl tracking-wide">Clinician</h1>
          </div>
          <div className="p-4">
            <select
              value={selectedClinician?.id ?? ''}
              onChange={(e) => {
                const clinician = clinicianList.find(s => s.id === parseInt(e.target.value));
                setSelectedClinician(clinician);
                setSelectedOrder(null);
              }}
              className="w-full px-3 py-2 rounded-md bg-neutral-700 text-white border border-neutral-500 focus:outline-none focus:border-neutral-300"
            >
              {clinicianList.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex-1 bg-neutral-600 rounded overflow-hidden flex flex-col min-h-0">
          <div className="bg-neutral-700 px-4 py-3 border-b border-neutral-500">
            <h1 className="text-white font-bold text-3xl tracking-wide">Orders</h1>
          </div>
          <div className="overflow-y-auto flex-1 min-h-0">
            {orders.length > 0
              ? <OrderList orders={orders} onSelect={setSelectedOrder} />
              : <p className="text-white p-4">No orders</p>
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
                onCancel={handleCancel}
                actorName={selectedClinician?.name}
                actorType="CLINICIAN"
              />
            : <p className="text-white p-4">Select an order</p>
          }
        </div>
      </div>

    </div>
  );
}

export default Order;