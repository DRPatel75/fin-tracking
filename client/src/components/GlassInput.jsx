import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const GlassInput = ({ className, error, ...props }) => {
    return (
        <div className="w-full">
            <input
                className={twMerge(clsx(
                    "w-full bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200",
                    error && "border-red-500 focus:ring-red-500",
                    className
                ))}
                {...props}
            />
            {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
        </div>
    );
};

export default GlassInput;
