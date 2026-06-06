"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";

interface HlsPlayerProps {
  lekcijaSlug: string;
  userId: string | null;
}

export default function HlsPlayer({ lekcijaSlug, userId }: HlsPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // 1. OVDE DEFINIŠI IP ADRESU ILI DOMEN SVOG VIDEO SERVERA
  // Ako je to isti kompjuter gde ti je Next.js, ostaje 192.168.100.104. 
  // Proveri samo na kom portu tvoj Nginx/Apache servira taj /var/www/videos (obično je standardni port 80, pa ne treba port)
  const VIDEO_SERVER_URL = "http://192.168.100.174"; 

  // 2. Korigovano: folder je /videos/, unutra je lekcijaSlug, a fajl se zove index.m3u8
  const videoSrc = `${VIDEO_SERVER_URL}/videos/${lekcijaSlug}/index.m3u8`;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls({
        xhrSetup: function (xhr) {
          // Isključujemo credentials osim ako Nginx eksplicitno ne traži cookies/session
          xhr.withCredentials = false; 
        },
      });

      console.log(`🎬 HlsPlayer pokušava da učita video sa: ${videoSrc}`);
      hls.loadSource(videoSrc);
      hls.attachMedia(video);

      hls.on(Hls.Events.ERROR, function (event, data) {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error(
                `❌ HLS Mrežna Greška! URL: ${videoSrc} | Status koda:`, 
                data.response ? data.response.code : "Nema odgovora (Moguće CORS ili ugašen server)"
              );
              console.log("🔄 Pokušavam automatski oporavak mreže...");
              hls?.startLoad();
              break;
              
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error("❌ HLS Medijska greška, pokušavam oporavak (fatal)...");
              hls?.recoverMediaError();
              break;
              
            default:
              console.error("❌ Fatalna HLS greška koja se ne može oporaviti:", data);
              hls?.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Podrška za Safari
      video.src = videoSrc;
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [videoSrc]);

  return (
    <div className="relative w-full aspect-video bg-black overflow-hidden rounded-t-2xl">
      <video
        ref={videoRef}
        controls
        className="w-full h-full object-contain" // PROMENJENO sa object-cover na object-contain
      />
    </div>
  );
}