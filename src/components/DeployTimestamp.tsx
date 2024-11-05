import React from 'react';

const DeployTimestamp = () => {
    const isLocal = process.env.NODE_ENV === 'development';
    const buildTimestamp = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA;

    const getTimestampDisplay = () => {
        if (isLocal) {
            return 'Local Development';
        }

        if (!buildTimestamp) {
            return 'Not deployed on Vercel';
        }

        return new Date(parseInt(buildTimestamp) * 1000).toLocaleString();
    };

    const getBadgeColor = () => {
        if (isLocal) {
            return 'bg-green-100 text-green-800'; // Green for local development
        }
        return 'bg-gray-100 text-gray-800'; // Gray for production
    };

    return (
        <div className={`inline-flex items-center gap-2 px-3 py-1 text-xs rounded-md ${getBadgeColor()}`}>
            <span className="opacity-75">Last deployed:</span>
            <span className="font-mono">
                {getTimestampDisplay()}
            </span>
        </div>
    );
};

export default DeployTimestamp;
