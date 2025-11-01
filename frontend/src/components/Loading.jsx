import { Loader } from 'lucide-react';

const Loading = ({
    size = "default",
    text = "Chargement...",
    fullScreen = false,
    className = "",
    type = "spinner" // spinner, dots, skeleton
}) => {
    const sizeConfig = {
        small: { icon: 20, text: "text-sm", skeleton: "h-4" },
        default: { icon: 32, text: "text-base", skeleton: "h-6" },
        large: { icon: 48, text: "text-lg", skeleton: "h-8" }
    };

    const config = sizeConfig[size];

    // Spinner de chargement
    const SpinnerLoader = () => (
        <article className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
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

    // Loader avec points animés
    const DotsLoader = () => (
        <section className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
            <article className="flex space-x-1">
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </article>
            {text && (
                <p className={`text-gray-600 ${config.text}`}>
                    {text}
                </p>
            )}
        </section>
    );

    // Skeleton loader pour les cartes
    const SkeletonLoader = () => (
        <main className={`animate-pulse ${className}`}>
            <section className="bg-white rounded-xl shadow-md overflow-hidden">
                <article className="p-6 space-y-4">
                    <div className={`bg-gray-200 rounded ${config.skeleton} w-3/4`}></div>
                    <div className="space-y-2">
                        <div className="bg-gray-200 rounded h-4 w-full"></div>
                        <div className="bg-gray-200 rounded h-4 w-5/6"></div>
                    </div>
                    <div className="space-y-2">
                        <div className="bg-gray-200 rounded h-4 w-1/2"></div>
                        <div className="bg-gray-200 rounded h-4 w-2/3"></div>
                        <div className="bg-gray-200 rounded h-4 w-1/3"></div>
                    </div>
                </article>
            </section>
        </main>
    );

    const LoaderComponent = {
        spinner: SpinnerLoader,
        dots: DotsLoader,
        skeleton: SkeletonLoader
    }[type];

    const content = <LoaderComponent />;

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-sm">
                {content}
            </div>
        );
    }

    return content;
};

// Composant de skeleton pour les listes
export const LoadingSkeleton = ({ count = 6 }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, index) => (
                <Loading key={index} type="skeleton" />
            ))}
        </div>
    );
};

export default Loading;