      // corona statistic
// scrape Corona csse_covid_19_daily_reports

const splitCsv = b => {
  // die regular expression schaut, ob ein komma innerhalb eines strings ist, oder nicht,
  // bevor der string beim komma geteilt wird.
  const matches = b.match(/(\s*"[^"]+"\s*|\s*[^,]+|,)(?=,|$)/g)

  // wenn keines der kommas in einem string ist,
  // dann teilen wir den string einfach beim komma
  if (!matches) {
    return b.split(',')
  }

  // wenn ein komma im string ist, dann muessen wir komplex splitten
  for (let n = 0; n < matches.length; ++n) {
    matches[n] = matches[n].trim()
    if (matches[n] == ',') {
      matches[n] = ''
    }
  }
  if (b[0] === ',') {
    matches.unshift("")
  }

  return matches
}

const getResults = async url => {
  const totals = {
    yesterday: 0,
    today: 0,
  }

  const response = await fetch(url)

  const body = await response.text()

  body.trim().split('\n').forEach((line, i) => {
    if (i === 0) {
      return
    }

    const parts = splitCsv(line)

    // parts ist hier ein array aus strings

    const [yesterday, today] = parts.map((part, i) => {
      if (i >= (parts.length - 2)) {
        return part
      }
    }).filter(a => a)

    totals.yesterday += parseInt(yesterday)
    totals.today += parseInt(today)
  })

  return totals
}
//window. globale var to add everything
window.load = async () => {
  try {
    const confirmedUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv`
    const deathUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv`
    const recoveredUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv`

    const confirmed = await getResults(confirmedUrl)
    const deaths = await getResults(deathUrl)
    const recovered = await getResults(recoveredUrl)

    console.log({ confirmed, deaths, recovered })
    const newCases = (confirmed.today - confirmed.yesterday) / confirmed.yesterday * 100
    const deathRate = (deaths.today - deaths.yesterday) / deaths.yesterday * 100 
    const recRate = (recovered.today - recovered.yesterday) / recovered.yesterday * 100
    const confRate = (confirmed.today - confirmed.yesterday)  / confirmed.yesterday * 100
    //const eventTest = new Event("eventTest");
    //eventTest.deaths = deaths;
    //eventTest.confirmed = confirmed;
    //s01.dispatchEvent(eventTest);

    const figure = document.getElementById('figure')
    figure.innerHTML = "confirmed " + confirmed.today + "<br>" + "deaths " +     deaths.today + "<br>" +   "recovered "  + recovered.today + "<br>" + "C " + confRate + "<br>" + "R " + recRate + "<br>" + "D " + deathRate;

    return { 
      newCases, 
      deathRate, 
      recRate, 
      confRate

    }


    } catch(e) {
      document.body.innerHTML = e
    }
    
}

load()