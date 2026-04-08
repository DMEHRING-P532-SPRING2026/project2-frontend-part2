function CommandItem({ command, onSelect, isSelected }) {
  const { commandType, orderId, staffName, executedAt } = command;

  return (
    <div
      onClick={() => onSelect?.(command)}
      className={`rounded text-white px-3 py-2 flex items-center justify-between border-l-4 text-sm cursor-pointer transition-colors ${
        isSelected
          ? 'bg-neutral-500 border-blue-400'
          : 'bg-neutral-700 border-neutral-400 hover:bg-neutral-600'
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-neutral-400 text-xs">{new Date(executedAt).toLocaleTimeString()}</span>
        <span className="font-bold">{staffName}</span>
        <span className="text-neutral-300">{commandType}</span>
        <span className="text-neutral-400">order #{orderId}</span>
      </div>
    </div>
  )
}

export default CommandItem