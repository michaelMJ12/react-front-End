import React, { useState, useEffect } from 'react';
import { Campaign } from '../models/Campaign';
import Modal from './Modal';
import { fetchCampaigns, deleteCampaign } from '../api/campaigns'; // Adjusted imports
import { useNavigate } from 'react-router-dom'; // Add useNavigate for navigation
import '../styles/CampaignList.css';

const CampaignList: React.FC = () => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCreatives, setSelectedCreatives] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const itemsPerPage = 5;
    const navigate = useNavigate(); // Initialize navigate for navigation

    useEffect(() => {
        const loadCampaigns = async () => {
            try {
                const data = await fetchCampaigns();
                console.log(data)
                if (data && data.length > 0) {
                    setCampaigns(data);
                    setError(null);
                } else {
                    setError('No campaigns available.');
                }
            } catch (err) {
                setError('Failed to load campaigns. Please try again later.');
                console.error('Error fetching campaigns:', err);
            }
        };
        loadCampaigns();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            await deleteCampaign(id);
            setCampaigns((prev) => prev.filter((campaign) => campaign.id !== id));
        } catch (err) {
            console.error('Failed to delete campaign:', err);
            setError('Could not delete the campaign. Please try again.');
        }
    };

    const openModal = (creatives: string[] | undefined) => {
        setSelectedCreatives(Array.isArray(creatives) ? creatives : []);
        console.log(selectedCreatives);
        setIsModalOpen(true);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const paginatedCampaigns = campaigns.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleUpdate = (campaign: Campaign) => {
        // Navigate to the form page with the campaign id as a URL parameter
        navigate(`/campaigns/edit/${campaign.id}`);
    };

    return (
      <div className="campaign-container">
        <h2>Campaigns List</h2>
        {error ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            <table className="campaign-table">
              <thead>
                <tr>
                  <th>Campaign Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Daily Budget</th>
                  <th>Total Budget</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCampaigns.map((campaign, index) => (
                  <tr
                    key={campaign.id}
                    className={index % 2 === 0 ? "odd-row" : "even-row"}
                  >
                    <td>{campaign.name}</td>
                    <td>{campaign.from}</td>
                    <td>{campaign.to}</td>
                    <td>${campaign.daily_budget}</td>
                    <td>${campaign.total_budget}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="transparent-btn"
                          onClick={() => {
                            let parsedCreatives: string[] = [];
                            try {
                              // Parse creatives only if it is a string
                              parsedCreatives =
                                typeof campaign.creatives === "string"
                                  ? JSON.parse(campaign.creatives)
                                  : campaign.creatives || [];
                            } catch (error) {
                              console.error("Error parsing creatives:", error);
                            }

                            console.log("Parsed Creatives:", parsedCreatives);
                            openModal(parsedCreatives); // Pass parsed array
                          }}
                        >
                          Preview
                        </button>

                        <button
                          className="update-btn"
                          onClick={() => handleUpdate(campaign)} // Use the navigate function to go to the form page
                        >
                          Update
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(campaign.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              {Array.from(
                { length: Math.ceil(campaigns.length / itemsPerPage) },
                (_, i) => (
                  <button
                    key={i}
                    className={`page-btn ${
                      i + 1 === currentPage ? "active" : ""
                    }`}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                )
              )}
            </div>
          </>
        )}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="modal-container">
            {selectedCreatives.length > 0 ? (
              <div className="image-grid">
                {selectedCreatives.map((url, index) => (
                  <img key={index} src={url} alt={`Creative ${index + 1}`} />
                ))}
              </div>
            ) : (
              <p className="no-creatives">No creatives available.</p>
            )}
          </div>
        </Modal>
      </div>
    );
};

export default CampaignList;
