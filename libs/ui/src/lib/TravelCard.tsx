
export interface TravelCardProps {
  imageUrl: string;
  title: string;
  description: string;
}

export function TravelCard({ imageUrl, title, description }: TravelCardProps) {
  return (
    <div className="rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl min-w-[320px] w-[320px] h-[380px] shrink-0">
      <div
        className="w-full h-full bg-cover bg-center relative"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60 p-6 flex flex-col justify-end">
          <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
          <p className="text-[15px] text-white/95 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default TravelCard;
