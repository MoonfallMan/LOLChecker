import { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import axios from 'axios'
import Navbar from './components/Navbar'
import ChampionGrid from './components/ChampionGrid'
import ChampionDetail from './components/ChampionDetail'

function App() {
  const [champions, setChampions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchChampions = async () => {
      try {
        const version = await axios.get('https://ddragon.leagueoflegends.com/api/versions.json')
        const latestVersion = version.data[0]
        const response = await axios.get(
          `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`
        )
        const championsData = Object.values(response.data.data)
        setChampions(championsData)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch champions')
        setLoading(false)
      }
    }

    fetchChampions()
  }, [])

  if (error) return <div className="text-center p-4 text-red-500">{error}</div>
  if (loading) return <div className="text-center p-4">Loading champions...</div>

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<ChampionGrid champions={champions} />} />
          <Route path="/champion/:id" element={<ChampionDetail />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
