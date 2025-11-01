import { Search, Filter, X } from 'lucide-react';
import { useState } from 'react';

const SearchBar = ({
    value,
    onChange,
    placeholder = "Rechercher des événements...",
    onClear,
    className = "",
    showFilters = false,
    onFiltersToggle,
    filters = {},
    onFiltersChange
}) => {
    const [showFiltersPanel, setShowFiltersPanel] = useState(false);

    const handleClear = () => {
        if (onClear) {
            onClear();
        } else {
            onChange({ target: { value: '' } });
        }
    };

    const toggleFilters = () => {
        setShowFiltersPanel(!showFiltersPanel);
        if (onFiltersToggle) {
            onFiltersToggle(!showFiltersPanel);
        }
    };

    const handleFilterChange = (key, value) => {
        if (onFiltersChange) {
            onFiltersChange({
                ...filters,
                [key]: value
            });
        }
    };

    const clearFilters = () => {
        if (onFiltersChange) {
            onFiltersChange({
                category: '',
                date: '',
                participants: ''
            });
        }
    };

    const hasActiveFilters = filters.category || filters.date || filters.participants;

    return (
        <>
            <main className={`space-y-4 ${className}`}>
                {/* Barre de recherche principale */}
                <section className="relative max-w-2xl">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />

                    <input
                        type="text"
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        className="w-full pl-10 pr-20 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    />

                    {/* Boutons d'action */}
                    <article className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                        {value && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                title="Effacer la recherche"
                            >
                                <X size={18} />
                            </button>
                        )}

                        {showFilters && (
                            <button
                                type="button"
                                onClick={toggleFilters}
                                className={`flex items-center gap-1 px-2 py-1 rounded text-sm transition-colors ${hasActiveFilters
                                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                    }`}
                                title="Filtres"
                            >
                                <Filter size={16} />
                                <span>Filtres</span>
                                {hasActiveFilters && (
                                    <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                                )}
                            </button>
                        )}
                    </article>
                </section>

                {/* Panel des filtres */}
                {showFiltersPanel && showFilters && (
                    <section className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <article className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Filtres</h3>
                            <div className="flex items-center gap-2">
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-indigo-600 hover:text-indigo-800"
                                    >
                                        Effacer tout
                                    </button>
                                )}
                                <button
                                    onClick={toggleFilters}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </article>

                        <article className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Filtre par catégorie */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Catégorie
                                </label>
                                <select
                                    value={filters.category || ''}
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    <option value="">Toutes les catégories</option>
                                    <option value="conférence">Conférence</option>
                                    <option value="workshop">Workshop</option>
                                    <option value="réseautage">Réseautage</option>
                                    <option value="social">Social</option>
                                    <option value="sport">Sport</option>
                                    <option value="culture">Culture</option>
                                    <option value="formation">Formation</option>
                                </select>
                            </div>

                            {/* Filtre par date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Date
                                </label>
                                <select
                                    value={filters.date || ''}
                                    onChange={(e) => handleFilterChange('date', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    <option value="">Toutes les dates</option>
                                    <option value="today">Aujourd'hui</option>
                                    <option value="tomorrow">Demain</option>
                                    <option value="week">Cette semaine</option>
                                    <option value="weekend">Ce weekend</option>
                                    <option value="month">Ce mois</option>
                                    <option value="future">Événements futurs</option>
                                </select>
                            </div>

                            {/* Filtre par participants */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Disponibilité
                                </label>
                                <select
                                    value={filters.participants || ''}
                                    onChange={(e) => handleFilterChange('participants', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    <option value="">Tous les événements</option>
                                    <option value="available">Places disponibles</option>
                                    <option value="almost_full">Presque complets</option>
                                    <option value="full">Complets seulement</option>
                                </select>
                            </div>
                        </article>
                    </section>
                )}
            </main>
        </>
    );
};

export default SearchBar;