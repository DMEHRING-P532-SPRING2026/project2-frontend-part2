const priorityColors = {
  STAT: 'bg-red-500',
  URGENT: 'bg-yellow-500',
  ROUTINE: 'bg-blue-500',
}


function OrderItem({ order, onClick }) {
    const { id, type, patient, clinician, description, priority, status, createdAt, lastModifiedAt } = order;
    const color = priorityColors[priority] ?? 'bg-neutral-500';

    return (
        <div onClick={onClick} className={`grid grid-cols-3 ${color} rounded text-white cursor-pointer hover:brightness-110`}>
            <div className="p-3 border-r border-white/30">
                <h1 className="font-bold text-xl">Priority: {priority}</h1>
            </div>
            <div className="p-3 border-r border-white/30">
                <h1 className="font-bold text-xl">Type: {type}</h1>
            </div>
            <div className="p-3">
                <h1 className="font-bold text-xl">Patient: {patient}</h1>
            </div>
        </div>
    )
}

export default OrderItem