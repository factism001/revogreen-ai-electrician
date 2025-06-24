import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
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
