const split = b => {
  const matches = b.match(/(\s*"[^"]+"\s*|\s*[^,]+|,)(?=,|$)/g);
  if (!matches) {
    return b.split(',');
  }
  for (let n = 0; n < matches.length; ++n) {
      matches[n] = matches[n].trim();
      if (matches[n] == ',') matches[n] = '';
  }
  if (b[0] === ',') matches.unshift("");
  return matches;
}

const load = async () => {
  const totals_ = {
    recovered_: 0,
    deaths_: 0,
    confirmed_: 0,
  }

  try {
    const date = new Date()
    let month = date.getMonth() + 1
    let day = date.getDate() - 2
    if (day <= 9) {
      day = `0${day}`
    }
    if (month <= 9) {
      month = `0${month}`
    }
    
    const url = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/${month}-${day}-2020.csv`
    console.log({url})
    const response = await fetch(url)

	const body = await response.text()

    body.trim().split('\n').map((line, i) => {
      if (i === 0) {
        return
      }
      const [
        fips,
        admin2,
        province,
        country,
        timestamp,
        lat,
        long,
        confirmed_,
        deaths_,
        recovered_,
        active,
        combined,
      ] = split(line)

      totals_.confirmed_ += parseInt(confirmed_, 10)
      totals_.deaths_ += parseInt(deaths_, 10)
      totals_.recovered_ += parseInt(recovered_, 10)
    })

  
  } catch(e) {
    document.body.innerHTML = e
  }




load()