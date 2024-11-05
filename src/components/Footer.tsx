"use client";

import DeployTimestamp from "./DeployTimestamp";

export default function Footer() {
    return (
        <>
            <div className="text-sm text-gray-500 text-center hover:text-red-600 hover:underline hover:underline-offset-4 cursor-pointer" onClick={() => window.open("https://metasal.xyz", "_blank")}>metasal.xyz</div>
            <DeployTimestamp />
        </>
    )
}
