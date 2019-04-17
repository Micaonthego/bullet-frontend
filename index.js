document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Content Loaded :)')
  const bulletDiv = document.querySelector('#bullet-div')
  const form = document.querySelector('#bullet-form')
  const prioritiesInputTag = document.querySelector('#priorities')
  const gratitudeInputTag = document.querySelector('#gratitude')
  const accomplishmentsInputTag = document.querySelector('#accomplishments')
  const improvementsInputTag = document.querySelector('#improvements')
  const editPrioritiesInputTag = document.querySelector('#edit-priorities')
  const editGratitudeInputTag = document.querySelector('#edit-gratitude')
  const editAccomplishmentsInputTag = document.querySelector('#edit-accomplishments')
  const editImprovementsInputTag = document.querySelector('#edit-improvements')
  const img_urlInputTag = document.querySelector('#change-photo')
  let url = "http://localhost:3000/api/bullets"
  let userUrl = "http://localhost:3000/api/users"
  const imageForm = document.querySelector('#change-image')
  const editForm = document.querySelector('#edit-form')
  const usernameForm = document.querySelector('#username-form')
  const usernameInput = document.querySelector('#username-input')
  const aspirationInput = document.querySelector('#user-aspire')

  let bullets;
  let bulletId;

  usernameForm.addEventListener('submit', e => {
    e.preventDefault()
    const aspiration = aspirationInput.value
    const username = usernameInput.value
    console.log("submitted")
    fetch(userUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          username,
          aspiration
        })
      })
      .then(res => res.json())
      .then(newUser => {
        usernameForm.innerHTML = `<h1>${newUser.username}</h1>
                                  <h2>${newUser.aspiration}</h2>`

      })
  })


  fetch(url)
    .then(resp => resp.json())
    .then((function (bullets) {
      console.log('bullets', bullets)
      bullets.forEach(bullet => {
        return renderBullets(bullet)
      })

    }))


  form.addEventListener('submit', e => {
    e.preventDefault()
    console.log(e.target)
    const prioritiesInput = prioritiesInputTag.value
    const gratitudeInput = gratitudeInputTag.value
    const accomplishmentsInput = accomplishmentsInputTag.value
    const improvementsInput = improvementsInputTag.value

    fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          priorities: prioritiesInput,
          gratitude: gratitudeInput,
          accomplishments: accomplishmentsInput,
          improvements: improvementsInput
        })
      })
      .then(res => res.json())
      .then(function (bullet) {
        return renderBullets(bullet)
      })
    form.reset()
  })

  bulletDiv.addEventListener('click', e => {
    bulletId = parseInt(e.target.dataset.id)
    if (e.target.dataset.action === 'edit') {
      // console.log(bulletId)
      // console.log(e.target.parentNode)
      // console.log(e.target.parentNode.querySelector('#edit-form'))
      // console.log(editForm)
      editForm.setAttribute("style", "visible")
      // editForm.style.visibility = "visible"
      fetch(`${url}/${bulletId}`)
        .then(res => res.json())
        .then(bullets => {
          console.log(bullets)
          const editPrioritiesInput = editPrioritiesInputTag
          const editGratitudeInput = editGratitudeInputTag
          const editAccomplishmentsInput = editAccomplishmentsInputTag
          const editImprovementsInput = editImprovementsInputTag

          editPrioritiesInput.value = bullets.priorities
          editGratitudeInput.value = bullets.gratitude
          editAccomplishmentsInput.value = bullets.accomplishments
          editImprovementsInput.value = bullets.improvements
        })
    }
  })

  editForm.addEventListener('submit', e => {
    e.preventDefault()
    const editBulletBtn = e.target.querySelector('#edit-bullet')
    if (editBulletBtn.dataset.action === 'edit-bullet') {
      const editPrioritiesInput = editPrioritiesInputTag
      const editGratitudeInput = editGratitudeInputTag
      const editAccomplishmentsInput = editAccomplishmentsInputTag
      const editImprovementsInput = editImprovementsInputTag
      const newPrioritiesInput = editPrioritiesInput.value
      const newGratitudeInput = editGratitudeInput.value
      const newAccomplishmentsInput = editAccomplishmentsInput.value
      const newImprovementsInput = editImprovementsInput.value

      fetch(`${url}/${bulletId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            priorities: newPrioritiesInput,
            gratitude: newGratitudeInput,
            accomplishments: newAccomplishmentsInput,
            improvements: newImprovementsInput
          })
        })
        .then(res => res.json())
        .then(bullet => {
          const pri = document.querySelector(`#pri-${bullet.id}`)
          const gra = document.querySelector(`#gra-${bullet.id}`)
          const acp = document.querySelector(`#acp-${bullet.id}`)
          const imp = document.querySelector(`#imp-${bullet.id}`)
          pri.innerText = bullet.priorities
          gra.innerText = bullet.gratitude
          acp.innerText = bullet.accomplishments
          imp.innerText = bullet.improvements
        })
      editForm.reset()
      editForm.style.visibility = "hidden"
    }
  })


  bulletDiv.addEventListener('click', e => {
    bulletId = parseInt(e.target.dataset.id)
    if (e.target.dataset.action === 'add-photo') {
      // console.log('clicked')
      // console.log(bulletId)
      imageForm.style.visibility = "visible"
    }
  })

  imageForm.addEventListener('submit', e => {
    e.preventDefault()
    console.log(e.target)
    const savePhotoBtn = e.target.querySelector('#save-photo')
    if (savePhotoBtn.dataset.action === 'save-photo') {
      const img_urlInput = img_urlInputTag.value

      console.log(img_urlInput)
      fetch(`${url}/${bulletId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            img_url: img_urlInput
          })
        })
        .then(res => res.json())
        .then(bullet => {
          const image = document.querySelector(`#image[data-id="${bulletId}"]`)
          console.log(image)
          image.src = bullet.img_url
        })
      imageForm.reset()
      imageForm.style.visibility = "hidden"
    }
  })

  bulletDiv.addEventListener('click', e => {
    bulletId = parseInt(e.target.dataset.id)
    if (e.target.dataset.action === 'delete') {
      // console.log('clicked')
      // console.log(bulletId)
      fetch(`${url}/${bulletId}`, {
          method: 'delete'
        })
        .then(res => res.json())
        .then(bulletDeleted => {
          const deletedCard = document.querySelector(`#card-${bulletDeleted.id}`)
          deletedCard.remove()
        })

    }
  })

  function renderBullets(bullet) {
    return bulletDiv.innerHTML += `
        <div class="row">
        <div class="col s4">
             <div id="card-${bullet.id}" class="card">
        <div class="card-image waves-effect waves-block waves-light">
        <img id='image' data-id=${bullet.id} src="${bullet.img_url}">
        </div>
        <div class="card-content">
          <span class="card-title activator grey-text text-darken-4">${bullet.date}<i class="small material-icons right">arrow_upward</i></span><i data-id=${bullet.id} data-action='add-photo' class="tiny material-icons left">add_a_photo</i>
        </div>
        <div class="card-reveal">
        <span class="card-title grey-text text-darken-4"><i class="material-icons right">close</i></span>
        <i id='delete' data-id=${bullet.id} data-action='delete' class="tiny material-icons right">delete</i><i data-id=${bullet.id} data-action='edit' class="tiny material-icons right">edit</i>
        <i class = "material-icons prefix tiny"> brightness_low</i>
        <p><b>Top Priorities</b></p>
        <p id="pri-${bullet.id}">${bullet.priorities}</p>
        <p><b>I am Grateful For</b></p>
        <p id="gra-${bullet.id}">${bullet.gratitude}</p>
        <i class="material-icons prefix tiny">brightness_2</i>
        <p><b>Today I Accomplished</b></p>
        <p id="acp-${bullet.id}">${bullet.accomplishments}</p>
        <p><b>Tomorrow I Will Improve</b></p>
        <p id="imp-${bullet.id}">${bullet.improvements}</p>
      </div>
    </div>
    </div>
    </div>
            `
  }

})