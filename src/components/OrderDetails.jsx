import { useState, useEffect } from 'react';

function OrderDetails({ order, onClose, isFirst, onClaim, onSubmit, onCancel, actorName, actorType }) {
  const [currentStatus, setCurrentStatus] = useState(order.status);

  useEffect(() => {
    setCurrentStatus(order.status);
  }, [order.status, order.id]);

  const { type, patient, clinician, description, priority, createdAt } = order;

  const handleSubmit = () => {
    setCurrentStatus('SUBMITTED');
    onSubmit();
  };

  const handleCancel = () => {
    setCurrentStatus('CANCELLED');
    onCancel();
  };

  return (
    <div className="p-6 text-white flex flex-col gap-4 bg-neutral-700 rounded-lg m-4">
      <p className="text-2xl"><span className="font-bold text-3xl">Patient:</span> {patient}</p>
      <p className="text-2xl"><span className="font-bold text-3xl">Type:</span> {type}</p>
      <p className="text-2xl"><span className="font-bold text-3xl">Priority:</span> {priority}</p>
      <p className="text-2xl"><span className="font-bold text-3xl">Clinician:</span> {clinician}</p>
      <p className="text-2xl"><span className="font-bold text-3xl">Status:</span> {currentStatus}</p>
      <p className="text-2xl"><span className="font-bold text-3xl">Description:</span> {description}</p>
      <p className="text-2xl"><span className="font-bold text-3xl">Created:</span> {new Date(createdAt).toLocaleString()}</p>

      <div className="flex justify-between items-center gap-2">
        {isFirst && currentStatus === 'PENDING' && (
          <button
            onClick={onClaim}
            disabled={!actorName}
            className="px-4 py-2 bg-green-500 hover:bg-green-400 disabled:bg-neutral-500 disabled:cursor-not-allowed text-white font-bold rounded-md transition-colors w-32"
          >
            Claim
          </button>
        )}
        {isFirst && currentStatus === 'IN_PROGRESS' && (
          <button
            onClick={handleSubmit}
            disabled={!actorName}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-400 disabled:bg-neutral-500 disabled:cursor-not-allowed text-white font-bold rounded-md transition-colors w-32"
          >
            Submit
          </button>
        )}
        {actorType === 'CLINICIAN' && currentStatus !== 'CANCELLED' && currentStatus !== 'SUBMITTED' && (
          <button
            onClick={handleCancel}
            disabled={!actorName}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:bg-neutral-500 disabled:cursor-not-allowed text-white font-bold rounded-md transition-colors w-32"
          >
            Cancel
          </button>
        )}
        {currentStatus !== 'IN_PROGRESS' && (
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-neutral-600 hover:bg-neutral-500 text-neutral-300 hover:text-white font-medium transition-colors w-32"
          >
            ✕ Close
          </button>
        )}
      </div>
    </div>
  );
}

export default OrderDetails;