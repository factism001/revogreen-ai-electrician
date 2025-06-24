import Handlebars from 'handlebars';

// Register the 'eq' helper
Handlebars.registerHelper('eq', function(arg1, arg2) {
  return arg1 === arg2;
});

// You can add other helpers as needed
// Handlebars.registerHelper('neq', function(arg1, arg2) {
//   return arg1 !== arg2;
// });

export default Handlebars;
