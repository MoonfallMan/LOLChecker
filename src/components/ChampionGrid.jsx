import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'

const ROLES = ['All', 'Assassin', 'Fighter', 'Mage', 'Marksman', 'Support', 'Tank']

function ChampionGrid({ champions }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState('All')

  const filteredChampions = useMemo(() => {
    return champions.filter((champion) => {
      const matchesSearch = champion.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesRole = selectedRole === 'All' || champion.tags.includes(selectedRole)
      return matchesSearch && matchesRole
    })
  }, [champions, searchQuery, selectedRole])

  return (
    <div className="min-h-screen p-4">
      {/* Search and Filter Bar */}
      <div className="sticky top-14 bg-gray-900/95 backdrop-blur-sm py-4 mb-6 z-10">
        <div className="max-w-screen-2xl mx-auto px-4 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search champions..."
            className="w-full sm:w-64 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            {ROLES.map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-3 py-1.5 rounded-lg transition-colors text-sm ${
                  selectedRole === role
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Champion Grid */}
      <div className="max-w-screen-2xl mx-auto px-4">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-3">
          {filteredChampions.map((champion) => (
            <Link
              key={champion.id}
              to={`/champion/${champion.id}`}
              className="block group relative overflow-hidden rounded bg-gray-800 aspect-square hover:-translate-y-1 transition-all duration-200 hover:shadow-xl"
            >
              <img
                src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${champion.key}.png`}
                alt={champion.name}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/${champion.id}.png`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="absolute bottom-0 left-0 right-0 p-1.5">
                  <h3 className="text-xs font-bold text-white mb-0.5 text-center truncate px-1">{champion.name}</h3>
                  <div className="flex flex-wrap gap-0.5 justify-center">
                    {champion.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-1 py-0.5 text-[8px] rounded-full bg-blue-600/80 text-white/90 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredChampions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No champions found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChampionGrid
