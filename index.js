document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Content Loaded :)')
  const bulletDiv = document.querySelector('#bullet-div')
  const form = document.querySelector('#create-bullet')
  const prioritiesInputTag = document.querySelector('#priorities')
  const gratitudeInputTag = document.querySelector('#gratitude')
  const accomplishmentsInputTag = document.querySelector('#accomplishments')
  const improvementsInputTag = document.querySelector('#accomplishments')
  let url = 'http://localhost:3000/api/bullets'
  let bullets;

  // get the card that's clicked
  // these are the props for my form that i need to copy:
  // const image = card.querySelector('img').src
  // const date = card.querySelector('span.card-title').innerText

  // or if you have local state
  // id = card.dataset.id
  // bullet = bullets.find(id)
  // image = bullet.image
  // date = bullet.date


  fetch(url)
    .then(resp => resp.json())
    .then((function (json) {
      bullets = json
      bullets.forEach(bullet => {
        bulletDiv.innerHTML += `
        <div class="row s6">
        <div class="col s6">
             <div class="card">
      <div class="card-image waves-effect waves-block waves-light">
        <img class="activator" src="${bullet.img_url}">
      </div>
      <div class="card-content">
          <span class="card-title activator grey-text text-darken-4">${bullet.date}<i class="small material-icons right">arrow_upward</i></span>
      </div>
      <div class="card-reveal">
        <span class="card-title grey-text text-darken-4">BULLET.<i class="material-icons right">close</i></span>
        <h4>Day Log</h4>
        <h6>Top Priorities</h6>
        <p>${bullet.priorities}</p>
        <h6>I am Grateful For</h6>
        <p>${bullet.gratitude}</p>
        <h4>Night Log</h4>
        <h6>I Accomplished</h6>
        <p>${bullet.accomplishments}</p>
        <h6>I Will Improve</h6>
        <p>${bullet.improvements}</p>
      </div>
    </div>
    </div>
    </div>
            `
      })

    }))


  form.addEventListener('submit', e => {
    e.preventDefault()
    console.log(e.target.dataset.action === 'save-bullet')
    if (e.target.dataset.action === 'save-bullet') {
      const priorities = prioritiesInputTag.vaue
      const gratitude = gratitudeInputTag.value
      const accomplishments = accomplishmentsInputTag.value
      const improvements = improvementsInputTag.value

      fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            priorities: (priorities),
            gratitude: (gratitude),
            accomplishments: (accomplishments),
            improvements: (improvements)
          })
        })
        .then(res => res.json())
        .then(function (newBullet) {
          return bulletDiv.innerHTML += `
        <div class="card">
      <div class="card-image waves-effect waves-block waves-light">
        <img class="activator" src="${newBullet.img_url}">
      </div>
      <div class="card-content">
          <span class="card-title activator grey-text text-darken-4">${newBullet.date}<i class="small material-icons right">arrow_upward</i></span>
      </div>
      <div class="card-reveal">
        <span class="card-title grey-text text-darken-4">BULLET.<i class="material-icons right">close</i></span>
        <h4>Day Log</h4>
        <h6>Top Priorities</h6>
        <p>${newBullet.priorities}</p>
        <h6>I am Grateful For</h6>
        <p>${newBullet.gratitude}</p>
        <h4>Night Log</h4>
        <h6>I Accomplished</h6>
        <p>${newBullet.accomplishments}</p>
        <h6>I Will Improve</h6>
        <p>${newBullet.improvements}</p>
      </div>
    </div>
        `
        })
    }
    form.reset()
  })

})