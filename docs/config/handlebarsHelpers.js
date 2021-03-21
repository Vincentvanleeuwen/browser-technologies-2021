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
  }
}
