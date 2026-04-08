import { useState, useRef } from 'react';
import { getCategoryGradient } from '../utils/amap';

const CATEGORY_EMOJI = {
  restaurant: { korean: '🍚', chinese: '🥢', default: '🍽' },
  massage:    '💆',
  billiards:  '🎱',
  home:       '🏠',
};

function getEmoji(category, subcategory) {
  const cat = CATEGORY_EMOJI[category];
  if (!cat) return '📍';
  if (typeof cat === 'string') return cat;
  return cat[subcategory] || cat.default;
}

export default function ImageGallery({ images = [null, null, null], category, subcategory }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);
  const gradient = getCategoryGradient(category, subcategory);
  const emoji = getEmoji(category, subcategory);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, offsetWidth } = scrollRef.current;
    setActiveIndex(Math.round(scrollLeft / offsetWidth));
  };

  const scrollTo = index => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ left: index * scrollRef.current.offsetWidth, behavior: 'smooth' });
  };

  // Ensure at least 3 placeholder images
  const imgs = images.length ? images : [null, null, null];

  return (
    <div className="relative">
      {/* Scroll container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x scrollbar-hide"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {imgs.map((img, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-full"
            style={{ scrollSnapAlign: 'center' }}
          >
            {img ? (
              <img
                src={img}
                alt={`Image ${i + 1}`}
                className="w-full h-64 object-cover"
                draggable={false}
              />
            ) : (
              <div className={`w-full h-64 bg-gradient-to-br ${gradient} flex flex-col items-center justify-center gap-2`}>
                <span className="text-7xl opacity-70">{emoji}</span>
                <span className="text-white/60 text-sm">{i + 1} / {imgs.length}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      {imgs.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
          {imgs.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === activeIndex ? 'bg-white scale-125' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}

      {/* Counter */}
      <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
        {activeIndex + 1}/{imgs.length}
      </div>
    </div>
  );
}
