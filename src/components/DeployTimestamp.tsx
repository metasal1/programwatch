import React from 'react';

const DeployTimestamp = () => {
    // NEXT_PUBLIC prefix is required for client-side access
    const buildTimestamp = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA
        ? new Date(parseInt(process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA) * 1000).toLocaleString()
        : 'Not available';

    return (
        <div className="inline-flex items-center gap-2 px-3 py-1 text-sm rounded-md bg-gray-100">
            <span className="text-gray-600">Last deployed:</span>
            <time className="font-mono text-gray-800">{buildTimestamp}</time>
        </div>
    );
};

export default DeployTimestamp;
