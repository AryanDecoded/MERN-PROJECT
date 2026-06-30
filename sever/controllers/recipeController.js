const PantryItem = require('../models/PantryItem');
const fetch = require('node-fetch');

// GET /api/recipes  — get AI recipe suggestions based on current pantry
const getRecipes = async (req, res) => {
  try {
    // Grab all non-expired pantry items
    const today = new Date();
    const items = await PantryItem.find({
      userId: req.user.id,
      expiryDate: { $gte: today },
    });

    if (items.length === 0) {
      return res.status(400).json({ message: 'No pantry items found to suggest recipes.' });
    }

    // Build a simple ingredient list string for the prompt
    const ingredientList = items.map(item => {
      const daysLeft = Math.ceil((new Date(item.expiryDate) - today) / (1000 * 60 * 60 * 24));
      return `${item.name} (${item.quantity} ${item.unit}, expires in ${daysLeft} day(s))`;
    }).join('\n');

    // Prompt for Gemini
    const prompt = `I have the following ingredients in my pantry:\n${ingredientList}\n\nSuggest 3 simple recipes I can cook using these ingredients. Prioritise ingredients that expire soonest. For each recipe, provide:\n1. Recipe name\n2. Ingredients used (from my pantry)\n3. Estimated cooking time\n\nRespond in this JSON format:\n[\n  {\n    "name": "Recipe Name",\n    "ingredients": ["item1", "item2"],\n    "cookingTime": "30 minutes",\n    "usesExpiringItems": true\n  }\n]`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const geminiData = await geminiRes.json();

    // Extract the text from Gemini response
    const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Parse the JSON from Gemini's response
    const jsonMatch = rawText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return res.status(500).json({ message: 'Could not parse recipes from AI response.' });
    }

    const recipes = JSON.parse(jsonMatch[0]);
    res.json({ recipes });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getRecipes };
