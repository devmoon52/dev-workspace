import { Trophy } from "lucide-react"

const Top = ({text, list = [], type}) => {
  return (
    <div className="bg-white px-3 w-full py-2 rounded-md shadow-md space-y-4">
        <div className="flex items-center gap-2 text-gray-700">
          <Trophy aria-hidden="true" size={26} strokeWidth={2.6} />
          <h2 className="text-lg font-semibold">{text}</h2>
        </div>

        <ul className="space-y-2">
          {list.map((n, i) => (
            <li
              key={type === 'member' ? n.mid : n.clientID }
              className={`flex items-center justify-between px-2 py-2.5 rounded-md ${i === 0 ? "border-2 border-[#dba100]" : i === 1 ? "border border-[#dba100]" : "border border-gray-300"}`}
            >
              <p>
                #{i + 1} {n.name}
              </p>
              <p>{type === "member" ? n.oldProjects.length : n.count} Projects</p>
            </li>
          ))}
        </ul>
      </div>
  )
}

export default Top
