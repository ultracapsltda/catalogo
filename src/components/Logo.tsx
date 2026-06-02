import logo from "@/assets/logo.png";

interface LogoProps {
  size?: number;
  className?: string;
  showWordmark?: boolean;
}

export const Logo = ({ size = 40, className = "", showWordmark = true }: LogoProps) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <img
      src={logo}
      alt="Vitalis logo"
      width={size}
      height={size}
      className="object-contain"
      style={{ width: size, height: size }}
    />
    {showWordmark && (
      <div className="leading-none">
        <div className="font-brand text-2xl font-extrabold tracking-tight text-primary">
          UltraCaps
        </div>
      </div>
    )}
  </div>
);
