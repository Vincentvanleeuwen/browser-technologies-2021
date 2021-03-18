const a = document.getElementById("answer");

// var value = a.options[a.selectedIndex].value;
// const value = a[a.selectedIndex];

a.addEventListener('change', () => {
  const index = a.selectIndex;

  console.log(index)
})

