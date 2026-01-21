interface AdBannerProps {
  slot?: string;
  className?: string;
}

export default function AdBanner({ slot = 'default', className = '' }: AdBannerProps) {
  // TODO: Replace with actual AdSense code after approval
  // <ins className="adsbygoogle"
  //   style={{ display: 'block' }}
  //   data-ad-client="ca-pub-XXXXXXX"
  //   data-ad-slot={slot}
  //   data-ad-format="auto"
  //   data-full-width-responsive="true" />

  return (
    <div className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 ${className}`}>
      <p className="py-4">Espaço para Anúncio</p>
    </div>
  );
}
