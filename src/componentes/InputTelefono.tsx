import PhoneInput from 'react-phone-input-2'
import type {InputCampoTelefono} from "../assets/types-interfaces/types"


const estiloPorDefecto = "bg-[#FDDEE8] border outline-none border-gray-300 text-sm rounded-full block w-full p-2.5 focus:ring-[#C9A742] focus:border-[#C9A742]"

export const InputTelefono = ({label,value, onChange, error}: InputCampoTelefono) => {
return (
    <>
    <label className="block mb-2 text-lg font-medium text-[#C9A742]">{label}</label>
    <PhoneInput specialLabel='' value={value} onChange={(valor) => onChange(valor)} country={'cl'} countryCodeEditable={false} inputProps={{ id: "telefono", name: "telefono", required: true }} containerClass="w-full"
    inputClass={`${estiloPorDefecto} ${error ? "border-red-500 focus:ring-red-400" : "border-gray-300"}`}/>
    {error && <p className="text-red-500 text-xs mt-0.5">{error}</p>}
    </>
)
}
