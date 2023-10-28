// Entrega Final JS - Zeballos Sebastian
// En esta entrega realizare un simulador donde nos va a mostrar diferentes opciones para comprar un plan de ahorro de un vehiculo
// Se incluyo una consulta via fetch para consultar la cotizacion del dolar del dia.

// --- DOM "Carga de filtros" -- //

//SEGMENTOS
const segmentoSelect = document.getElementById("segmentoSelect");
const segmentos = [...new Set(planes.map(plan => plan.segmento))]; // Obtener segmentos únicos
// Crear opciones para cada segmento
segmentos.forEach(segmento => {
    const opcion = document.createElement("option");
    opcion.value = segmento;
    opcion.textContent = segmento;
    segmentoSelect.appendChild(opcion);
});

//MARCAS
const marcaSelect = document.getElementById("marcaSelect");
const marcas = [...new Set(planes.map(plan => plan.marca))]; // Obtener marcas únicas
// Crear opciones para cada marca
marcas.forEach(marca => {
    const opcion = document.createElement("option");
    opcion.value = marca;
    opcion.textContent = marca;
    marcaSelect.appendChild(opcion);
});

//MODELO
const modeloSelect = document.getElementById("modeloSelect");
const modelos = [...new Set(planes.map(plan => plan.modelo))]; // Obtener modelos únicos
// Crear opciones para cada modelo
modelos.forEach(modelo => {
    const opcion = document.createElement("option");
    opcion.value = modelo;
    opcion.textContent = modelo;
    modeloSelect.appendChild(opcion);
});

//CARGA DE PLANES MEDIANTE DOM
const cargarPlanes = (planes) => {
    const contenedor = document.getElementById("planesSection");

    planes.forEach(plan => {
        const div = document.createElement('div');
        div.classList.add('tarjetas');
        div.innerHTML += `
                            <div class="fichas">
                                <div>
                                    <img src="${plan.img}" alt="">
                                    <h3>${plan.marca} ${plan.modelo}</h3>
                                    <h4>${plan.desc}</h4>
                                    <h4>${plan.segmento}</h4>
                                    <h4>$ ${plan.precio.toLocaleString()}</h4>
                                    <h4>Financiacion:  ${plan.financiacion} %</h4>
                                    <a href="#" class="btn btn-primary" id="comprar_${plan.id}">Comprar Ahora!</a>
                                </div>
                            </div>
                        `
        contenedor.appendChild(div);

        // Agregar un controlador de eventos al botón "Comprar Ahora"
        const botonComprar = div.querySelector(`#comprar_${plan.id}`);
        botonComprar.addEventListener("click", function (event) {
            event.preventDefault(); // Evita que el enlace se comporte como un enlace
            const idPlan = plan.id;

            let planSelect = planes.find(x => x.id === idPlan);
            planSeleccionado(planSelect);
            // Llama a la función que deseas ejecutar al hacer clic en "Comprar Ahora"
            comprar(planSelect);
        });
    });
};


// Función que se ejecutará al hacer clic en "Comprar Ahora"
const formularioModal = new bootstrap.Modal(document.getElementById("formularioModal"));
const comprar = (planSelect) => {
    // Obtener los elementos del formulario modal
    const modalModel = document.querySelector("#modelo");
    const modalPrecio = document.querySelector("#precio");
    const modalFinanciacion = document.querySelector("#financiacion");
    const modalEntregaMinima = document.querySelector("#entregaMinima");
    const modalEntrega = document.querySelector("#entrega");
    const modalBtnCalcular = document.querySelector("#btn_calcular");


    //calculo entrega minima
    let entregaMinima = planSelect.precio * (100 - planSelect.financiacion) / 100;

    // Rellenar los campos del formulario modal con los datos del plan
    modalModel.textContent = `${planSelect.marca} ${planSelect.modelo}`;
    modalPrecio.textContent = `Precio final $ ${planSelect.precio.toLocaleString()}`;
    modalFinanciacion.textContent = `Porcentaje de Financiación ${planSelect.financiacion} %`;
    modalEntregaMinima.textContent = 'Entrega minima $ ' + entregaMinima.toLocaleString();
    modalEntrega.value = entregaMinima; // Puedes establecer un valor predeterminado para la entrega si lo deseas

    cargarCantCuotas(cantCuotas);

    // Agregar un controlador de eventos al botón "Calcular"
    modalBtnCalcular.addEventListener("click", function () {
        // Obtener los datos del formulario modal
        const email = document.querySelector("#email").value;
        const entrega = parseFloat(modalEntrega.value);
        const cuotasSelect = document.querySelector('input[name="flexRadioDefault"]:checked').value;

        if (!isNaN(email) || email == "") {
            Swal.fire(
                'Por favor ingresar un correo'
                )
        } else if (!validarEmail(email)) {
            Swal.fire(
                'Por favor ingresar un correo valido'
                )
        }

        else if (isNaN(entrega) || entrega === "") {
            Swal.fire(
                'Por favor ingresar un valor'
            )
        }

        else if ( parseFloat(entregaMinima) > parseFloat(entrega) ){
            Swal.fire(
                'El monto de la entrega no supera el minimo'
            )
        }

        else{
            formularioModal.hide();
            detalleCompra(entrega, cuotasSelect);
        }
    });

    // Mostrar el modal
    formularioModal.show();
}

// Agrega un controlador de eventos al botón de filtrado
const filtrarButton = document.getElementById("filtrar");
filtrarButton.addEventListener("click", function () {
    const filtroSegmento = segmentoSelect.value;
    const filtroMarca = marcaSelect.value;
    const filtroModelo = modeloSelect.value;

    // Realiza el filtrado basado en las selecciones
    const planesFiltrados = planes.filter(plan => {
        const cumpleSegmento = filtroSegmento === "-- Todos --" || plan.segmento === filtroSegmento;
        const cumpleMarca = filtroMarca === "-- Todos --" || plan.marca === filtroMarca;
        const cumpleModelo = filtroModelo === "-- Todos --" || plan.modelo === filtroModelo;
        return cumpleSegmento && cumpleMarca && cumpleModelo;
    });

    // Limpia el contenedor de planes existente
    const contenedorPlanes = document.getElementById("planesSection");
    contenedorPlanes.innerHTML = "";

    // Carga los planes filtrados en el contenedor
    cargarPlanes(planesFiltrados);

    // Verifica si no hay resultados y muestra el modal
    if (planesFiltrados.length === 0) {
        const sinResultadosModal = new bootstrap.Modal(document.getElementById("sinResultadosModal"));
        sinResultadosModal.show();
    }
});


// Funcion Validar Mail
let validarEmail = valor => {
    let check = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (valor.match(check)) {
        return true
    } else {
        return false
    }
}

//cargar la cantida de cuotas
const cargarCantCuotas = (cantCuotas) => {
    const contenedorCantCuotas = document.getElementById("contenedorCantCuotas");
    contenedorCantCuotas.innerHTML = "";
    cantCuotas.forEach(cuota => {
        const divCuota = document.createElement("div");
        divCuota.classList.add("form-check");
        divCuota.innerHTML += ` 
                                        <input class="form-check-input" type="radio" 
                                        name="flexRadioDefault" value="${cuota.id}">
                                        <label class="form-check-label" for="flexRadioDefault1">
                                            ${cuota.meses} - ( Interes: ${cuota.interes} % Anual)
                                        </label>        
                                    `
        contenedorCantCuotas.appendChild(divCuota);
    });
};

// Funcion para mostrar el modal de Detalle de compra
const detalleCompraModal = new bootstrap.Modal(document.getElementById("detalleCompraModal"));
const detalleCompra = (entrega, cuotasSelect) => {
    //Calculo de los Datos
    let planSelect = JSON.parse(localStorage.getItem('plan'));
    let cantCuotasSelect = cantCuotas.find( x=> x.id == cuotasSelect);
    let montoAdeudado = planSelect.precio - entrega;
    let interesTotal = cantCuotasSelect.interes * (cantCuotasSelect.meses / 12);
    let intereses = (montoAdeudado * interesTotal) / 100;
    let deudaTotal = montoAdeudado + intereses;
    let valorCuota = deudaTotal / cantCuotasSelect.meses;
        
    const contenedorDetalleCompra = document.getElementById("contenedorDetalleCompra");
    contenedorDetalleCompra.innerHTML = "";
    const divDetalle = document.createElement("div");
    divDetalle.innerHTML += `
                                <h4><b>${planSelect.marca} ${planSelect.modelo}</b></h4>
                                <p>Precio $ ${planSelect.precio.toLocaleString()}</p>
                                <p>Monto entregado $ ${entrega.toLocaleString()}</p>
                                <br>
                                <h4><b>Detalle de la Financiación</b></h4>
                                <p>Monto adeudado $ ${montoAdeudado.toLocaleString()}</p>
                                <p>Cantidad de Cuotas seleccionadas: ${cantCuotasSelect.meses} Meses</p>
                                <p>Porcentaje de los intereses Anual: ${cantCuotasSelect.interes} %</p>
                                <p>Interes Total a ${cantCuotasSelect.meses} meses = ${interesTotal} % </p>
                                <p>Importe de Intereses $ ${intereses.toLocaleString()}</p>
                                <p>Deuda Total con Intereses $ ${deudaTotal.toLocaleString()}</p>
                                <p><b>Valor de la Cuota Mensual $ ${valorCuota.toLocaleString()}</b></p>
    `
    contenedorDetalleCompra.appendChild(divDetalle);
    
    detalleCompraModal.show();
}



let planSeleccionado = p => {
    const dato = JSON.stringify(p);
    localStorage.setItem('plan', dato)
}

//----uso de API FETCH----//

let url = "https://www.dolarsi.com/api/api.php?type=valoresprincipales"

fetch(url)
    .then(response => response.json())
    .then(data => {
        const dolarventa = parseFloat(data[1]["casa"]["venta"])

        const dolarelement = document.createElement("div")
        dolarelement.innerHTML = `
    <h5 class="dolar">Cotización Dolar hoy: U$D ${dolarventa}<h5>`;
        datodolar.appendChild(dolarelement);
        sessionStorage.setItem("Dolar", dolarventa)
    })


cargarPlanes(planes);


