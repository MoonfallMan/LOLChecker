import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import ChampionComparison from './ChampionComparison'

function ChampionDetail() {
  const { id } = useParams()
  const [champion, setChampion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeSpell, setActiveSpell] = useState(null)
  const [items, setItems] = useState(null)
  const [compareChampion, setCompareChampion] = useState(null)
  const [showComparison, setShowComparison] = useState(false)
  const [championList, setChampionList] = useState([])
  const [activeSkinIndex, setActiveSkinIndex] = useState(0)
  
  // Runes data
  const [runeData] = useState({
    primaryPath: {
      id: 8100,
      name: "Domination",
      keystone: {
        id: 8112,
        name: "Electrocute",
        description: "Hitting a champion with 3 separate attacks or abilities in 3s deals bonus adaptive damage."
      },
      slots: [
        { id: 8126, name: "Cheap Shot", description: "Deal bonus true damage to champions with impaired movement or actions." },
        { id: 8139, name: "Taste of Blood", description: "Heal when you damage an enemy champion." },
        { id: 8135, name: "Ravenous Hunter", description: "Heal for a percentage of the damage dealt by your abilities." }
      ]
    },
    secondaryPath: {
      id: 8200,
      name: "Sorcery",
      slots: [
        { id: 8226, name: "Manaflow Band", description: "Hitting an enemy champion with an ability permanently increases your maximum mana by 25, up to 250 mana." },
        { id: 8210, name: "Transcendence", description: "Gain 10% CDR when you reach level 10." }
      ]
    },
    statShards: [
      { name: "Adaptive Force", value: "+9" },
      { name: "Adaptive Force", value: "+9" },
      { name: "Armor", value: "+6" }
    ]
  })

  // Skin pricing data
  const [skinPrices] = useState({
    'default': { rp: 0, type: 'Default' },
    'regular': { rp: 975, type: 'Regular' },
    'epic': { rp: 1350, type: 'Epic' },
    'legendary': { rp: 1820, type: 'Legendary' },
    'ultimate': { rp: 3250, type: 'Ultimate' },
    'mythic': { rp: 'Mythic', type: 'Mythic Essence' }
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const version = await axios.get('https://ddragon.leagueoflegends.com/api/versions.json')
        const latestVersion = version.data[0]
        const [championResponse, itemsResponse, championsListResponse] = await Promise.all([
          axios.get(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion/${id}.json`),
          axios.get(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/item.json`),
          axios.get(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`)
        ])
        setChampion(championResponse.data.data[id])
        setItems(itemsResponse.data.data)
        setChampionList(Object.keys(championsListResponse.data.data))
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch champion details')
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const getSkinRarity = (skinId) => {
    if (skinId === champion.key + '000') return 'default'
    const rarityNumber = parseInt(skinId.slice(-2))
    if (rarityNumber <= 10) return 'regular'
    if (rarityNumber <= 20) return 'epic'
    if (rarityNumber <= 30) return 'legendary'
    if (rarityNumber <= 40) return 'ultimate'
    return 'mythic'
  }

  const getSkinInfo = (skin) => {
    const rarity = getSkinRarity(skin.id)
    const price = skinPrices[rarity]
    return {
      ...skin,
      rarity,
      price,
      features: getSkinFeatures(rarity)
    }
  }

  const getSkinFeatures = (rarity) => {
    const features = {
      default: ['Base model'],
      regular: ['New model', 'New textures'],
      epic: ['New model', 'New textures', 'New animations', 'New visual effects'],
      legendary: ['New model', 'New textures', 'New animations', 'New visual effects', 'New voice-over'],
      ultimate: ['New model', 'New textures', 'New animations', 'New visual effects', 'New voice-over', 'Transform forms'],
      mythic: ['Special edition', 'Rare availability', 'Exclusive effects']
    }
    return features[rarity] || []
  }

  const nextSkin = () => {
    setActiveSkinIndex((prev) => (prev + 1) % champion.skins.length)
  }

  const prevSkin = () => {
    setActiveSkinIndex((prev) => (prev - 1 + champion.skins.length) % champion.skins.length)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl text-blue-400">Loading champion details...</div>
    </div>
  )
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl text-red-400">{error}</div>
    </div>
  )
  
  if (!champion) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl text-red-400">Champion not found</div>
    </div>
  )

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8 flex items-center justify-end gap-4">
        <select
          className="bg-gray-800 text-white rounded p-2"
          onChange={(e) => setCompareChampion(e.target.value)}
          value={compareChampion || ''}
        >
          <option value="">Select champion to compare</option>
          {championList.map((champName) => (
            <option key={champName} value={champName}>
              {champName}
            </option>
          ))}
        </select>
        <button
          className={`px-4 py-2 rounded ${
            compareChampion
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-600 cursor-not-allowed'
          } text-white`}
          onClick={() => setShowComparison(true)}
          disabled={!compareChampion}
        >
          Compare
        </button>
      </div>

      {showComparison && compareChampion ? (
        <div className="mb-8">
          <button
            className="mb-4 text-blue-400 hover:text-blue-500"
            onClick={() => {
              setShowComparison(false);
              setCompareChampion(null);
            }}
          >
            ← Back to Details
          </button>
          <ChampionComparison championId1={id} championId2={compareChampion} />
        </div>
      ) : (
        <div className="min-h-screen pb-12">
          {/* Hero Section */}
          <div className="relative h-[40vh] lg:h-[60vh] overflow-hidden">
            <img
              src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-splashes/${champion.key}/${champion.key}000.jpg`}
              alt={champion.name}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_0.jpg`;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-6 max-w-screen-2xl mx-auto">
                <Link
                  to="/"
                  className="inline-flex items-center space-x-2 text-gray-300 hover:text-white mb-4 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Back to Champions</span>
                </Link>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2">{champion.name}</h1>
                <p className="text-xl text-gray-300">{champion.title}</p>
                <div className="flex gap-2 mt-4">
                  {champion.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-blue-600/80 text-white/90 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="max-w-screen-2xl mx-auto px-4 mt-8 space-y-12">
            {/* Skins Section */}
            <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="font-bold text-xl mb-6 text-gray-200">Available Skins</h3>
              
              {/* Main Skin Display */}
              <div className="relative group">
                <button 
                  onClick={prevSkin}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={nextSkin}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <img
                    src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-splashes/${champion.key}/${champion.skins[activeSkinIndex].id}.jpg`}
                    alt={champion.skins[activeSkinIndex].name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_${champion.skins[activeSkinIndex].num}.jpg`;
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <h4 className="text-xl font-bold text-white">{champion.skins[activeSkinIndex].name}</h4>
                    {activeSkinIndex > 0 && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 rounded text-sm ${
                          getSkinInfo(champion.skins[activeSkinIndex]).rarity === 'mythic' 
                            ? 'bg-purple-500/50 text-purple-100'
                            : 'bg-blue-500/50 text-blue-100'
                        }`}>
                          {getSkinInfo(champion.skins[activeSkinIndex]).price.type}
                        </span>
                        {getSkinInfo(champion.skins[activeSkinIndex]).price.rp && (
                          <span className="text-yellow-400 text-sm">
                            {getSkinInfo(champion.skins[activeSkinIndex]).price.rp} RP
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Skin Features */}
              {activeSkinIndex > 0 && (
                <div className="mt-4 p-4 bg-gray-900/50 rounded-lg">
                  <h5 className="text-lg font-semibold text-blue-400 mb-2">Skin Features</h5>
                  <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {getSkinInfo(champion.skins[activeSkinIndex]).features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Skin Thumbnails */}
              <div className="mt-6 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {champion.skins.map((skin, index) => (
                  <button
                    key={skin.id}
                    onClick={() => setActiveSkinIndex(index)}
                    className={`relative rounded-lg overflow-hidden aspect-square ${
                      index === activeSkinIndex ? 'ring-2 ring-blue-500' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-tiles/${champion.key}/${skin.id}.jpg`}
                      alt={skin.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ddragon.leagueoflegends.com/cdn/img/champion/tiles/${champion.id}_${skin.num}.jpg`;
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Lore Section */}
            <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm">
              <h2 className="text-2xl font-bold mb-4 text-blue-400">Lore</h2>
              <p className="text-gray-300 leading-relaxed">{champion.lore}</p>
            </div>

            {/* Abilities Section */}
            <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="font-bold text-xl mb-6 text-gray-200">Champion Abilities</h3>
              <div className="space-y-8">
                {/* Passive */}
                <div className="ability-container">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-blue-500/20">
                      <img
                        src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/passive/${champion.passive.image.full}`}
                        alt={champion.passive.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-semibold text-blue-400">Passive - {champion.passive.name}</h4>
                      </div>
                      <p className="text-gray-300 mt-2">{champion.passive.description}</p>
                    </div>
                  </div>
                </div>

                {/* Active Abilities */}
                {champion.spells.map((spell, index) => (
                  <div key={spell.id} className="ability-container">
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-900/50 hover:bg-blue-500/20 transition-colors duration-200 group relative">
                        <img
                          src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/${index === 0 ? 'passive' : 'spell'}/${index === 0 ? champion.passive.image.full : spell.image.full}`}
                          alt={`${spell.name} Icon`}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-200"
                        />
                        {spell.cost[0] > 0 && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-xs text-center py-1">
                            {spell.costBurn} {champion.partype}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-lg font-semibold text-blue-400">
                            {['Q', 'W', 'E', 'R'][index]} - {spell.name}
                          </h4>
                        </div>
                        <p className="text-gray-300 mb-2">{spell.description}</p>
                        <div className="text-sm text-gray-400">
                          {spell.cooldownBurn && (
                            <div className="mb-1">
                              <span className="text-blue-400">Cooldown:</span> {spell.cooldownBurn}s
                            </div>
                          )}
                          {spell.rangeBurn && spell.rangeBurn !== "self" && (
                            <div className="mb-1">
                              <span className="text-blue-400">Range:</span> {spell.rangeBurn}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Section */}
            <div className="space-y-6">
              {/* Analytics Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm">
                  <h3 className="font-bold text-xl mb-6 text-gray-200">Performance Analytics</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Win Rate</span>
                        <span className="text-green-400 font-bold">51.2%</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: '51.2%' }} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Pick Rate</span>
                        <span className="text-blue-400 font-bold">8.5%</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: '8.5%' }} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Ban Rate</span>
                        <span className="text-red-400 font-bold">12.3%</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500" style={{ width: '12.3%' }} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">KDA</span>
                        <span className="text-yellow-400 font-bold">2.45</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500" style={{ width: '49%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Matchups */}
                <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm">
                  <h3 className="font-bold text-xl mb-6 text-gray-200">Champion Matchups</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-semibold text-green-400 mb-2">Strong Against</h4>
                      <div className="flex gap-2">
                        {['Yasuo', 'Zed', 'Akali'].map((champ) => (
                          <div key={champ} className="relative group">
                            <div className="w-12 h-12 rounded-lg bg-gray-700 overflow-hidden">
                              <img
                                src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${champ.toLowerCase()}.png`}
                                alt={champ}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="absolute top-0 right-0 -mt-1 -mr-1 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-[10px] font-bold">
                              +
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-red-400 mb-2">Weak Against</h4>
                      <div className="flex gap-2">
                        {['Malzahar', 'Kassadin', 'Galio'].map((champ) => (
                          <div key={champ} className="relative group">
                            <div className="w-12 h-12 rounded-lg bg-gray-700 overflow-hidden">
                              <img
                                src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${champ.toLowerCase()}.png`}
                                alt={champ}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="absolute top-0 right-0 -mt-1 -mr-1 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-[10px] font-bold">
                              -
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Build Paths */}
              <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm">
                <h3 className="font-bold text-xl mb-6 text-gray-200">Recommended Build Path</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { phase: 'Early Game', items: ['1001', '3070', '1052'] },
                    { phase: 'Mid Game', items: ['6653', '3020', '3089'] },
                    { phase: 'Late Game', items: ['3157', '3165', '3040'] }
                  ].map((phase) => (
                    <div key={phase.phase}>
                      <h4 className="text-sm font-semibold text-blue-400 mb-4">{phase.phase}</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {phase.items.map((itemId) => (
                          <div key={itemId} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden bg-gray-700">
                              <img
                                src={`https://ddragon.leagueoflegends.com/cdn/13.24.1/img/item/${itemId}.png`}
                                alt="Item"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="absolute left-0 right-0 bottom-full mb-2 hidden group-hover:block z-10">
                              <div className="bg-gray-900 text-white p-2 rounded-lg text-sm shadow-lg">
                                <div className="font-bold">{items[itemId]?.name}</div>
                                <div className="text-gray-300 text-xs mt-1">{items[itemId]?.plaintext}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Runes */}
              <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm">
                <h3 className="font-bold text-xl mb-6 text-gray-200">Recommended Runes</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Primary Path */}
                  <div className="lg:col-span-1">
                    <div className="bg-gray-900/50 rounded-lg p-6">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-purple-500/20 p-2">
                          <img
                            src={`https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/perk-images/styles/${runeData.primaryPath.name.toLowerCase()}/${runeData.primaryPath.name.toLowerCase()}.png`}
                            alt={runeData.primaryPath.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-purple-400">{runeData.primaryPath.name}</h4>
                          <p className="text-sm text-gray-400">Primary Path</p>
                        </div>
                      </div>

                      {/* Keystone */}
                      <div className="mb-6">
                        <div className="flex items-center gap-4 mb-2">
                          <div className="w-12 h-12 rounded-lg bg-purple-500/20 p-1">
                            <img
                              src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/styles/${runeData.primaryPath.name.toLowerCase()}/${runeData.primaryPath.keystone.name.toLowerCase()}/${runeData.primaryPath.keystone.name.toLowerCase()}.png`}
                              alt={runeData.primaryPath.keystone.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div>
                            <h5 className="font-bold text-white">{runeData.primaryPath.keystone.name}</h5>
                            <p className="text-xs text-gray-400">Keystone</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-300 mt-2">{runeData.primaryPath.keystone.description}</p>
                      </div>

                      {/* Primary Runes */}
                      <div className="space-y-4">
                        {runeData.primaryPath.slots.map((rune, index) => (
                          <div key={rune.id} className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/20 p-1">
                              <img
                                src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/styles/${runeData.primaryPath.name.toLowerCase()}/${rune.name.toLowerCase().replace(/\s+/g, '')}.png`}
                                alt={rune.name}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="flex-1">
                              <h5 className="font-semibold text-white text-sm">{rune.name}</h5>
                              <p className="text-xs text-gray-400">{rune.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Secondary Path */}
                  <div className="lg:col-span-1">
                    <div className="bg-gray-900/50 rounded-lg p-6">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-blue-500/20 p-2">
                          <img
                            src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/styles/${runeData.secondaryPath.name.toLowerCase()}/${runeData.secondaryPath.name.toLowerCase()}.png`}
                            alt={runeData.secondaryPath.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-blue-400">{runeData.secondaryPath.name}</h4>
                          <p className="text-sm text-gray-400">Secondary Path</p>
                        </div>
                      </div>

                      {/* Secondary Runes */}
                      <div className="space-y-4">
                        {runeData.secondaryPath.slots.map((rune, index) => (
                          <div key={rune.id} className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/20 p-1">
                              <img
                                src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/styles/${runeData.secondaryPath.name.toLowerCase()}/${rune.name.toLowerCase().replace(/\s+/g, '')}.png`}
                                alt={rune.name}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="flex-1">
                              <h5 className="font-semibold text-white text-sm">{rune.name}</h5>
                              <p className="text-xs text-gray-400">{rune.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Stat Shards */}
                  <div className="lg:col-span-1">
                    <div className="bg-gray-900/50 rounded-lg p-6">
                      <h4 className="text-lg font-bold text-gray-200 mb-6">Stat Shards</h4>
                      <div className="space-y-4">
                        {runeData.statShards.map((shard, index) => (
                          <div key={index} className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-gray-700/50 p-2 flex items-center justify-center">
                              <span className="text-yellow-400 font-bold">{shard.value}</span>
                            </div>
                            <div>
                              <h5 className="font-semibold text-white text-sm">{shard.name}</h5>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm">
                <h3 className="font-bold text-xl mb-6 text-gray-200">Power Spikes & Timeline</h3>
                <div className="space-y-6">
                  {[
                    { phase: 'Early Game (1-6)', power: 4, focus: 'Farm safely and look for Q poke opportunities. Focus on hitting level 6 without dying.' },
                    { phase: 'Mid Game (7-11)', power: 7, focus: 'Roam to side lanes after pushing. Look for picks with ultimate.' },
                    { phase: 'Late Game (12+)', power: 9, focus: 'Group with team and look for game-changing ultimates. Focus priority targets.' }
                  ].map((phase) => (
                    <div key={phase.phase} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-gray-200">{phase.phase}</h4>
                        <div className="flex items-center gap-1">
                          {[...Array(10)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-4 rounded-sm ${
                                i < phase.power ? 'bg-blue-500' : 'bg-gray-700'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-400">{phase.focus}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
            {/* Combat Stats */}
            <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm col-span-2">
              <h3 className="font-bold text-xl mb-4 text-gray-200">Combat Stats</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Object.entries(champion.info).map(([stat, value]) => (
                  <div key={stat} className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-300 mb-1 capitalize">
                      {stat.replace(/([A-Z])/g, ' $1').trim()}
                    </h4>
                    <div className="relative pt-1">
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-700">
                        <div
                          style={{ width: `${(value / 10) * 100}%` }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                        />
                      </div>
                      <div className="text-right mt-1">
                        <span className="text-sm font-semibold inline-block text-blue-400">
                          {value}/10
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Difficulty Rating */}
            <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="font-bold text-xl mb-4 text-gray-200">Difficulty Rating</h3>
              <div className="flex items-center justify-center h-32">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#1e293b"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="3"
                      strokeDasharray={`${champion.info.difficulty * 10}, 100`}
                    />
                    <text x="18" y="20.35" className="text-3xl" textAnchor="middle" fill="white">
                      {champion.info.difficulty}
                    </text>
                  </svg>
                </div>
              </div>
              <div className="text-center mt-4">
                <p className="text-gray-300">
                  {champion.info.difficulty <= 3
                    ? 'Easy to Play'
                    : champion.info.difficulty <= 7
                    ? 'Moderate Difficulty'
                    : 'High Skill Cap'}
                </p>
              </div>
            </div>

            {/* Base Stats */}
            <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="font-bold text-xl mb-4 text-gray-200">Base Stats</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                {Object.entries(champion.stats).map(([stat, value]) => (
                  <div key={stat} className="text-center p-3 bg-gray-700/50 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1 capitalize">
                      {stat.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="text-lg font-bold text-blue-400">
                      {Number(value).toFixed(1)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Items */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-blue-400">Recommended Items</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Core Items */}
                <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm">
                  <h3 className="font-bold text-xl mb-4 text-gray-200">Core Build</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                    {getRecommendedItems(champion.tags[0], 'core').map((itemId) => (
                      <div
                        key={itemId}
                        className="relative group"
                      >
                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-700">
                          <img
                            src={`https://ddragon.leagueoflegends.com/cdn/13.24.1/img/item/${itemId}.png`}
                            alt={items[itemId]?.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute left-0 right-0 bottom-full mb-2 hidden group-hover:block z-10">
                          <div className="bg-gray-900 text-white p-2 rounded-lg text-sm shadow-lg">
                            <div className="font-bold">{items[itemId]?.name}</div>
                            <div className="text-gray-300 text-xs mt-1">{items[itemId]?.plaintext}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Situational Items */}
                <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm">
                  <h3 className="font-bold text-xl mb-4 text-gray-200">Situational Items</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                    {getRecommendedItems(champion.tags[0], 'situational').map((itemId) => (
                      <div
                        key={itemId}
                        className="relative group"
                      >
                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-700">
                          <img
                            src={`https://ddragon.leagueoflegends.com/cdn/13.24.1/img/item/${itemId}.png`}
                            alt={items[itemId]?.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute left-0 right-0 bottom-full mb-2 hidden group-hover:block z-10">
                          <div className="bg-gray-900 text-white p-2 rounded-lg text-sm shadow-lg">
                            <div className="font-bold">{items[itemId]?.name}</div>
                            <div className="text-gray-300 text-xs mt-1">{items[itemId]?.plaintext}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper function to get recommended items based on champion type
function getRecommendedItems(championType, itemType) {
  const recommendedItems = {
    Assassin: {
      core: ['3142', '6676', '3156', '6693', '3031'],
      situational: ['3033', '3139', '6694', '3814', '6695']
    },
    Fighter: {
      core: ['6630', '3053', '3071', '3181', '3748'],
      situational: ['3742', '3065', '3161', '4401', '3075']
    },
    Mage: {
      core: ['6653', '3089', '3157', '4645', '3040'],
      situational: ['3116', '3135', '3152', '4628', '3165']
    },
    Marksman: {
      core: ['6672', '3046', '3031', '3094', '3085'],
      situational: ['3139', '3156', '6673', '3072', '6676']
    },
    Support: {
      core: ['3050', '3504', '3011', '3107', '3190'],
      situational: ['3222', '3065', '3109', '3001', '3083']
    },
    Tank: {
      core: ['3068', '3001', '3075', '3193', '3065'],
      situational: ['3110', '3083', '3742', '3800', '3143']
    }
  }

  return recommendedItems[championType]?.[itemType] || []
}

export default ChampionDetail
