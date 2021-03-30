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
  },
  makeUrlSafe: (name) => {
    return name.toLowerCase().replace(/\s+/g, '-')
  },
  eachSorted: (context, options) => {
    let ret = ""
    Object.keys(context).sort().forEach(function(key) {
      ret = ret + options.fn({key: key, value: context[key]})
    })
    return ret
  },
  isNotTopPosition: (context) => {
    return context !== 1
  },
  isNotBottomPosition: (context, position) => {
    console.log(context);
    if(Object.keys(context).length !== position) return context
  }
}

