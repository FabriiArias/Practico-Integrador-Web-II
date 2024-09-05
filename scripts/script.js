let departametazos = `<option value="99">Seleccione uno</option>`;
let aleatorio;
let tarjetas = '';
let objetitos = [];

// -------------------------------------------ANIMACION DE CARGA ----------------------------------------------------------
const loader = document.getElementById("carga");
const showLoader = () => {
    loader.classList.add("show-carga");
}
const hideLoader = () => {
    loader.classList.remove("show-carga");
}
// ------------------------------------------------------------------------------------------------------------------------

// -------------------------------- ARRANCAR PAGINA CON LA BUSQUEDA DESABILITADA ------------------------------------------
function desabiltarTodo() {
    const desabilitarCombo = document.getElementById('combo');
    desabilitarCombo.disabled = true;
    const desabilitarLocacion = document.getElementById('geoLocacion');
    desabilitarLocacion.disabled = true;
    const desabilitarPalabra = document.getElementById('palabra');
    desabilitarPalabra.disabled = true;
    const desabilitarbtnBuscar = document.getElementById('btn-bscar');
    desabilitarbtnBuscar.disabled = true;
}
desabiltarTodo();
// -------------------------------------------------------------------------------------------------------------------------

// ------------------------------------------ HABILITAR BUSQUEDA SEGUN LOS CHECK -------------------------------------------
function habilitarBusqueda(checkbox, elementoId) {
    const elemento = document.getElementById(elementoId);
    if (checkbox.checked) {
        elemento.disabled = false; // Habilita el elemento
        console.log('Seleccionado y elemento habilitado');
    } else {
        elemento.disabled = true; // Deshabilita el elemento
        console.log('Se sacó la selección y elemento deshabilitado');
    }
    verificarBotonBuscar();
}

function verificarBotonBuscar() {
    const desabilitarCombo = document.getElementById('combo');
    const desabilitarLocacion = document.getElementById('geoLocacion');
    const desabilitarPalabra = document.getElementById('palabra');
    const desabilitarbtnBuscar = document.getElementById('btn-bscar');

    // Si al menos uno de los elementos está habilitado, habilitar el botón Buscar
    if (!desabilitarCombo.disabled || !desabilitarLocacion.disabled || !desabilitarPalabra.disabled) {
        desabilitarbtnBuscar.disabled = false;
    } else {
        desabilitarbtnBuscar.disabled = true;
    }
}
// ---------------------------------------------------------------------------------------------------------------------------------

/* ---------------------------------------------CREAR TARJETA-------------------------------------------------------------------- */

function crearTarjeta(obraDeArte) {
    let imagen = obraDeArte.primaryImage;
    let fechaImagen = obraDeArte.objectDate || "No hay registros";
    let dinastia = obraDeArte.dynasty || "No tiene";
    let cultura = obraDeArte.cultura || "No se sabe";

    if (obraDeArte.additionalImages != '') {
        tarjetas += `<div class="tarjeta">
    <img src="${imagen}" alt="" title="${fechaImagen}" class="img-targeta"></img>
    <h4 class="titulo-tarjeta">${obraDeArte.title}</h4>
    <p class="texto-tarjeta">Cultura: ${cultura}</p>
    <p class="texto-tarjeta">Dinastia: ${dinastia}</p>
    <a href="imagenes-adicionales.html?objeto=${obraDeArte.objectID}" class="masImagenes" target="blank">Ver mas</a>
    </div>`
        document.getElementById('cont_tarjeta').innerHTML = tarjetas;
    }else{
        tarjetas += `<div class="tarjeta">
        <img src="${imagen}" alt="" title="${fechaImagen}" class="img-targeta"></img>
        <h4 class="titulo-tarjeta">${obraDeArte.title}</h4>
        <p class="texto-tarjeta">Cultura: ${cultura}</p>
        <p class="texto-tarjeta">Dinastia: ${dinastia}</p>
        </div>`
            document.getElementById('cont_tarjeta').innerHTML = tarjetas;
    }

}
/*--------------------------------------------------------------------------------------------------------------------------*/


// ------------------------------------------ CONTENIDO PAGINA PRINCIPAL ----------------------------------------------------
const ventanaPrincipal = async () => {
    try {
        const rta = await fetch("https://collectionapi.metmuseum.org/public/collection/v1/objects");
        const datos = await rta.json();
        const objectIDs = datos.objectIDs; // Lista de todos los objectIDs

        // Limpiar el contenedor de tarjetas antes de añadir nuevas
        document.getElementById('cont_tarjeta').innerHTML = '';

        let tarjetasCreadas = 0; // Contador para el número de tarjetas creadas

        // Usar un conjunto para asegurarse de que los objectIDs no se repitan
        const idsUsados = new Set();

        while (tarjetasCreadas < 20 && idsUsados.size < objectIDs.length) { 
            const aleatorio = Math.floor(Math.random() * objectIDs.length);
            const objectID = objectIDs[aleatorio];

            // Evitar duplicados
            if (idsUsados.has(objectID)) {
                continue; // Si ya usamos este ID, pasar al siguiente
            }
            idsUsados.add(objectID);

            try {
                // Hacer solicitud para obtener detalles del objeto
                const rtaObjeto = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`);
                const objeto = await rtaObjeto.json();

                // Verificar si el objeto tiene una imagen
                if (objeto.primaryImage) { 
                    crearTarjeta(objeto);

                    // Incrementar contador de tarjetas creadas
                    tarjetasCreadas++;
                }
            } catch (error) {
                console.error(`Error al obtener los detalles del objeto ${objectID}:`, error);
            }
        }

    } catch (error) {
        console.error("Error al cargar la ventana principal:", error);
    }
};

// Cargar la ventana principal
const cargarVentanaPrincipal = async () => {
    showLoader(); // Mostrar cargando

    await ventanaPrincipal();

    hideLoader(); // Ocultar cargando
};

cargarVentanaPrincipal();


// -----------------------------------------------------------------------------------------------------------------------------


// ---------------------------------------------------- llenar combo departamentos ---------------------------------------------
const cargarDepas = async () => {
    try {
        const respuesta = await fetch("https://collectionapi.metmuseum.org/public/collection/v1/departments");

        if (respuesta.status === 200) {
            const museo = await respuesta.json();

            museo.departments.forEach(element => {
                departametazos += `<option value="${element.departmentId}">${element.displayName}</option>`;
            });

            document.getElementById("combo").innerHTML = departametazos;

        } else if (respuesta.status === 404) {
            console.log("Lo que buscas no existe");
        } else {
            console.log("algo salio mal... Status: " + respuesta.status);
        }
    } catch (error) {
        console.log(error);
    }
}
cargarDepas();
// ---------------------------------------------------------------------------------------------------------------------------------

//--------------------------------------- TOMAR EL VALOR DE LA SELECCION DEL DROP --------------------------------------------------
let seleccion = '';
let depa;

document.getElementById("combo").addEventListener("change", async (event) => {
    seleccion = event.target.value; // Obtén el valor de la opción seleccionada
    console.log("Valor seleccionado: " + seleccion);
    depa = seleccion;
});
// -----------------------------------------------------------------------------------------------------------------------------------

// ------------------------------------------ tomar la geolocation del input ---------------------------------------------------------
let lugar;
function leerLugar() {
    lugar = document.getElementById("geoLocacion").value;
    console.log(lugar)
}
//------------------------------------------------------------------------------------------------------------------------------------

//---------------------------------------------------------- Buscar palabra clave -----------------------------------------------------
let palabra;
function leerPalabra() {
    palabra = document.getElementById("palabra").value;
    console.log(palabra);
}

//-------------------------------------------------------- Boton buscar ----------------------------------------------------------------
async function buscar() {
    tarjetas = '';
    const url = tipoDeFiltro();
    leerLugar();
    showLoader(); // mostrar cargando

    await filtroPorDepto(url);

    hideLoader(); // ocultar cargando
    console.log("habilitado");
}
//-----------------------------------------------------------------------------------------------------------------------------------------

function tipoDeFiltro() {
    let dpt = document.getElementById('combo').value
    let palabra = document.getElementById('palabra').value
    let lcl = document.getElementById('geoLocacion').value
    let url;


    if (dpt !== 99 && palabra !== '' && lcl !== '') {
        url = `https://collectionapi.metmuseum.org/public/collection/v1/search?geoLocation=${lcl}&q=${palabra}&DepartmentId=${dpt}`
        return url;
    } else if (dpt !== 99 && lcl !== '') {
        url = `https://collectionapi.metmuseum.org/public/collection/v1/search?geoLocation=${lcl}&q=*&DepartmentId=${dpt}`
        return url;
    } else if (dpt !== 99 && palabra !== '') {
        url = `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${palabra}&DepartmentId=${dpt}`
        return url;
    } else if (lcl !== '' && palabra !== '') {
        url = `https://collectionapi.metmuseum.org/public/collection/v1/search?geoLocation=${lcl}&q=${palabra}`
        return url;
    } else if (dpt !== 99) {
        url = `https://collectionapi.metmuseum.org/public/collection/v1/search?q=*&DepartmentId=${dpt}`
        return url;
    } else if (lcl !== '') {
        url = `https://collectionapi.metmuseum.org/public/collection/v1/search?geoLocation=${lcl}&q=*`
        return url;
    } else if (palabra !== '') {
        url = `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${palabra}`
        return url;

    }

}

//-----------------------------------------------------------------------------------------------------------------------------------------
const filtroPorDepto = async (url) => {
    let paginaActual = 1; // Página actual
    const tamanioPagina = 20; // Número de elementos por página
    let totalPaginas = 0; // Total de páginas

    try {
        const rta = await fetch(url);
        const datos = await rta.json();
        tarjetas = '';
        objetitos = datos.objectIDs || []; // Array de todos los IDs de objetos

        if (objetitos.length === 0) { // Verificar si hay resultados
            noEncontrado = `<h4>No se encontró nada con los filtros aplicados</h4>`;
            document.getElementById("no-encontrado").innerHTML = noEncontrado;
            document.getElementById("cont_tarjeta").innerHTML = '';
            document.getElementById("botones-paginacion").innerHTML = '';
        } else {
            totalPaginas = Math.ceil(objetitos.length / tamanioPagina); // Calcula el número total de páginas

            const renderizarPagina = async (pagina) => {
                tarjetas = ''; // Limpiar las tarjetas antes de renderizar nuevas
                document.getElementById("no-encontrado").innerHTML = ''; // Limpiar mensaje de no encontrado

                const inicio = (pagina - 1) * tamanioPagina; // Índice de inicio de la página
                const fin = inicio + tamanioPagina; // Índice de fin de la página
                const objetosPagina = objetitos.slice(inicio, fin); // Obtén los objetos para la página actual

                let objetosMostrados = 0; // Contador de objetos mostrados

                for (const element of objetosPagina) {
                    try {
                        let rta2 = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${element}`);
                        let resultado = await rta2.json();

                        if (resultado.primaryImage) { // Solo agregar si hay imagen
                            crearTarjeta(resultado);
                            objetosMostrados++;
                        } else {
                            console.log(`El objeto ${element} no tiene una primaryImage`);
                        }

                        // Si se han mostrado 20 objetos, salir del bucle
                        if (objetosMostrados >= tamanioPagina) {
                            break;
                        }
                    } catch (error) {
                        console.log(`Error al procesar el objeto ${element}:`, error);
                    }
                }

                // Si no se alcanzan los 20 objetos debido a falta de imágenes, seguir buscando hasta llenar la página
                let i = fin;
                while (objetosMostrados < tamanioPagina && i < objetitos.length) {
                    const element = objetitos[i];
                    try {
                        let rta2 = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${element}`);
                        let resultado = await rta2.json();

                        if (resultado.primaryImage) { // Solo agregar si hay imagen
                            crearTarjeta(resultado);
                            objetosMostrados++;
                        } else {
                            console.log(`El objeto ${element} no tiene una primaryImage`);
                        }
                    } catch (error) {
                        console.log(`Error al procesar el objeto ${element}:`, error);
                    }
                    i++;
                }

                document.getElementById("cont_tarjeta").innerHTML = tarjetas;
                actualizarBotonesPaginacion();
            };

            // Función para actualizar botones de paginación
            const actualizarBotonesPaginacion = () => {
                let botonesPaginacion = '';
                if (paginaActual > 1) {
                    botonesPaginacion += `<button onclick="cambiarPagina(${paginaActual - 1})" class="btn-paginacion">Anterior</button>`;
                }
                if (paginaActual < totalPaginas) {
                    botonesPaginacion += `<button onclick="cambiarPagina(${paginaActual + 1})" class="btn-paginacion">Siguiente</button>`;
                }
                document.getElementById("botones-paginacion").innerHTML = botonesPaginacion;
            };

            // Función para cambiar de página
            window.cambiarPagina = async (nuevaPagina) => {
                showLoader(); // Mostrar loader al cambiar de página
                paginaActual = nuevaPagina;
                await renderizarPagina(paginaActual);
                hideLoader(); // Ocultar loader después de renderizar la nueva página
            };

            // Renderiza la primera página al cargar
            await renderizarPagina(paginaActual);
        }
    } catch (error) {
        console.error('Error general:', error);
        hideLoader(); // Asegura que el loader se oculta en caso de error
    }
};
