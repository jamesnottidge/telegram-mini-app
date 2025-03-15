import { Loader2 } from "lucide-react";
import LoaderIcon from "../../../public/svgs/loader.svg";
type ButtonProps = {
  isLoading?: boolean;
  text?: string;
  variant?: keyof typeof buttonVariantsStyle;
  size?: keyof typeof buttonSizeStyles;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<ButtonProps> = ({
  className,
  disabled,
  isLoading = false,
  onClick,
  text = "",
  variant = "primary",
  size = "large",
  children,
  ...otherProps
}) => {
  const buttonStyle = `
    ${buttonBaseStyle}
    ${buttonVariantsStyle[variant]}
    ${buttonSizeStyles[size]}
    ${className}
  `;

  const loaderStyle = `
    animate-spin
    ${loaderVariantStyles[variant]}
  `;

  return (
    <button
      disabled={disabled || isLoading}
      onClick={onClick}
      className={buttonStyle}
      {...otherProps}
    >
      {isLoading ? (
        <Loader2 role="loader" className={loaderStyle} />
      ) : (
        text || children
      )}
    </button>
  );
};

const buttonBaseStyle = `
  rounded-[10px]
  font-bold
  transition-all
  w-full
  disabled:bg-brand-700/50
  disabled:cursor-not-allowed
  flex
  items-center
  justify-center
`;

const buttonVariantsStyle = {
  primary: `
    bg-[#A033EA]
    text-white
    hover:bg-green-200
    disabled:bg-[#F2F2F2]
  `,
  secondary: `
    bg-white
    text-violet
    hover:bg-violet
    hover:text-white
    border-violet
    border-[1px]
    disabled:bg-white
    disabled:text-violet
  `,
};

const buttonSizeStyles = {
  small: `
  text-[14px]
  p-[12.5px]
  `,
  large: `
  text-[16px]
  font-semibold
  py-[12px]
  px-[18px]
  `,
};

const loaderVariantStyles = {
  primary: `stroke-white`,
  secondary: `stroke-violet`,
};
