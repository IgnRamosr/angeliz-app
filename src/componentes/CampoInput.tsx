
type InputFieldProps = {
    label: string
    type: string
    id: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const CampoInput = ({label, type, id, value, onChange}: InputFieldProps) => {
    return (
        <div className="flex flex-col gap-5 w-full max-w-screen">
        <label className="">{label}</label>
        <input 
            id={id}
            type={type}
            onChange={onChange}
            value={value}
            className="flex justify-center bg-[#FDDEE8] outline-none focus:border-2 focus:ring focus:ring-[#6F2521] focus:border-[#6F2521] px-4 py-2 rounded-2xl"/>
        </div>
    )
}
