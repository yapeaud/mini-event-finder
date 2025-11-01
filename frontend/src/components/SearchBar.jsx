import { Search, X } from 'lucide-react';

const SearchBar = ({
    value,
    onChange,
    placeholder = "Rechercher par localisation...",
    onClear,
    className = ""
}) => {
    const handleClear = () => {
        if (onClear) {
            onClear();
        } else {
            // Si pas de onClear fourni, on simule un changement vide
            onChange({ target: { value: '' } });
        }
    };

    return (
        <>
            <section className={`relative max-w-md ${className}`}>
                {/* Icône de recherche */}
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />

                {/* Champ de recherche */}
                <input
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                />

                {/* Bouton de suppression (apparaît seulement si il y a du texte) */}
                {value && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={18} />
                    </button>
                )}
            </section>
        </>
    );
};

export default SearchBar;