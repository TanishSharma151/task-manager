const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

exports.smartSuggest = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Task title is required' });
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: `Given this task title: "${title}"
          
Suggest 3-5 relevant sub-tasks and 3-5 relevant tags.

Respond ONLY with a valid JSON object, no markdown, no extra text:
{
  "subtasks": ["subtask 1", "subtask 2", "subtask 3"],
  "tags": ["tag1", "tag2", "tag3"]
}`
        }
      ]
    });

    const text = completion.choices[0]?.message?.content?.trim();
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    res.status(200).json(parsed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'AI suggestion failed' });
  }
};