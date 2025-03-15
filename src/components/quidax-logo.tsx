import Image from "next/image";

export const QuidaxLogo = () => {
  return (
    <div className="flex items-center justify-center gap-2  text-lg text-brand-700">
      <Image alt="logo" src={"/svgs/q-logo.svg"} width={24} height={24} />
      <span
      >|</span>
      <span className="block text-center">Ramp by Quidax</span>
    </div>
  );
};
