import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Check if API key is available
const apiKey = process.env.GOOGLE_GENAI_API_KEY;

export const ai = genkit({
  plugins: apiKey ? [googleAI()] : [],
  model: apiKey ? 'googleai/gemini-2.0-flash' : undefined,
  handlebars: {
    helpers: {
      eq: function(arg1, arg2) {
        return arg1 === arg2;
      }
    }
  }
});
