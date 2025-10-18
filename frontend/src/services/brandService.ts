const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export const getBrandKit = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/brands`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null; // No brand kit yet
    }
    throw new Error('Failed to fetch brand kit');
  }

  const data = await response.json();
  return data.brandKit;
};