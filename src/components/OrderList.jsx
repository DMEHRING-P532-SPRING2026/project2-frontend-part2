import OrderItem from "./OrderItem"


function OrderList({ orders, onSelect }) {
  return (
    <div className="flex flex-col gap-2 overflow-y-auto h-full p-4 pb-8">
      {orders.map((order, index) => (
        <OrderItem
          key={order._id}
          order={order}
          onClick={() => onSelect(order)}
          isFirst={index === 0}
        />
      ))}
    </div>
  )
}

export default OrderList