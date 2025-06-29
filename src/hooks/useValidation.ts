import { useState } from "react";

type Validaciones ={
    [key: string]: {
        regex: RegExp
        mensaje: string
    }
}

const validacionesBase: Validaciones = {
    nombre: {
        regex: /^[A-Za-z]{1,12}$/,
        mensaje: "El nombre debe contener máximo 12 letras (solo A-Z)."
    },
    apellido: {
        regex: /^[A-Za-z]{1,12}$/,
        mensaje: "El apellido debe contener máximo 12 letras (solo A-Z)."
    },
    telefono: {
        regex: /^\d{11}$/,
        mensaje: "El teléfono debe de contener exactamente 9 digitos."
    },
    correo: {
        regex: /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/,
        mensaje: "Correo electrónico inválido"
    },
    contraseña: {
        regex: /^\S{6,}$/,
        mensaje: "La contraseña debe tener al menos 6 caracteres"
    }
}


export const useValidation = () => {
    const [errores, setErrores] = useState<{ [key: string]: string }>({})

    const validarCampo = (nombre: string, valor: string) => {
        const regla = validacionesBase[nombre]
        if (!regla) return true

        const esValido = regla.regex.test(valor)

        setErrores(prev => ({
            ...prev,
            [nombre]: esValido ? "" : regla.mensaje
        }))
        return esValido
    }

    const validarFormularioCompleto = (campos: {[key: string]: string}) => {
        const nuevosErrores: { [key: string]: string } = {}
        let esFormularioValido = true

        for(const campo in campos){
            const regla = validacionesBase[campo]

            if(!regla) continue

            if(!regla.regex.test(campos[campo])){
                nuevosErrores[campo] = regla.mensaje
                esFormularioValido = false
            }
        }
        setErrores(nuevosErrores)
        return esFormularioValido
    }

    return{
        errores, validarCampo, validarFormularioCompleto
    }
}
