import React, { useEffect, useState } from 'react';
import { fetchBudgetSums, fetchRecordsByMonth } from '../api/campaigns';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { BudgetSums } from '../models/BudgetSums';
import '../styles/Dashboard.css';

const Dashboard: React.FC = () => {
    const [budgetData, setBudgetData] = useState<BudgetSums>({
        total_budget_sum: "0.00",
        daily_budget_sum: "0.00",
    });
    const [statistics, setStatistics] = useState<any[]>([]);
    const [selectedMonth, setSelectedMonth] = useState<string>('2024-01'); // Default month

    useEffect(() => {
        const loadBudgetSums = async () => {
            try {
                const data = await fetchBudgetSums();
                setBudgetData(data);
            } catch (error) {
                console.error('Error fetching budget sums:', error);
            }
        };

        const loadRecordsByMonth = async () => {
            try {
                const data = await fetchRecordsByMonth(selectedMonth);
                setStatistics(data);
            } catch (error) {
                console.error('Error fetching monthly records:', error);
            }
        };

        loadBudgetSums();
        loadRecordsByMonth();
    }, [selectedMonth]);

    const handleMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedMonth(event.target.value);
    };

    const barData = {
        labels: statistics.map((record: any) => record.created_at),
        datasets: [
            {
                label: 'Total Budget',
                data: statistics.map((record: any) => record.total_budget),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
            {
                label: 'Daily Budget',
                data: statistics.map((record: any) => record.daily_budget),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
        ],
    };

    const pieData = {
        labels: ['Total Budget', 'Daily Budget'],
        datasets: [
            {
                label: 'Budget Distribution',
                data: [parseFloat(budgetData.total_budget_sum), parseFloat(budgetData.daily_budget_sum)],
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'],
            },
        ],
    };

    return (
        <div className="dashboard">
            <div className="dashboard-top">
                <div className="dashboard-card budget-card">
                    <h3>Total Budget</h3>
                    <p>{budgetData.total_budget_sum}</p>
                </div>
                <div className="dashboard-card budget-card">
                    <h3>Select Month</h3>
                    <input
                        type="month"
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        style={{
                            padding: '10px',
                            fontSize: '16px',
                            width: '50%',
                            borderRadius: '5px',
                            border: '1px solid #ccc',
                        }}
                    />
                </div>
                <div className="dashboard-card budget-card">
                    <h3>Daily Budget</h3>
                    <p>{budgetData.daily_budget_sum}</p>
                </div>
            </div>
            <div className="dashboard-graphs">
                <div className="dashboard-card graph-card">
                    <Bar data={barData} />
                </div>
                <div className="dashboard-card graph-card">
                    <Pie data={pieData} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
