
type tituloProps = {titulo: string}



export const Titulo = ({titulo}:tituloProps) => {
return (
    <h1 className="flex justify-center xl:text-3xl">{titulo}</h1>
)
}
