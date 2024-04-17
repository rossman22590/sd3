// src/pages/index.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [imageSrc, setImageSrc] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedImage = localStorage.getItem('lastImage');
    if (savedImage) {
      setImageSrc(savedImage);
    }
  }, []);

  const handleGenerateImage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/generate', {
        prompt,
        negativePrompt,
        aspectRatio
      }, {
        responseType: 'blob'
      });
      const url = URL.createObjectURL(response.data);
      setImageSrc(url);
      localStorage.setItem('lastImage', url);
    } catch (error) {
      console.error('Error generating image:', error);
      setError('Failed to generate image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = 'generated-image.jpeg'; // Set the name of the download file
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Generate Image with SD3</h1>
      <form onSubmit={handleGenerateImage} className="space-y-2">
        <textarea
          className="textarea textarea-bordered w-full"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt"
        />
        <textarea
          className="textarea textarea-bordered w-full"
          value={negativePrompt}
          onChange={(e) => setNegativePrompt(e.target.value)}
          placeholder="Enter negative prompt (optional)"
        />
        <select
          className="select select-bordered w-full"
          value={aspectRatio}
          onChange={(e) => setAspectRatio(e.target.value)}
        >
          <option value="16:9">16:9</option>
          <option value="1:1">1:1</option>
          <option value="4:3">4:3</option>
          <option value="21:9">21:9</option>
        </select>
        <button type="submit" className="btn btn-primary">Generate</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {imageSrc && (
        <>
          <img src={imageSrc} alt="Generated from prompt" className="max-w-full mt-4" />
          <button onClick={handleDownload} className="btn btn-secondary mt-2">Download Image</button>
        </>
      )}
    </div>
  );
}

export default Home;
