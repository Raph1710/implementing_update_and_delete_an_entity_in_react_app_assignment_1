import { useState, useEffect } from 'react';

// Define the API URI for making requests
const API_URI = `http://localhost:8000/doors`;

const UpdateItem = ({ item, itemId }) => {
    // State for the existing item
    const [existingItem, setExistingItem] = useState(item || null);
    
    // State for the updated item data
    const [updatedItem, setUpdatedItem] = useState({
        name: item?.name || '',
        status: item?.status || 'closed',
    });
    
    // State for API response and loading
    const [status, setStatus] = useState({
        loading: false,
        error: null,
        success: false
    });

    // Function to handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedItem(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Function to fetch item data from the API
    const fetchItem = async (id) => {
        try {
            console.log('Fetching item with id:', id); // Debug log
            setStatus(prev => ({ ...prev, loading: true, error: null }));
            const response = await fetch(`${API_URI}/${id}`);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch item: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Fetched item data:', data); // Debug log
            setExistingItem(data);
            setUpdatedItem({
                name: data.name || '',
                status: data.status || 'closed',
            });
        } catch (error) {
            console.error('Error fetching item:', error); // Debug log
            setStatus(prev => ({ ...prev, error: error.message }));
        } finally {
            setStatus(prev => ({ ...prev, loading: false }));
        }
    };

    // Function to handle form submission
    const handleSubmit = async () => {
        try {
            setStatus(prev => ({
                ...prev,
                loading: true,
                error: null,
                success: false
            }));

            // Validate input
            if (!updatedItem.name.trim()) {
                throw new Error('Name is required');
            }

            const id = itemId || existingItem.id;
            if (!id) {
                throw new Error('Item ID is missing');
            }
            
            const response = await fetch(`${API_URI}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedItem)
            });

            if (!response.ok) {
                throw new Error(`Failed to update item: ${response.statusText}`);
            }

            const updatedData = await response.json();
            setExistingItem(updatedData);
            setUpdatedItem({
                name: updatedData.name || '',
                status: updatedData.status || 'closed',
            });
            
            setStatus(prev => ({
                ...prev,
                success: true,
                error: null
            }));

            setTimeout(() => {
                setStatus(prev => ({
                    ...prev,
                    success: false
                }));
            }, 3000);

        } catch (error) {
            setStatus(prev => ({
                ...prev,
                error: error.message || 'An unexpected error occurred',
                success: false
            }));
        } finally {
            setStatus(prev => ({
                ...prev,
                loading: false
            }));
        }
    };

    // Effect to fetch item data if not provided via props
    useEffect(() => {
        if (!item && !existingItem && itemId) {
            console.log('Fetching item from useEffect, itemId:', itemId); // Debug log
            fetchItem(itemId);
        } else {
            console.log('Item already exists:', item || existingItem); // Debug log
        }
    }, [item, existingItem, itemId]);

    if (status.loading) {
        return (
            <div className="loading-state">
                <p>Loading item data...</p>
            </div>
        );
    }

    if (status.error) {
        return (
            <div className="error-state">
                <p>Error: {status.error}</p>
            </div>
        );
    }

    if (!existingItem) {
        return (
            <div className="no-item-state">
                <p>No item found.</p>
            </div>
        );
    }

    return (
        <div className="update-item-container">
            <h2>Update Door</h2>
            
            <div className="item-details">
                <h3>Current Door Details:</h3>
                <div className="item-field">
                    <label>Name:</label>
                    <p>{existingItem.name}</p>
                </div>
                <div className="item-field">
                    <label>Status:</label>
                    <p>{existingItem.status}</p>
                </div>
            </div>

            <div className="update-form">
                <h3>Update Details:</h3>
                <div className="form-group">
                    <label htmlFor="name">New Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={updatedItem.name}
                        onChange={handleInputChange}
                        placeholder="Enter new name"
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="status">New Status:</label>
                    <select
                        id="status"
                        name="status"
                        value={updatedItem.status}
                        onChange={handleInputChange}
                        className="form-input"
                    >
                        <option value="open">Open</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>

                <button 
                    type="button" 
                    className="update-button"
                    onClick={handleSubmit}
                    disabled={status.loading}
                >
                    {status.loading ? 'Updating...' : 'Update Door'}
                </button>
            </div>

            {status.success && (
                <div className="success-message">
                    <p>Door updated successfully!</p>
                </div>
            )}
            
            {status.error && (
                <div className="error-message">
                    <p>{status.error}</p>
                </div>
            )}
        </div>
    );
};

export default UpdateItem;

