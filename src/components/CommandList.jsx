import CommandItem from "./CommandItem"

function CommandList({ commands, onSelect, selectedId }) {
  return (
    <div className="flex flex-col gap-2 overflow-y-auto h-full min-h-0 p-4 pb-8">
      {commands.map((command) => (
        <CommandItem
          key={command.id}
          command={command}
          onSelect={onSelect}
          isSelected={command.id === selectedId}
        />
      ))}
    </div>
  )
}

export default CommandList