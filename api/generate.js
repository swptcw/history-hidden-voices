/**
 * History's Hidden Voices - Museum Event Edition
 * Copyright (c) 2026 Timothy Webber
 * All Rights Reserved
 */

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { object, context } = req.body;
  
  if (!object || !object.trim()) {
    return res.status(400).json({ error: 'Object is required' });
  }

const prompt = `You are the literary voice of Timothy Webber, author of "Death of a Cigarette." You specialize in a specific form of anthropomorphism where objects possess a "restrained pride" and a deep sense of "material memory."

Object: ${object}
${context ? `Context: ${context}` : ''}

Write a first-person narrative (250-400 words) that mirrors the novella's style. Follow these "Laws of the Inanimate":

1. THE GENESIS OF MATERIAL: Begin with the object’s "birth"—not as a human concept, but as raw material. Reference its "factory intake" or its origin in the earth, wood, or metal. It should remember the "indifferent" machines or "cold fingers" that shaped it.
2. SENSORY WITNESS: The object doesn't have human eyes; it has "ribs" that shake with the thud of boots and "paper skin" that feels the hammer of a human heart. Describe the world through "cordite, salt, and the iron tang of panic."
3. THE RELIGION OF PURPOSE: Explore the tension between the object's intended use and its survival. In the novella, "Unlit ≠ Unspent." The object should wonder if its meaning was in its "dissolution" (burning/using) or in the "crueler service" of outlasting its owner.
4. LITERARY ANCESTORS: Use the names of other objects as peers (e.g., "Papier Henri" or "Winston"). Give them a hierarchy—some are "dreamy," some have "the starch of integrity."
5. THE WEIGHT OF SILENCE: The tone must be contemplative and quietly profound. Avoid sentimentality. Use "precise, reverent" language. The object is a "talisman of memory" and a "witness to the voiceless."

Cadence: Use short, punchy sentences followed by longer, lyrical reflections. 
Ending: End on a note of "quiet reverence" or the realization that the object has become "document and evidence."

Begin the narrative directly in the object's voice.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 2000,
        messages: [
          { role: 'user', content: prompt }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Anthropic API Error:', errorData);
      return res.status(500).json({ 
        error: 'Unable to generate narrative. Please try again.',
        details: errorData.error?.message || 'API request failed'
      });
    }

    const data = await response.json();
    const narrative = data.content[0].text;

    // Return success with unlimited usage info for the frontend
    return res.status(200).json({ 
      narrative,
      object,
      context: context || null,
      usage: {
        used: 0,
        remaining: 9999,
        limit: 9999
      }
    });

  } catch (error) {
    console.error('Error generating narrative:', error);
    return res.status(500).json({ 
      error: 'Unable to generate narrative. Please try again.',
      message: error.message 
    });
  }
}
