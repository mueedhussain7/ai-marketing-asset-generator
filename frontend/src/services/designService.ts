const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export interface Design {
  id: string;
  user_id: string;
  template_id: string;
  name: string;
  headline: string;
  description: string;
  thumbnail_url: string;
  design_data: any;
  created_at: string;
  updated_at: string;
}

export const saveDesign = async (designData: {
  template_id: string;
  name: string;
  headline: string;
  description: string;
  design_data: any;
}): Promise<Design> => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}/designs`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(designData)
  });

  if (!response.ok) {
    throw new Error('Failed to save design');
  }

  const data = await response.json();
  return data.design;
};

export const getUserDesigns = async (): Promise<Design[]> => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}/designs`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch designs');
  }

  const data = await response.json();
  return data.designs;
};

export const getDesignById = async (id: string): Promise<Design> => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}/designs/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch design');
  }

  const data = await response.json();
  return data.design;
};

export const deleteDesign = async (id: string): Promise<void> => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}/designs/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to delete design');
  }
};