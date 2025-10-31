import { Plus } from 'lucide-react'
import { assets } from '../assets/assets'

const Header = ({ onCreateEvent }) => {
    return (
        <>
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <img src={assets.logo} alt="" />
                        <button
                            onClick={onCreateEvent}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <Plus size={20} />
                            Create Event
                        </button>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header
