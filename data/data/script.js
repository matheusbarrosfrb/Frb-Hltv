async function loadPlayerData() {
  try {
    const [profileRes, matchesRes] = await Promise.all([
      fetch('data/profile.json'),
      fetch('data/matches.json')
    ]);

    const profile = await profileRes.json();
    const matches = await matchesRes.json();

    calculateAndRenderStats(profile, matches);
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
  }
}

function calculateAndRenderStats(profile, matches) {
  let totalKills = 0;
  let totalDeaths = 0;
  let totalAssists = 0;
  let totalHeadshots = 0;
  let totalDamage = 0;
  let totalRounds = 0;
  let wins = 0;

  matches.forEach(m => {
    totalKills += m.kills;
    totalDeaths += m.deaths;
    totalAssists += m.assists;
    totalHeadshots += m.headshots;
    totalDamage += m.damage;
    totalRounds += m.rounds;
    if (m.result === 'win') wins++;
  });

  const totalMatches = matches.length;
  const kdRatio = totalDeaths > 0 ? (totalKills / totalDeaths).toFixed(2) : totalKills;
  const kdaRatio = totalDeaths > 0 ? ((totalKills + totalAssists) / totalDeaths).toFixed(2) : (totalKills + totalAssists);
  const hsPercent = totalKills > 0 ? ((totalHeadshots / totalKills) * 100).toFixed(1) : 0;
  const adr = totalRounds > 0 ? (totalDamage / totalRounds).toFixed(1) : 0;
  const winRate = totalMatches > 0 ? ((wins / totalMatches) * 100).toFixed(1) : 0;
  
  // Rating simplificado baseado no desempenho médio por round
  const rating = (parseFloat(kdRatio) * 0.6 + parseFloat(adr) / 100 * 0.4).toFixed(2);

  // Renderizar Cards de Resumo
  const summaryContainer = document.getElementById('summary-cards');
  summaryContainer.innerHTML = `
    ${createCard('Matches', totalMatches)}
    ${createCard('K/D Ratio', kdRatio)}
    ${createCard('HS %', `${hsPercent}%`)}
    ${createCard('ADR', adr)}
    ${createCard('Rating', rating)}
    ${createCard('Win Rate', `${winRate}%`)}
    ${createCard('Horas de Jogo', `${profile.hoursPlayed}h`)}
  `;

  // Renderizar Estatísticas Detalhadas
  const detailedContainer = document.getElementById('detailed-stats');
  detailedContainer.innerHTML = `
    ${createCard('Total Kills', totalKills)}
    ${createCard('Total Deaths', totalDeaths)}
    ${createCard('Total Assists', totalAssists)}
    ${createCard('K/D', kdRatio)}
    ${createCard('KDA', kdaRatio)}
    ${createCard('Headshots', totalHeadshots)}
  `;
}

function createCard(label, value) {
  return `
    <div class="stat-card">
      <span class="stat-label">${label}</span>
      <span class="stat-value">${value}</span>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', loadPlayerData);
