// pages/api/generate.js
import axios from 'axios';
import FormData from 'form-data';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, negativePrompt, aspectRatio } = req.body;
  const formData = new FormData();
  formData.append('prompt', prompt);
  formData.append('negative_prompt', negativePrompt);  // Adding negative prompt
  formData.append('model', 'sd3');
  formData.append('aspect_ratio', aspectRatio);
  formData.append('output_format', 'jpeg');

  try {
    const apiResponse = await axios.post('https://api.stability.ai/v2beta/stable-image/generate/sd3', formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
        'Accept': 'image/*'
      },
      responseType: 'arraybuffer'
    });

    res.status(apiResponse.status).send(apiResponse.data);
  } catch (error) {
    console.error('API call failed:', error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
}
