const dragEls = document.querySelectorAll('.poll');
const titleEl = document.querySelector('.poll-title');
const dropZoneEl = document.querySelector('.poll-drop-zone');
const positionEl = document.querySelectorAll('.tool-position-drag')
const upEl = document.querySelectorAll('.tool-position-up')
const downEl = document.querySelectorAll('.tool-position-down')
let clone = '';
let dragIndex = 0;
const database = firebase.database()
const pollRef = database.ref(`poll-list/${titleEl.innerHTML}/polls`)

if('draggable' in document.createElement('span')) {
  console.log("Drag support detected");

// Enhance the buttons
  positionEl.forEach(item => {
    item.classList.toggle('hidden');
  })
  upEl.forEach(item => {
    item.classList.toggle('hidden');
  })
  downEl.forEach(item => {
    item.classList.toggle('hidden');
  })

  dragEls.forEach(dragEl => {

    dragEl.addEventListener('dragstart', dragHandler)
    dragEl.addEventListener('dragover', (event) => {
      event.preventDefault();
    })
    dragEl.addEventListener('drop', dropHandler)
  })

  dropZoneEl.addEventListener('dragover', (event) => {
    event.preventDefault();
  })

  function dragHandler(event) {

    event
    .dataTransfer
    .setData('text/plain', event.currentTarget.id);

    event.currentTarget.classList.add('dragging')

  }

  function dropHandler(event) {
    event.preventDefault();

    // Get most parent element.
    clone = event.currentTarget.cloneNode(true);

    // Get dragged element ID
    let data = event.dataTransfer.getData('text')

    // Get all draggable children
    let nodeList = document.querySelectorAll('.poll-drop-zone > *')

    for (let i = 0; i < nodeList.length; i++) {
      if (nodeList[i].id === data) {
        // Set the dragindex as dragged element id
        dragIndex = i;
        break
      }
    }

    // Get the dragged element
    let selectedPoll = document.getElementById(data);

    // Modify position for Firebase (needs +1)
    const newPosition = parseInt(event.currentTarget.id) + 1
    let oldPosition = parseInt(data) + 1

    // If released on the same target
    if (data === event.currentTarget.id) return
    // console.log(data, dragIndex, event.currentTarget.id)
    console.log(selectedPoll, event.currentTarget)

    // Set dragged element id to new id
    selectedPoll.id = clone.id
    dropZoneEl.replaceChild(selectedPoll, event.currentTarget);

    // Set old id to dragged element id
    clone.id = data
    dropZoneEl.insertBefore(clone, dropZoneEl.children[dragIndex]);

    // Reset the eventlisteners
    clone.addEventListener('drop', dropHandler);
    clone.addEventListener('dragstart', dragHandler);
    selectedPoll.addEventListener('drop', dropHandler);
    selectedPoll.addEventListener('dragstart', dragHandler);

    pollRef.once('value').then(snap => {
      // Change previous item position.
      snap.forEach(shot => {
        console.log('shot.val()', shot.val().position, newPosition, oldPosition)

        if (shot.val().position === newPosition) {
          pollRef.child(`${shot.key}`).child('position').set(oldPosition)
          .then((res) => console.log('Updated old position', res))
          .catch(err => console.log('error updating', err));
        } else if (shot.val().position === oldPosition) {
          pollRef.child(`${shot.key}`).child('position').set(newPosition)
          .then((res) => console.log('Updated old position', res))
          .catch(err => console.log('error updating', err));
        }
      })
    }).catch(err => console.log(err))

    selectedPoll.classList.add('drag-animation')
    setTimeout(() => {
      selectedPoll.classList.remove('dragging')
      selectedPoll.classList.remove('drag-animation')
    }, 1000)

  }
}

