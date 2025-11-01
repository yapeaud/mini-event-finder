import { Loader } from 'lucide-react';

const Loading = ({
    size = "default",
    text = "Chargement...",
    fullScreen = false,
    className = ""
}) => {
    const sizeConfig = {
        small: { icon: 24, text: "text-sm" },
        default: { icon: 48, text: "text-base" },
        large: { icon: 64, text: "text-lg" }
    };

    const config = sizeConfig[size];

    const content = (
        <article className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
            <Loader
                className="animate-spin text-indigo-600"
                size={config.icon}
            />
            {text && (
                <p className={`text-gray-600 ${config.text}`}>
                    {text}
                </p>
            )}
        </article>
    );

    if (fullScreen) {
        return (
            <article className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
                {content}
            </article>
        );
    }

    return content;
};

export default Loading;