document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Content Loaded :)')

  // grab all dom nodes that exist on the page
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
  const imageForm = document.querySelector('#change-image')
  const editForm = document.querySelector('#edit-form')
  const usernameForm = document.querySelector('#username-form')
  const usernameInput = document.querySelector('#username-input')
  const aspirationInput = document.querySelector('#user-aspire')
  // create variables for endpoints
  let url = "http://localhost:3000/api/bullets"
  let userUrl = "http://localhost:3000/api/users"
  // let bullets; 
  // create variable of bulletId in global state to access in any functions/listeners where needed
  let bulletId;
  // add an el on form to create a new user
  usernameForm.addEventListener('submit', e => {
    // prevent page refresh for ability to manipulate dom
    e.preventDefault()
    // create variables for the value of 2 input tags in form
    const aspiration = aspirationInput.value
    const username = usernameInput.value
    // check that submit event is working
    // console.log("submitted")
    // created fetch post to udpate the database
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
        // update the dom 
        usernameForm.innerHTML = `<h3>${newUser.username}</h3>
                                  <h5>${newUser.aspiration}</h5>`

      })
    usernameForm.reset()
  })

  // initial fetch request to render all bullets to the dom
  // call function renderBullets(bullet) to append them to the dom
  fetch(url)
    .then(resp => resp.json())
    .then((function (bullets) {
      // console.log('bullets', bullets)
      bullets.forEach(bullet => {
        return renderBullets(bullet)
      })

    }))

  // add el on form to create a new bullet
  form.addEventListener('submit', e => {
    e.preventDefault()
    console.log(e.target)
    // grab all input values
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
        // call function to render bullets to the dom including newly created bullet
        return renderBullets(bullet)
      })
    // resets the form so values do not stay in input fields
    form.reset()
  })

  bulletDiv.addEventListener('click', e => {
    // set bulletId to clicked bullet, this is possible bc edit icon has data-id of bullet.id interpolated in HTML
    bulletId = parseInt(e.target.dataset.id)
    if (e.target.dataset.action === 'edit') {
      // console.log(bulletId)
      // if edit is clicked, form will be visible
      editForm.style.display = "block"
      // get data from backend of particular bullet 
      fetch(`${url}/${bulletId}`)
        .then(res => res.json())
        .then(bullets => {
          // console.log(bullets)
          editPrioritiesInputTag.value = bullets.priorities
          editGratitudeInputTag.value = bullets.gratitude
          editAccomplishmentsInputTag.value = bullets.accomplishments
          editImprovementsInputTag.value = bullets.improvements
        })
    }
  })
  //  add el on form to update a particular bullet
  editForm.addEventListener('submit', e => {
    e.preventDefault()
    const editBulletBtn = e.target.querySelector('#edit-bullet')
    if (editBulletBtn.dataset.action === 'edit-bullet') {
      //
      const newPrioritiesInput = editPrioritiesInputTag.value
      const newGratitudeInput = editGratitudeInputTag.value
      const newAccomplishmentsInput = editAccomplishmentsInputTag.value
      const newImprovementsInput = editImprovementsInputTag.value

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
      editForm.style.display = "none"
    }
  })


  bulletDiv.addEventListener('click', e => {
    bulletId = parseInt(e.target.dataset.id)
    if (e.target.dataset.action === 'add-photo') {
      // console.log('clicked')
      // console.log(bulletId)
      imageForm.style.display = "block"
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
      imageForm.style.display = "none"
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
      usernameForm.reset()
    }
  })

  function renderBullets(bullet) {
    return bulletDiv.innerHTML += `
        <div class="col s4">
             <div id="card-${bullet.id}" class="card">
        <div class="card-image waves-effect waves-block waves-light">
        <img id='image' data-id=${bullet.id} src="${bullet.img_url}">
        </div>
        <div class="card-content">
          <span class="card-title activator grey-text text-darken-4">${bullet.date}<i class="small material-icons right">arrow_upward</i></span><i data-id=${bullet.id} data-action='add-photo' class="tiny material-icons left">add_a_photo</i><i id='empty-heart' data-id=${bullet.id} data-action='fill-heart' class="tiny material-icons  left">favorite_border</i>
        </div>
        <div class="card-reveal">
        <span class="card-title grey-text text-darken-4"><i class="material-icons right">close</i></span>
        <i id='delete' data-id=${bullet.id} data-action='delete' class="tiny material-icons right">delete</i><i data-id=${bullet.id} data-action='edit' class="tiny material-icons right">edit</i>
        <i class = "material-icons prefix tiny"> brightness_low</i>
        <p><b>Top Priority</b></p>
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
            `
  }

})