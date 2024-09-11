// Array publico de empleados
var empleados = [];

// Array publico de tareas
var tareas = [];

// Función para cargar las opciones del combobox de usuarios asignado
function cargarUsuariosAsignados() {
    var selectUsuarios = $("#assigned-user");
    selectUsuarios.empty(); // Limpiar las opciones actuales

    // Agregar las opciones del combobox basadas en los empleados
    empleados.forEach(function (empleado) {
        selectUsuarios.append($('<option>', {
            value: empleado,
            text: empleado
        }));
    });
}

function agregarEmpleado(e) {
    e.preventDefault();

    // Obtener el valor del nombre del empleado
    var employeeName = $("#employee-name").val().trim();

    // Verificar si se proporcionó un nombre de empleado
    if (employeeName !== "") {
        // Agregar el nombre del empleado al array de empleados
        empleados.push(employeeName);
        // Volver a cargar las opciones del combobox de usuarios asignados
        cargarUsuariosAsignados();
        // Limpiar el campo de entrada después de agregar el empleado
        $("#employee-name").val("");
        alertify.success('Empleado agregado con exito!');
        console.log(empleados);
    } else {
        // Mostrar un mensaje de error si no se proporcionó un nombre de empleado
        Swal.fire("Por favor ingrese un nombre de empleado.");
    }
}

function agregarTarea(e) {
    e.preventDefault();

    // Obtener los valores de los campos del formulario
    var descripcion = $("#task-description").val().trim();
    var usuarioAsignado = $("#assigned-user").val().trim();
    var prioridad = $("#priority").val().trim();

    if (descripcion == "" || usuarioAsignado == "" || prioridad == "") {
        Swal.fire("Debe llenar todos los campos");
        return;
    } else {
        // Agregar lógica para generar un ID único para la tarea
        var id = generarIdUnico();

        // Crear un objeto que represente la tarea
        var tarea = {
            id: id,
            descripcion: descripcion,
            usuarioAsignado: usuarioAsignado,
            prioridad: prioridad,
            estado: 'Pendiente'
        };

        // Agregar la tarea al arreglo de tareas
        tareas.push(tarea);

        // Agregar la fila a la tabla DataTable
        var table = $('#data-table').DataTable();
        table.row.add([
            id,
            descripcion,
            usuarioAsignado,
            prioridad,
            'Pendiente',
            '<div class="btn-group" role="group"><button class="btn btn-danger btn-eliminar">Eliminar</button><button class="btn btn-success btn-estado">Cambiar Estado</button></div>',
        ]).draw(false);

        // Limpiar el formulario después de agregar la tarea
        $("#task-form").trigger("reset");

        // Mostrar notificación de éxito con Alertify
        alertify.success('¡Tarea agregada correctamente!');
        console.log(tareas);
    }
}

// Función para eliminar tarea
function EliminarTarea(e, fila) {
    e.preventDefault();

    // Mostrar el diálogo de confirmación de Sweet Alert
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Si el usuario confirma, eliminar la fila de la tabla
            var table = $('#data-table').DataTable();
            var rowData = table.row(fila).data(); // Obtener los datos de la fila
            var idTarea = rowData[0]; // Obtener el ID de la tarea
            table.row(fila).remove().draw(false);

            // Eliminar la tarea del arreglo de tareas
            for (var i = 0; i < tareas.length; i++) {
                if (tareas[i].id === idTarea) {
                    tareas.splice(i, 1);
                    break;
                }
            }

            // Mostrar notificación de éxito con Sweet Alert
            Swal.fire('Eliminado', 'La fila ha sido eliminada correctamente', 'success');
            console.log(tareas);
        }
    });
}


function CambiarEstadoTarea(e, fila) {
    e.preventDefault();

    // Obtener el estado actual de la tarea
    var estado = fila.children().eq(4).text();

    // Cambiar el estado de la tarea
    if (estado === "Pendiente") {
        fila.children().eq(4).text("Completado");
    } else {
        fila.children().eq(4).text("Pendiente");
    }

    // Mostrar notificación de éxito con Sweet Alert
    Swal.fire('¡Estado actualizado!', 'El estado de la tarea ha sido cambiado correctamente', 'success');
}

function autoCompletar() {
    // Obtén el elemento de entrada para el usuario asignado
    var inputUsuarioAsignado = $("#assigned-user");

    // Configura el Autocomplete
    inputUsuarioAsignado.autocomplete({
        source: empleados, // Utiliza el array de empleados como fuente de datos
        minLength: 0, // Muestra la lista de sugerencias al comenzar a escribir
        delay: 0 // No hay retraso antes de mostrar las sugerencias
    });
}

// Llamar a la función al cargar la página
$(document).ready(function () {
    // Inicializar DataTables en la tabla de tareas asignadas
    $('#data-table').DataTable();

    // Cuando se hace clic en el botón "Agregar empleado"
    $("#add-employee").click(function (e) {
        agregarEmpleado(e);
    });

    // Cuando se hace clic en el botón "Guardar Tarea"
    $("#add-task").click(function (e) {
        agregarTarea(e);
    });

    // Cuando se hace clic en el botón "Eliminar"
    $("#data-table").on("click", ".btn-eliminar", function (e) {
        var fila = $(this).closest("tr");
        EliminarTarea(e, fila);
    });

    // Cuando se hace clic en el botón "Cambiar Estado"
    $("#data-table").on("click", ".btn-estado", function (e) {
        var fila = $(this).closest("tr");
        CambiarEstadoTarea(e, fila);
    });

    // Cuando se hace clic en el botón "Limpiar"
    $("#clear-task-form").click(function (e) {
        // Limpiar los valores de los campos del formulario
        $("#task-description").val("");
        $("#assigned-user").val("");
        $("#priority").val("");

        // Mostrar una notificación de éxito
        alertify.success('Lista de tareas limpiada con éxito!');
    });

    // Llamar a la función de autocompletar
    autoCompletar();

});

// Función para generar un ID único
function generarIdUnico() {
    return Date.now();
}