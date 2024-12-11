import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ChampionComparison({ championId1, championId2 }) {
  const [champions, setChampions] = useState({ champion1: null, champion2: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChampions = async () => {
      try {
        const version = await axios.get('https://ddragon.leagueoflegends.com/api/versions.json');
        const latestVersion = version.data[0];
        
        const [champ1Response, champ2Response] = await Promise.all([
          axios.get(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion/${championId1}.json`),
          axios.get(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion/${championId2}.json`)
        ]);

        setChampions({
          champion1: champ1Response.data.data[championId1],
          champion2: champ2Response.data.data[championId2]
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch champion details');
        setLoading(false);
      }
    };

    if (championId1 && championId2) {
      fetchChampions();
    }
  }, [championId1, championId2]);

  const ComparisonSection = ({ title, value1, value2 }) => (
    <div className="grid grid-cols-2 gap-4 mb-4 p-2 bg-gray-800 rounded">
      <div className={`text-center ${parseFloat(value1) > parseFloat(value2) ? 'text-green-400' : 'text-white'}`}>
        {value1}
      </div>
      <div className={`text-center ${parseFloat(value2) > parseFloat(value1) ? 'text-green-400' : 'text-white'}`}>
        {value2}
      </div>
    </div>
  );

  if (loading) {
    return <div className="text-center text-blue-400">Loading comparison...</div>;
  }

  if (error) {
    return <div className="text-center text-red-400">{error}</div>;
  }

  if (!champions.champion1 || !champions.champion2) {
    return <div className="text-center">Select two champions to compare</div>;
  }

  const { champion1, champion2 } = champions;

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-2 gap-8">
        {/* Champion Headers */}
        <div className="text-center">
          <img
            src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-splashes/${champion1.key}/${champion1.key}000.jpg`}
            alt={champion1.name}
            className="w-full h-64 object-cover rounded-lg"
          />
          <h2 className="text-2xl font-bold mt-2">{champion1.name}</h2>
          <p className="text-gray-400">{champion1.title}</p>
        </div>
        <div className="text-center">
          <img
            src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-splashes/${champion2.key}/${champion2.key}000.jpg`}
            alt={champion2.name}
            className="w-full h-64 object-cover rounded-lg"
          />
          <h2 className="text-2xl font-bold mt-2">{champion2.name}</h2>
          <p className="text-gray-400">{champion2.title}</p>
        </div>

        {/* Base Stats Comparison */}
        <div className="col-span-2">
          <h3 className="text-xl font-bold mb-4 text-center">Base Stats Comparison</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center font-bold">
              {champion1.name}
            </div>
            <div className="text-center font-bold">
              {champion2.name}
            </div>
          </div>
          <ComparisonSection
            title="Health"
            value1={champion1.stats.hp}
            value2={champion2.stats.hp}
          />
          <ComparisonSection
            title="Attack Damage"
            value1={champion1.stats.attackdamage}
            value2={champion2.stats.attackdamage}
          />
          <ComparisonSection
            title="Armor"
            value1={champion1.stats.armor}
            value2={champion2.stats.armor}
          />
          <ComparisonSection
            title="Magic Resist"
            value1={champion1.stats.spellblock}
            value2={champion2.stats.spellblock}
          />
          <ComparisonSection
            title="Attack Speed"
            value1={champion1.stats.attackspeed}
            value2={champion2.stats.attackspeed}
          />
        </div>

        {/* Abilities Comparison */}
        <div className="col-span-2 mt-8">
          <h3 className="text-xl font-bold mb-4 text-center">Abilities</h3>
          <div className="grid grid-cols-2 gap-8">
            <div>
              {champion1.spells.map((spell, index) => (
                <div key={index} className="mb-4 p-4 bg-gray-800 rounded">
                  <h4 className="font-bold">{spell.name}</h4>
                  <p className="text-sm text-gray-400">{spell.description}</p>
                </div>
              ))}
            </div>
            <div>
              {champion2.spells.map((spell, index) => (
                <div key={index} className="mb-4 p-4 bg-gray-800 rounded">
                  <h4 className="font-bold">{spell.name}</h4>
                  <p className="text-sm text-gray-400">{spell.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChampionComparison;
