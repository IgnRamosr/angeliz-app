
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
        <label className="block mb-2 text-lg font-medium text-[#C9A742]">{label}</label>
        <input 
            id={id}
            type={type}
            onChange={onChange}
            placeholder={`Ingresa tu ${label.toLowerCase()}`}
            value={value}
            className="bg-[#FDDEE8] border outline-none border-gray-300 text-sm rounded-full block w-full p-2.5 focus:ring-[#C9A742] focus:border-[#C9A742]"/>
        </div>
    )
}
