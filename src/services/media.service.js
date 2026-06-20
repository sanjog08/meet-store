import api from './api';

const mediaService = {
  /**
   * POST /media/upload — Admin only
   * Uploads files via multipart/form-data
   * @param {File[]} files
   */
  upload: async (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    const response = await api.post('/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  /**
   * DELETE /media — Admin only
   * @param {{ publicId: string, resourceType?: 'image' | 'video' }} data
   */
  delete: async ({ publicId, resourceType = 'image' }) => {
    const response = await api.delete('/media', {
      data: { publicId, resourceType },
    });
    return response.data;
  },
};

export default mediaService;
