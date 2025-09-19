'use client';
import { useEffect, CSSProperties, ReactElement } from "react";

interface AdSenseProps {
  slot: string;
  style?: CSSProperties;
  format?: string;
  responsive?: boolean;
  className?: string;
  adType?: "banner" | "rectangle" | "vertical" | string;
}

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

const AdSense = ({
  slot,
  style = { display: "block" },
  format = "auto",
  responsive = true,
  className = "",
  adType = "banner",
}: AdSenseProps): ReactElement => {
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
      }
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, [slot, format, responsive]);

  const adStyle: CSSProperties = {
    ...style,
    minHeight: adType === "banner" ? "90px" : "250px",
    minWidth: "320px",
    ...(responsive && {
      width: "100%",
      height: "auto",
    }),
  };

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={adStyle}
        data-ad-client="ca-pub-4391323106927085"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
};

export default AdSense;
