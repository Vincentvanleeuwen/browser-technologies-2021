const a = document.getElementById("answer")
const multipleAnswersEl = document.querySelector('.multiple')
const label = document.querySelector('label[for="answerB"]')

let countClicks = 0


// Functions for Add Poll
if(window.location.pathname.includes('/add-poll')) {

    label.insertAdjacentHTML("afterend", " <button class=\"add-answer\">Add Answer</button>");

    const addAnswerEl = document.querySelector('.add-answer')

    // Add multiple answers to your question
    addAnswerEl.addEventListener('click', (e) => {
      e.preventDefault()

      let newAnswer;
      countClicks++
      if(countClicks < 4) {
        if(countClicks === 1) {
          newAnswer = 'C'
        } else if(countClicks === 2) {
          newAnswer = 'D'
        } else if(countClicks === 3) {
          newAnswer = 'E'
        } else {
          addAnswerEl.disabled = true
          return;
        }
      } else {
        return;
      }

      const newAnswerLabel = document.createElement('Label')
      newAnswerLabel.setAttribute('for', 'answer' + newAnswer)
      newAnswerLabel.innerHTML = newAnswer;
      const newAnswerInput = document.createElement('Input')
      newAnswerInput.setAttribute('type', 'text')
      newAnswerInput.setAttribute('name', 'answer' + newAnswer)

      newAnswerLabel.appendChild(newAnswerInput)
      addAnswerEl.parentNode.insertBefore(newAnswerLabel, addAnswerEl);
    })


  // Change question answer type
  if(a) {
    a.addEventListener('change', () => {
      const answer = a.value;

      if(answer === 'multiple') {
        multipleAnswersEl.style.display = 'flex';
      } else {
        multipleAnswersEl.style.display = 'none';
      }
    })
  }

}

