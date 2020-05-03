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

const load = async () => {
  try {
    const url = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series'
    const confirmedUrl = `${url}/time_series_covid19_confirmed_global.csv`
    const deathUrl = `${url}/time_series_covid19_deaths_global.csv`
    const recoveredUrl = `${url}/time_series_covid19_recovered_global.csv`

    const confirmed = await getResults(confirmedUrl)
    const deaths = await getResults(deathUrl)
    const recovered = await getResults(recoveredUrl)

    console.log({ confirmed, deaths, recovered })
    const newCases = (confirmed.today - confirmed.yesterday) / confirmed.yesterday * 100
    const deathRate = (deaths.today - deaths.yesterday) / deaths.yesterday * 100
    const recRate = (recovered.today - recovered.yesterday) / recovered.yesterday * 100
    const confRate = (confirmed.today - confirmed.yesterday)  / confirmed.yesterday * 100

    const figure1 = document.getElementById('figure1')
    figure1.innerHTML = "confirmed " + confirmed.today + "<br>" + "deaths " +     deaths.today + "<br>" +   "recovered "  + recovered.today + "<br>" + "C " + confRate + "<br>" + "R " + recRate + "<br>" + "D " + deathRate

    return {
      newCases,
      deathRate,
      recRate,
      confRate,
    }
  } catch(e) {
    document.body.innerHTML = e
    return {}
  }
  return {}
}

//Playbutton for video
const play = id => {
  const aVideoAsset = document.querySelector('#' + id)

  aVideoAsset.play().catch(error => {
    aVideoAsset.pause()
    hideOrShow("playButton")
  })

  aVideoAsset.setAttribute('loop', 'true')
  hideOrShow('playButton')
}

const hideOrShow = id => {
  const x = document.getElementById(id)
  if (x.style.display === "none") {
    x.style.display = "block"
  } else {
    x.style.display = "none"
  }
}


AFRAME.registerComponent("animate-png", {
  init: function() {
    // load the .pngs
    let loader = new THREE.TextureLoader()
    this.pngArray = []
    this.pngArray.push(loader.load('assets/04/frame_00000.png'))
    this.pngArray.push(loader.load('assets/04/frame_00002.png'))
    this.pngArray.push(loader.load('assets/04/frame_00003.png'))
    this.pngArray.push(loader.load('assets/04/frame_00004.png'))
    this.pngArray.push(loader.load('assets/04/frame_00005.png'))

    this.el.addEventListener('loaded', e => {
      let mesh = this.el.getObject3D("mesh")
      this.material = mesh.material

      let i = 0
      this.id = setInterval(e => {
        if (i >= this.pngArray.length) {
          i = 0
        }
        this.material.map = this.pngArray[i++]
        this.material.needsUpdate = true
      }, 6000)
    })
  },

})



const scene = document.querySelector('a-scene')

//async function
const run = async () => {
  const { confRate, deathRate, recRate } = await load()

  console.log({ confRate, deathRate, recRate, confRate })

  //L1
  const sphere_1 = document.querySelector("#L1")
  const anim_1op = sphere_1.getAttribute("animation__1op")
  const anim_1sc = sphere_1.getAttribute("animation__1sc")
  const anim_1dis = sphere_1.getAttribute("animation__1dis")
  const anim_1rot = sphere_1.getAttribute("animation__1rot")

  //L2
  const sphere_2 = document.querySelector("#L2")
  const anim_2op = sphere_2.getAttribute("animation__2op")
  const anim_2sc = sphere_2.getAttribute("animation__2sc")
  const anim_2dis = sphere_2.getAttribute("animation__2dis")
  const anim_2rot = sphere_2.getAttribute("animation__2rot")

  //L3
  const sphere_3 = document.querySelector("#L3")
  const anim_3op = sphere_3.getAttribute("animation__3op")
  const anim_3sc = sphere_3.getAttribute("animation__3sc")
  const anim_3dis = sphere_3.getAttribute("animation__3dis")
  const anim_3rot = sphere_3.getAttribute("animation__3rot")

  const figure1 = document.getElementById('figure1')
  const figure2 = document.getElementById('figure2')

  // confirmed Z1 Z2 Z3
  if (confRate > 0.01) {
    if (confRate <= 3) {
      // Z1
      figure1.innerHTML = "is ok"
    } else if (confRate <= 5) {
      // Z2
      figure1.innerHTML = "FUCK"
    } else {
      // Z3
      figure1.innerHTML = "very FUCK"
    }
  }
  // C = 0
  if(confRate === 0) {
    figure1.innerHTML = "healthy"
  }
  // deaths Z! Z2 Z3
  if (deathRate > 2) {
    if (deathRate <= 5) {
      // Z1
      figure2.innerHTML = "high//deaths"
    } else if (deathRate <= 10) {
      // Z2
      figure2.innerHTML = "unstopable"
    } else {
      // Z3
      figure2.innerHTML = "good bye"
    }
  }

  if(deathRate > recRate) {
    figure2.innerHTML = "Dˆ > Rˆ"
  } else {
    figure2.innerHTML = "Dˆ < Rˆ"
  }

  sphere_1.setAttribute("animation__1op", anim_1op)
  sphere_1.setAttribute("animation__1sc", anim_1sc)
  sphere_1.setAttribute("animation__1dis", anim_1dis)
  sphere_1.setAttribute("animation__1rot", anim_1rot)

  sphere_2.setAttribute("animation__2op", anim_2op)
  sphere_2.setAttribute("animation__2sc", anim_2sc)
  sphere_2.setAttribute("animation__2dis", anim_2dis)
  sphere_2.setAttribute("animation__2rot", anim_2rot)

  sphere_3.setAttribute("animation__3op", anim_3op)
  sphere_3.setAttribute("animation__3sc", anim_3sc)
  sphere_3.setAttribute("animation__3dis", anim_3dis)
  sphere_3.setAttribute("animation__3rot", anim_3rot)
}

if (scene.hasLoaded) {
  run()
} else {
  scene.addEventListener('loaded', run)
}
