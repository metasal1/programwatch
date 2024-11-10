import Image from "next/image";
import FaqSheet from "./FaqSheet";
import { FaTelegram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Header() {
    return (
        <div>
            <Image
                className="dark:invert"
                src="/programwatch-logo.png"
                alt="ProgramWatch logo"
                width={180}
                height={38}
                priority
            />
            <div className="text-4xl font-bold">ProgramWatch</div>
            <div className="flex items-center gap-4">
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="https://t.me/programwatch"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <div className="p-4">
                        <FaTelegram className="w-8 h-8" />
                    </div>
                </a>
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="https://x.com/programwatch"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <div className="p-4">
                        <FaXTwitter className="w-8 h-8" />
                    </div>
                </a>
                <FaqSheet />
            </div>
        </div>
    );
}
