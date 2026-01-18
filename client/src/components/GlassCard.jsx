import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const GlassCard = ({ children, className }) => {
    return (
        <div className={twMerge(clsx("glass p-6 rounded-xl shadow-lg border border-gray-700/50 bg-gray-800/40 backdrop-blur-md", className))}>
            {children}
        </div>
    );
};

export default GlassCard;
