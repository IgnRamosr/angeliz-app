
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
        <label className="block mb-2 text-base font-medium text-[#6F2521]">{label}</label>
        <input 
            id={id}
            type={type}
            onChange={onChange}
            placeholder={`Ingresa tu ${label.toLowerCase()}`}
            value={value}
            className="bg-[#FDDEE8] border outline-none border-gray-300 text-sm rounded-full block w-full p-2.5 focus:ring-[#6F2521] focus:border-[#6F2521]"/>
        </div>
    )
}
