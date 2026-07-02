import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import ActivityTable from '../components/activity/ActivityTable';
import { ActivityLoading, ActivityError, ActivityEmpty } from '../components/activity/ActivityStates';

const Activity = () => {
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await api.get('/logs');
                setLogs(response.data.logs || []);
            } catch (err) {
                console.error('Error fetching logs:', err);
                setError('Failed to load activity logs.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchLogs();
    }, []);

    return (
        <div className="min-h-screen bg-[#f8f9fa] flex flex-col p-4 md:p-6 text-black select-none">
            <Navbar />

            <main className="w-full max-w-7xl mx-auto grow flex flex-col gap-6 mt-2">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-extrabold tracking-tight text-black">Recent Activity</h1>
                    <p className="text-sm text-gray-500 font-medium">Track your file operations and actions across your account.</p>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden grow flex flex-col mb-10">
                    {isLoading ? (
                        <ActivityLoading />
                    ) : error ? (
                        <ActivityError error={error} />
                    ) : logs.length === 0 ? (
                        <ActivityEmpty />
                    ) : (
                        <ActivityTable logs={logs} />
                    )}
                </div>
            </main>
        </div>
    );
};

export default Activity;