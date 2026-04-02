import CommandItem from "./CommandItem"

function CommandList({ commands }) {
  return (
    <div className="flex flex-col gap-2 overflow-y-auto h-full min-h-0 p-4 pb-8">
      {commands.map((command) => (
        <CommandItem
          key={command.id}
          command={command}
        />
      ))}
    </div>
  )
}

export default CommandList