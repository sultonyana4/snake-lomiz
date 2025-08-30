import { DIRECTIONS } from '../lib/constants.js';

export const MobileControls = ({ onDirectionChange, gameState }) => {
    const handleDirectionPress = (direction) => {
        onDirectionChange(direction);
    };

    if (gameState !== 'PLAYING') return null;

    const buttonClass = "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg flex items-center justify-center text-2xl font-bold transition-all duration-150 select-none shadow-md active:scale-95 active:shadow-lg";

    return (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 md:hidden">
            <div className="bg-gray-800 bg-opacity-95 rounded-xl p-3 shadow-xl border border-gray-600">
                {/* Mobile Control Pad */}
                <div className="grid grid-cols-3 gap-2 w-40 h-40">
                    {/* Top row */}
                    <div></div>
                    <button
                        onTouchStart={(e) => {
                            e.preventDefault();
                            handleDirectionPress(DIRECTIONS.UP);
                        }}
                        onClick={() => handleDirectionPress(DIRECTIONS.UP)}
                        className={buttonClass}
                        style={{ touchAction: 'manipulation' }}
                    >
                        ↑
                    </button>
                    <div></div>

                    {/* Middle row */}
                    <button
                        onTouchStart={(e) => {
                            e.preventDefault();
                            handleDirectionPress(DIRECTIONS.LEFT);
                        }}
                        onClick={() => handleDirectionPress(DIRECTIONS.LEFT)}
                        className={buttonClass}
                        style={{ touchAction: 'manipulation' }}
                    >
                        ←
                    </button>
                    <div className="bg-gray-700 rounded-lg opacity-50"></div>
                    <button
                        onTouchStart={(e) => {
                            e.preventDefault();
                            handleDirectionPress(DIRECTIONS.RIGHT);
                        }}
                        onClick={() => handleDirectionPress(DIRECTIONS.RIGHT)}
                        className={buttonClass}
                        style={{ touchAction: 'manipulation' }}
                    >
                        →
                    </button>

                    {/* Bottom row */}
                    <div></div>
                    <button
                        onTouchStart={(e) => {
                            e.preventDefault();
                            handleDirectionPress(DIRECTIONS.DOWN);
                        }}
                        onClick={() => handleDirectionPress(DIRECTIONS.DOWN)}
                        className={buttonClass}
                        style={{ touchAction: 'manipulation' }}
                    >
                        ↓
                    </button>
                    <div></div>
                </div>

                <div className="text-center mt-2">
                    <span className="text-xs text-gray-300 font-medium">Touch controls</span>
                </div>
            </div>
        </div>
    );
};