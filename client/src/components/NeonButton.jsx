import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const NeonButton = ({ children, variant = "primary", className, ...props }) => {
    const baseStyles = "px-4 py-2 rounded-lg font-bold transition-all duration-300 shadow-lg transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900";

    const variants = {
        primary: "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-cyan-500/50",
        danger: "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 text-white shadow-red-500/50",
        success: "bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-300 hover:to-emerald-500 text-white shadow-green-500/50",
        warning: "bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-white shadow-yellow-500/50",
        ghost: "bg-transparent border border-gray-600 hover:bg-white/10 text-gray-300"
    };

    return (
        <button
            className={twMerge(clsx(baseStyles, variants[variant], className))}
            {...props}
        >
            {children}
        </button>
    );
};

export default NeonButton;
