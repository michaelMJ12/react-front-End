import React, { useState, useEffect } from 'react';
import { Campaign } from '../models/Campaign';
import Modal from '../components/Modal';
import { fetchCampaigns } from '../api/campaigns';
import '../styles/CampaignList.css';

const CampaignList: React.FC = () => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [selectedCreatives, setSelectedCreatives] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
    const loadCampaigns = async () => {
        const data = await fetchCampaigns();
        setCampaigns(data);
    };
    loadCampaigns();
    }, []);

    const openModal = (creatives: string[]) => {
    setSelectedCreatives(creatives);
    setIsModalOpen(true);
    };

    return (
    <div>
        <h2>Campaigns List</h2>
        {campaigns.map((campaign) => (
        <div key={campaign.id}>
            <h3>{campaign.name}</h3>
            <p>{campaign.startDate} - {campaign.endDate}</p>
            <p>Daily Budget: ${campaign.dailyBudget}</p>
            <p>Total Budget: ${campaign.totalBudget}</p>
            <button onClick={() => openModal(campaign.creatives)}>Preview Creatives</button>
        </div>
        ))}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedCreatives.map((url, index) => (
            <img key={index} src={url} alt="Creative" />
        ))}
        </Modal>
    </div>
    );
};

export default CampaignList;
