import React, { useState, ChangeEvent, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Campaign } from '../models/Campaign';
import { createOrUpdateCampaign, getCampaignById } from '../api/campaigns';
import '../styles/CampaignForm.css';

const CampaignForm: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Get campaign ID from URL params
    const [formData, setFormData] = useState<Campaign>({
        id: 0,
        name: '',
        from: '',
        to: '',
        daily_budget: 0,
        total_budget: 0,
        creatives: [], // Ensure this is an empty array by default
    });
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const history = useNavigate(); // To navigate after form submission

    useEffect(() => {
        if (id) {
            const fetchCampaign = async () => {
                try {
                    const campaignData = await getCampaignById(Number(id)); // Fetch campaign by ID
                    // Ensure creatives is always an array even if it's null or undefined
                    const formattedFrom = new Date(campaignData.from).toISOString().split('T')[0];
                    const formattedTo = new Date(campaignData.to).toISOString().split('T')[0];
                    setFormData({
                        ...campaignData,
                        from: formattedFrom,  // Ensure correct date format
                        to: formattedTo,      // Ensure correct date format
                        creatives: campaignData.creatives || [], // Fallback to empty array
                    });
                } catch (error) {
                    setErrorMessage('Failed to load campaign details.');
                    console.error('Error fetching campaign:', error);
                }
            };
            fetchCampaign();
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const fileURLs = files.map((file) => URL.createObjectURL(file));

            // Ensure creatives is an array before appending
            setFormData((prevData) => ({
                ...prevData,
                creatives: [...(prevData.creatives || []), ...fileURLs], // Fallback to empty array if creatives is undefined
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            console.log(formData);
            await createOrUpdateCampaign(formData); // Create or update based on `id`
            setSuccessMessage(
                formData.id
                    ? 'Campaign updated successfully!'
                    : 'Campaign created successfully!'
            );
            setErrorMessage(null);

            setTimeout(() => {
                history('/campaigns'); // Redirect to campaigns list after saving
            }, 3000); // 3 seconds delay
        } catch (error: any) {
            if (error.response && error.response.status === 422) {
                // Handle validation errors
                const validationErrors = error.response.data.errors;
                const errorMessages = Object.values(validationErrors)
                    .flat()
                    .join(', ');
                setErrorMessage(`Validation failed: ${errorMessages}`);
            } else {
                setErrorMessage('Failed to save the campaign. Please try again.');
            }
            setSuccessMessage(null);
            console.error('Error saving campaign:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="campaign-form">
            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            
            <label>
                Campaign Name
                <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter campaign name"
                />
            </label>
            <label>
                Start Date
                <input
                    name="from"
                    value={formData.from}
                    onChange={handleChange}
                    type="date"
                />
            </label>
            <label>
                End Date
                <input
                    name="to"
                    value={formData.to}
                    onChange={handleChange}
                    type="date"
                />
            </label>
            <label>
                Daily Budget
                <input
                    name="daily_budget"
                    value={formData.daily_budget}
                    onChange={handleChange}
                    type="number"
                    placeholder="Enter daily budget"
                />
            </label>
            <label>
                Total Budget
                <input
                    name="total_budget"
                    value={formData.total_budget}
                    onChange={handleChange}
                    type="number"
                    placeholder="Enter total budget"
                />
            </label>
            <label>
                Creatives (Images)
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                />
            </label>
            <div className="image-preview">
                {Array.isArray(formData.creatives) && formData.creatives.length > 0 ? (
                    formData.creatives.map((creative, index) => (
                        <img
                            key={index}
                            src={creative}
                            alt={`Creative ${index + 1}`}
                            className="preview-image"
                        />
                    ))
                ) : (
                    <p>No creatives uploaded yet.</p>
                )}
            </div>
            <button type="submit">
                {formData.id ? 'Update Campaign' : 'Create Campaign'}
            </button>
        </form>
    );
};

export default CampaignForm;
