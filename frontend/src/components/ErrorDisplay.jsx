import { AlertCircle, RefreshCw, X } from 'lucide-react';

const ErrorDisplay = ({
    error,
    onRetry,
    onDismiss,
    title = "Erreur",
    retryText = "Réessayer",
    dismissible = false,
    className = ""
}) => {
    return (
        <>
            <main className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
                <section className="flex items-start gap-3">
                    <AlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />

                    <article className="flex-1">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h4 className="text-red-800 font-medium mb-1">{title}</h4>
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>

                            {dismissible && (
                                <button
                                    onClick={onDismiss}
                                    className="text-red-400 hover:text-red-600 ml-2 flex-shrink-0"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        {onRetry && (
                            <button
                                onClick={onRetry}
                                className="mt-3 flex items-center gap-2 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm font-medium transition-colors"
                            >
                                <RefreshCw size={14} />
                                {retryText}
                            </button>
                        )}
                    </article>
                </section>
            </main>
        </>
    );
};

// Variantes d'erreur
export const NetworkError = ({ error, onRetry }) => (
    <ErrorDisplay
        error={error}
        onRetry={onRetry}
        title="Problème de connexion"
        retryText="Réessayer la connexion"
    />
);

export const DataError = ({ error, onRetry }) => (
    <ErrorDisplay
        error={error}
        onRetry={onRetry}
        title="Erreur de chargement des données"
    />
);

export const GeolocationError = ({ error, onRetry }) => (
    <ErrorDisplay
        error={error}
        onRetry={onRetry}
        title="Erreur de géolocalisation"
        retryText="Réessayer la localisation"
    />
);

export default ErrorDisplay;