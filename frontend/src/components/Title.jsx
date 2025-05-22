export const Title = ({ title, tailwindClasses }) => {
  return (
    <div
      className={`flex flex-col gap-4 text-lg lg:text-2xl text-[var(--blue)] font-bold mb-4 ${tailwindClasses}`}
    >
      <h1>{title}</h1>
      <div className="w-full h-[2px] bg-[var(--blue)]"></div>
    </div>
  );
};
