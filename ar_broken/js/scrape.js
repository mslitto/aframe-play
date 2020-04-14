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

const load = async () => {
  try {
    const confirmedUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv`
    const deathUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv`
     const recoveredUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv`

    const confirmed = await getResults(confirmedUrl)
    const deaths = await getResults(deathUrl)
    const recovered = await getResults(recoveredUrl)

    console.log({ confirmed, deaths, recovered })

    // hier wird die aframe funktion aufgerufen

  // aframe && events
  const s01 = document.querySelector('#sphere_01');
  //const s02 = document.querySelector('#sphere_02');
  //const s03 = document.querySelector('#sphere_03');

  const eventTest = new Event("eventTest");
  eventTest.deaths = deaths;
  eventTest.confirmed = confirmed;
  s01.dispatchEvent(eventTest);

  } catch(e) {
    document.body.innerHTML = e
  }
  // const defaultValue = -1
  // const deathRatio = (totals.confirmed / totals.deaths)
  // const deathBattle = ((totals.recovered / totals.confirmed) - (totals.deaths/ totals.confirmed))
  // const sickatHome = (totals.confirmed - totals.deaths - totals.recovered)

  // //scale sphere add EventListener
  // if (deathBattle < defaultValue) {
      // console.log(1)
  // } else {
      // console.log(0)
  // }

  // const figure = document.getElementById('figure')

  // figure.innerHTML = "confirmed " + totals.confirmed + "<br>" + "death " + totals.deaths + "<br>" + "recovered "  + totals.recovered + "<br>" + "sickatHome " + sickatHome +  "<br>" + deathBattle
}

load()






