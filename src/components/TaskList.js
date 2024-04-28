import React from 'react';
import axios from 'axios';

// TaskList muestra la lista de tareas y proporciona botones para editar y eliminar tareas.
const TaskList = ({ tasks, onEdit, refreshTasks }) => {
    // Primero, verificamos si 'tasks' es un array para prevenir errores en el renderizado.
    if (!Array.isArray(tasks)) {
        console.error('tasks is not an array', tasks);
        // Mostramos un mensaje de error en la interfaz si tasks no es un array.
        return <p>Error: tasks is not an array!</p>;
    }

    // Función para manejar la eliminación de tareas.
    const handleDelete = async (id) => {
        try {
            // Realiza una solicitud DELETE al servidor usando el id de la tarea.
            await axios.delete(`http://localhost:8000/task/${id}`);
            // Recarga la lista de tareas después de eliminar una tarea para actualizar la vista.
            refreshTasks();
        } catch (error) {
            // Registra en consola si hay un error durante la eliminación de la tarea.
            console.error('Failed to delete task:', error);
        }
    };

    // Renderiza la lista de tareas utilizando la prop 'tasks'.
    return (
        <div>
            <h1>Task List</h1>
            <ul>
                {tasks.map(task => (
                    <li key={task.id}>
                        {/* Muestra la información de la tarea incluyendo su nombre, descripción y fecha de vencimiento. */}
                        {task.name} - {task.description} - Due on: {task.dueDate}
                        {/* Botón para editar la tarea. Llama a 'onEdit' pasando la tarea específica. */}
                        <button onClick={() => onEdit(task)}>Edit</button>
                        {/* Botón para eliminar la tarea. Llama a 'handleDelete' pasando el ID de la tarea. */}
                        <button onClick={() => handleDelete(task.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskList;
