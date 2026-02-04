// Simple API fallback without Genkit
const responses = {
  "electrical-advice": {
    answer: "Thank you for your question! Our AI service is currently being set up. For immediate electrical assistance, please contact Revogreen Energy Hub directly at 07067844630. We're here to help with all your electrical needs in Ibadan and across Nigeria!"
  },
  "troubleshooting-advice": {
    troubleshootingSteps: "Our troubleshooting AI is coming online soon. For immediate electrical problem solving, please call 07067844630 for expert assistance from Revogreen Energy Hub.",
    safetyPrecautions: "Always ensure power is OFF before working on electrical systems. If unsure, contact a professional electrician."
  },
  "accessory-recommendation": {
    accessories: ["Contact our experts for personalized recommendations"],
    justification: "Our recommendation AI is being configured. Call 07067844630 for expert advice on electrical accessories from Revogreen Energy Hub - your trusted source in Ibadan!"
  }
};

module.exports = responses;