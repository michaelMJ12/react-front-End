import React, { useState } from 'react';
import '../styles/'

interface Campaign {
    name: string;
    date: string;
    dailyBudget: number;
    totalBudget: number;
    creatives: string[];
}

interface CampaignCreateEditProps {
    campaign?: Campaign;
    onSave: (campaign: Campaign) => void;
    onCancel: () => void;
}

const CampaignCreateEdit: React.FC<CampaignCreateEditProps> = ({ campaign, onSave, onCancel }) => {
    const [name, setName] = useState(campaign?.name || '');
    const [date, setDate] = useState(campaign?.date || '');
    const [dailyBudget, setDailyBudget] = useState(campaign?.dailyBudget || 0);
    const [totalBudget, setTotalBudget] = useState(campaign?.totalBudget || 0);

    const handleSave = () => {
    onSave({ name, date, dailyBudget, totalBudget, creatives: campaign?.creatives || [] });
    };

    return (
    <div>
        <h2>{campaign ? 'Edit Campaign' : 'Create Campaign'}</h2>
        <div>
        <label>Campaign Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
        <label>Date:</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
        <label>Daily Budget:</label>
        <input type="number" value={dailyBudget} onChange={(e) => setDailyBudget(Number(e.target.value))} />
        </div>
        <div>
        <label>Total Budget:</label>
        <input type="number" value={totalBudget} onChange={(e) => setTotalBudget(Number(e.target.value))} />
        </div>
        <button onClick={handleSave}>Save</button>
        <button onClick={onCancel}>Cancel</button>
    </div>
    );
};

export default CampaignCreateEdit;
