const a = document.getElementById("answer");
const addAnswerEl = document.querySelector('.add-answer');
const multipleAnswersEl = document.querySelector('.multiple');

let countClicks = 0;

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


// Add multiple answers to your question
if(addAnswerEl) {
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


}
