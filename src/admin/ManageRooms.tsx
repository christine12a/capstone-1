import React, { useState, useEffect, useRef } from 'react';
import { getAllRooms, createRoom, updateRoom, deleteRoom, uploadRoomImage } from '../services/roomService';
import { RoomType } from '../types/Room';

const ManageRooms: React.FC = () => {
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomType | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    id: '',
    number: '',
    type: 'standard',
    capacity: 2,
    pricePerNight: 99,
    description: '',
    amenities: '',
    imageUrl: '',
    status: 'available'
  });

  // Fetch all rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const data = await getAllRooms();
        setRooms(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch rooms');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle image file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type
    const fileType = file.type;
    if (!fileType.match(/^image\/(jpeg|jpg|png|gif)$/)) {
      setError('Please select a valid image file (JPEG, PNG, or GIF)');
      return;
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image file size should be less than 5MB');
      return;
    }
    
    setImageFile(file);
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Open modal to add new room
  const handleAddRoom = () => {
    setEditingRoom(null);
    setFormData({
      id: '',
      number: '',
      type: 'standard',
      capacity: 2,
      pricePerNight: 99,
      description: '',
      amenities: 'Wi-Fi,TV,Air conditioning',
      imageUrl: '',
      status: 'available'
    });
    setImageFile(null);
    setImagePreview(null);
    setIsModalOpen(true);
  };

  // Open modal to edit existing room
  const handleEditRoom = (room: RoomType) => {
    setEditingRoom(room);
    setFormData({
      id: room.id,
      number: room.number,
      type: room.type,
      capacity: room.capacity,
      pricePerNight: room.pricePerNight,
      description: room.description,
      amenities: room.amenities.join(','),
      imageUrl: room.imageUrl || '',
      status: room.status
    });
    setImageFile(null);
    setImagePreview(room.imageUrl || null);
    setIsModalOpen(true);
  };

  // Handle room deletion
  const handleDeleteRoom = async (roomId: string) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await deleteRoom(roomId);
        setRooms(rooms.filter(room => room.id !== roomId));
      } catch (err: any) {
        setError(err.message || 'Failed to delete room');
      }
    }
  };

  // Submit form to create/update room
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      let imageUrl = formData.imageUrl;
      
      // Upload image if a new file was selected
      if (imageFile) {
        const uploadResult = await uploadRoomImage(imageFile);
        imageUrl = uploadResult.imageUrl;
      }
      
      if (editingRoom) {
        // Update existing room
        const updatedRoom = await updateRoom(formData.id, {
          number: formData.number,
          type: formData.type as RoomType['type'],
          capacity: Number(formData.capacity),
          pricePerNight: Number(formData.pricePerNight),
          description: formData.description,
          amenities: formData.amenities.split(',').map(item => item.trim()),
          imageUrl: imageUrl,
          status: formData.status as RoomType['status']
        });
        
        setRooms(rooms.map(room => room.id === updatedRoom.id ? updatedRoom : room));
      } else {
        // Create new room
        const newRoom = await createRoom({
          number: formData.number,
          type: formData.type as RoomType['type'],
          capacity: Number(formData.capacity),
          pricePerNight: Number(formData.pricePerNight),
          description: formData.description,
          amenities: formData.amenities.split(',').map(item => item.trim()),
          imageUrl: imageUrl,
          status: formData.status as RoomType['status']
        });
        
        setRooms([...rooms, newRoom]);
      }
      
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Failed to save room');
    }
  };

  // Reset file input
  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setImageFile(null);
    setImagePreview(formData.imageUrl);
  };

  if (loading) {
    return <div className="text-center py-8">Loading rooms...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Rooms</h1>
        <button
          onClick={handleAddRoom}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          Add New Room
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
          {error}
          <button 
            onClick={() => setError(null)} 
            className="ml-2 font-bold"
          >
            ×
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map(room => (
          <div key={room.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="relative h-48">
              <img 
                src={room.imageUrl || 'https://via.placeholder.com/400x200?text=Room+Image'} 
                alt={`${room.type} Room ${room.number}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  room.status === 'available' ? 'bg-green-100 text-green-800' :
                  room.status === 'occupied' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {room.status.toUpperCase()}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="text-xl font-bold">{room.type.charAt(0).toUpperCase() + room.type.slice(1)} Room</h2>
                  <p className="text-gray-600">Room {room.number}</p>
                </div>
                <p className="font-bold">₱{room.pricePerNight}/night</p>
              </div>
              
              <p className="text-sm text-gray-500 mb-4">{room.description}</p>
              
              <div className="mb-4">
                <p className="text-sm font-semibold mb-1">Amenities:</p>
                <div className="flex flex-wrap gap-1">
                  {room.amenities.map((amenity, index) => (
                    <span 
                      key={index} 
                      className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between">
                <button
                  onClick={() => handleEditRoom(room)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteRoom(room.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {rooms.length === 0 && (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p>No rooms available. Click "Add New Room" to create rooms.</p>
        </div>
      )}
      
      {/* Add/Edit Room Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {editingRoom ? 'Edit Room' : 'Add New Room'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="number">
                    Room Number
                  </label>
                  <input
                    id="number"
                    name="number"
                    type="text"
                    className="w-full p-2 border rounded"
                    value={formData.number}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="type">
                    Room Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    className="w-full p-2 border rounded"
                    value={formData.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="standard">Standard</option>
                    <option value="deluxe">Deluxe</option>
                    <option value="suite">Suite</option>
                    <option value="family">Family</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="capacity">
                    Capacity (Max Guests)
                  </label>
                  <input
                    id="capacity"
                    name="capacity"
                    type="number"
                    className="w-full p-2 border rounded"
                    value={formData.capacity}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>
                
                <div>                  <label className="block text-gray-700 mb-2" htmlFor="pricePerNight">
                    Price Per Night (₱)
                  </label>
                  <input
                    id="pricePerNight"
                    name="pricePerNight"
                    type="number"
                    className="w-full p-2 border rounded"
                    value={formData.pricePerNight}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="w-full p-2 border rounded"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  required
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="amenities">
                  Amenities (comma separated)
                </label>
                <input
                  id="amenities"
                  name="amenities"
                  type="text"
                  className="w-full p-2 border rounded"
                  value={formData.amenities}
                  onChange={handleChange}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Example: Wi-Fi, TV, Air conditioning</p>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Room Image
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="border-2 border-dashed border-gray-300 p-4 rounded text-center">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="room-image"
                      />
                      <label 
                        htmlFor="room-image" 
                        className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 inline-block"
                      >
                        {imageFile ? 'Change Image' : imagePreview ? 'Replace Image' : 'Upload Image'}
                      </label>
                      {imageFile && (
                        <div className="mt-2">
                          <span className="text-sm text-gray-600 mr-2">{imageFile.name}</span>
                          <button 
                            type="button" 
                            onClick={resetFileInput}
                            className="text-red-500 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        Supports JPEG, PNG, and GIF (max 5MB)
                      </p>
                    </div>
                    
                    {!imageFile && !imagePreview && (
                      <div className="mt-2">
                        <p className="text-sm font-medium mb-1">Or use an image URL:</p>
                        <input
                          id="imageUrl"
                          name="imageUrl"
                          type="text"
                          className="w-full p-2 border rounded"
                          value={formData.imageUrl}
                          onChange={handleChange}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    {(imagePreview || formData.imageUrl) && (
                      <div className="border rounded p-2">
                        <p className="text-sm font-medium mb-1">Preview:</p>
                        <div className="h-32 bg-gray-100 rounded overflow-hidden">
                          <img 
                            src={imagePreview || formData.imageUrl || 'https://via.placeholder.com/400x200?text=No+Image'} 
                            alt="Room preview" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2" htmlFor="status">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  className="w-full p-2 border rounded"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                  {editingRoom ? 'Update Room' : 'Add Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRooms;
