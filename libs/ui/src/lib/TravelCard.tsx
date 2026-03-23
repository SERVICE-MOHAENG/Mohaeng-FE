import RedHeart from '../assets/redHeart.svg';
import Heart from '../assets/heart.svg';

export interface TravelCardProps {
  id?: string;
  imageUrl: string;
  title: string;
  description: string;
  isLiked?: boolean;
  onLikeToggle?: (id: string, isLiked: boolean) => void;
  onClick?: () => void;
}

export function TravelCard({
  id,
  imageUrl,
  title,
  description,
  isLiked = false,
  onLikeToggle,
  onClick,
}: TravelCardProps) {
  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (id && onLikeToggle) {
      onLikeToggle(id, isLiked);
    }
  };

  return (
    <div 
      className="rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl min-w-[280px] w-[280px] h-[340px] shrink-0 group relative"
      onClick={onClick}
    >
      <div
        className="w-full h-full bg-cover bg-center relative"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        {/* Heart Icon */}
        {onLikeToggle && (
          <button
            onClick={handleLikeClick}
            className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full border border-white/30 hover:bg-white/40 transition-all active:scale-95"
          >
            <img 
              src={isLiked ? RedHeart : Heart} 
              alt="heart" 
              className={isLiked ? "w-5 h-5" : "w-5 h-5 invert brightness-200"} 
            />
          </button>
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/70 p-5 flex flex-col justify-end">
          <h3 className="text-xl font-bold text-white mb-2">
            {title}
          </h3>
          <p className="text-[13px] text-white/90 leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default TravelCard;
