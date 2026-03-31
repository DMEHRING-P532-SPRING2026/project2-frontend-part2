function CommandItem({ command }) {
  const { type, orderId, actor, executedAt } = command;

  return (
    <div className="bg-neutral-700 rounded text-white px-3 py-2 flex items-center justify-between border-l-4 border-neutral-400 text-sm">
      <div className="flex items-center gap-2">
        <span className="text-neutral-400 text-xs">{new Date(executedAt).toLocaleTimeString()}</span>
        <span className="font-bold">{actor}</span>
        <span className="text-neutral-300">{type}</span>
        <span className="text-neutral-400">order #{orderId}</span>
      </div>
    </div>
  )
}

export default CommandItem