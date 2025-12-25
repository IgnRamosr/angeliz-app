
import type {InputCampo} from "../../assets/types-interfaces/types"


const estiloPorDefecto = "bg-[#FDDEE8] border outline-none border-gray-300 text-sm rounded-full block w-full p-2.5 focus:ring-[#C9A742] focus:border-[#C9A742]"

export const CampoInput = ({label, type, id, value, onChange, error, min, max}: InputCampo) => {
    return (
        <div className="flex flex-col gap-5 w-full max-w-screen">
        <label className="block mb-2 text-lg font-medium text-[#C9A742]">{label}</label>
        <input 
            id={id}
            type={type}
            onChange={onChange}
            placeholder={`Ingresa tu ${label.toLowerCase()}`}
            value={value}
            minLength={min}
            maxLength={max}
            className= {`${estiloPorDefecto} ${error ? "border-red-500 focus:ring-red-400" : "border-gray-300"}`}/>
            {error && <p className="text-red-500 text-xs flex">{error}</p>}
        </div>
    )
}
