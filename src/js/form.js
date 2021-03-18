const a = document.getElementById("answer");

// var value = a.options[a.selectedIndex].value;
const value = a.options[select.selectedIndex];

a.addEventListener('change', () => {
  console.log(value)
})
