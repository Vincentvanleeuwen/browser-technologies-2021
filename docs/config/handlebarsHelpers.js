// Handlebars.registerHelper('switch', function(value, options) {
//   this.switch_value = value;
//   return options.fn(this);
// });
//
// Handlebars.registerHelper('case', function(value, options) {
//   if (value === this.switch_value) {
//     return options.fn(this);
//   }
// });

module.exports = {
  switch: (value, options) => {
    this.switch_value = value;
    return options.fn(this);
  },
  case: (value, options) => {
    if (value === this.switch_value) {
      return options.fn(this);
    }
  },
  getResultsForAnswer: (key, results) => {
    return results[key]
  },
  getAmountPlayers: (results) => {
    let count = 0;
    console.log('amount of palyers', results)

    count += results['0'] + results['1']

    console.log(results['0'])
    if(results['2']) { count += results['2']}
    if(results['3']) { count += results['3']}
    if(results['4']) { count += results['4']}
    console.log(count)
    return count
  }
}

