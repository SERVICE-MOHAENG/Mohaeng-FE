import { Link } from 'react-router-dom';

export interface Destination {
  id: string;
  title: string;
  duration: string;
  tags: string[];
  imageUrl: string;
}

export interface DestinationListProps {
  destinations: Destination[];
}

export function DestinationList({ destinations }: DestinationListProps) {
  return (
    <div className="flex flex-col gap-6 mt-8">
      {destinations.map((dest) => (
        <Link
          key={dest.id}
          to={`/trip/${dest.id}`}
          className="flex items-center justify-between bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5"
        >
          <div className="flex-1 py-8 pl-8 relative z-10">
            <div className="mb-4">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{dest.title}</h3>
              <span className="text-2xl text-blue-600 font-semibold">{dest.duration}</span>
            </div>
            <div className="flex gap-3 flex-wrap">
              {dest.tags.map((tag, index) => (
                <span key={index} className="text-blue-600 text-xl font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
          <div className="relative w-[400px] shrink-0 self-stretch -ml-32">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${dest.imageUrl})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent pointer-events-none" />
          </div>
        </Link>
      ))}
    </div>
  );
}

export default DestinationList;
