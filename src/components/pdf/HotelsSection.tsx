import { Hotel } from "@/types/itinerary";
import { Star, Moon, Link as LinkIcon } from "lucide-react";

interface HotelsSectionProps {
  hotels: Hotel[];
}

export const HotelsSection = ({ hotels }: HotelsSectionProps) => {
  return (
    <div className="mt-6" dir="rtl">
      {/* Section Header */}
      <div className="pdf-section-header rounded-t-lg flex items-center gap-2">
        <Star className="w-5 h-5 text-accent" />
        <span>الفنادق في البرنامج</span>
      </div>

      {/* Hotels List */}
      <div className="bg-card p-4 rounded-b-lg border border-t-0 border-border space-y-3">
        {hotels.map((hotel) => (
          <div key={hotel.id} className="hotel-card">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-serif font-semibold text-foreground">
                  <a
                    href={hotel.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {hotel.name}
                  </a>
                </h4>
                <div className="flex">
                  {Array.from({ length: hotel.stars }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 fill-accent text-accent"
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                  <Moon className="w-4 h-4" />
                  <span>{hotel.nights} ليالي</span>
                </div>
              </div>
              {hotel.notes && (
                <p className="text-sm text-muted-foreground italic mb-2">
                  {hotel.notes}
                </p>
              )}
              {hotel.website && (
                <div className="mt-2 pt-2 border-t border-border">
                  <a
                    href={hotel.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-accent hover:underline font-medium"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    زيارة موقع الفندق
                  </a>
                </div>
              )}
            </div>
            <div className="relative w-24 h-20 flex-shrink-0">
              <img
                src={hotel.imageUrl || "/placeholder.svg"}
                alt={hotel.name}
                className="w-full h-full object-cover rounded-lg"
              />
              {hotel.website && (
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(
                    hotel.website
                  )}`}
                  alt="QR"
                  className="absolute -bottom-1 -left-1 w-12 h-12 bg-card rounded-md border border-border shadow"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
