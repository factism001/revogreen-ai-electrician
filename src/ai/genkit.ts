import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import Handlebars from 'handlebars';

// Register the 'eq' helper
Handlebars.registerHelper('eq', function(arg1, arg2) {
  return arg1 === arg2;
});

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
  handlebars: {
    helpers: {
      eq: function(arg1, arg2) {
        return arg1 === arg2;
      }
    }
  }
});
