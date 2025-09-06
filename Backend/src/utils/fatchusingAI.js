const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Find the nearest picker using Gemini, considering both lat/lng and structured address.
 */
exports.findNearestPicker = async (pickers, waste) => {
  const prompt = `
You are given:
1. A waste pickup request with its latitude, longitude, and structured address.
2. A list of pickers with their latitude, longitude, and structured addresses.

Your task:
- Determine the picker closest to the waste location.
- If latitude/longitude is missing for a picker, estimate distance using city/state/pinCode.
- Return ONLY a JSON object with the nearest picker's ID.

Waste Location:
Lat: ${waste.lat ?? "N/A"}
Lng: ${waste.lng ?? "N/A"}
Address: ${JSON.stringify(waste.address)}

Pickers:
${pickers.map(p => `
ID: ${p._id}
Lat: ${p.location?.lat ?? "N/A"}
Lng: ${p.location?.lng ?? "N/A"}
Address: ${JSON.stringify(p.address)}
`).join("\n")}

Respond ONLY in this exact JSON format:
{ "picker_id": "<nearest_picker_id>" }
`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    // Get text and remove markdown fences/backticks
    let jsonText = result.response.text().trim();
    jsonText = jsonText.replace(/```json|```/g, "").trim();

    const json = JSON.parse(jsonText);
    return pickers.find(p => p._id.toString() === json.picker_id) || null;

  } catch (err) {
    console.error("Error in findNearestPicker Gemini call:", err);
    return null;
  }
};


