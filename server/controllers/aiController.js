const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

exports.smartSuggest = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Task title is required' });
    }

    if (title.length > 200) {
      return res.status(400).json({ error: 'Task title is too long' });
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 500,
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful task management assistant. Always respond with valid JSON only. No markdown, no extra text, no explanation.'
        },
        {
          role: 'user',
          content: `Given this task title: "${title.trim()}"

Suggest 3-5 relevant sub-tasks and 3-5 relevant tags.

Respond ONLY with this exact JSON format:
{
  "subtasks": ["subtask 1", "subtask 2", "subtask 3"],
  "tags": ["tag1", "tag2", "tag3"]
}`
        }
      ]
    });

    const text = completion.choices[0]?.message?.content?.trim();

    if (!text) {
      return res.status(500).json({ error: 'No response from AI' });
    }

    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    if (!parsed.subtasks || !parsed.tags) {
      return res.status(500).json({ error: 'Invalid AI response format' });
    }

    res.status(200).json(parsed);
  } catch (err) {
    if (err instanceof SyntaxError) {
      return res.status(500).json({ error: 'AI returned invalid response' });
    }
    res.status(500).json({ error: 'AI suggestion failed' });
  }
};