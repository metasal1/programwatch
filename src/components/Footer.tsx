"use client";

import DeployTimestamp from "./DeployTimestamp";

export default function Footer() {
    return (
        <div className="flex flex-row justify-between items-center border-t border-gray-200 pt-4 p-2 gap-4">
            <div className="text-sm text-gray-500 text-center hover:text-red-600 hover:underline hover:underline-offset-4 cursor-pointer" onClick={() => window.open("https://metasal.xyz", "_blank")}>metasal.xyz</div>
            <small className=" text-gray-500 italic">Disclaimer: This data is from the Solana blockchain and is updated periodically. IDLs and verification were correct at time of last update. IDL may be incorrect if program is not verified. IDL may be missing if it was not generated.</small>
            <DeployTimestamp />
        </div>
    )
}
