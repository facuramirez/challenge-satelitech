export const SectionLayout = ({ children, title }) => {
    return (
        <div className="flex flex-col gap-4 w-full shadow-lg rounded-lg p-4">
            <h2 className="text-2xl font-bold">{title}</h2>
            {children}
        </div>
    )
}
