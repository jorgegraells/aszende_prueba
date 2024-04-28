import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import moment from 'moment'; // Importa moment para formatear fechas correctamente

// Componente TaskForm que maneja tanto la creación como la edición de tareas
const TaskForm = ({ task, refreshTasks, setEditingTask }) => {
    // Estados para manejar los inputs del formulario
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');

    // Función para resetear el formulario, establece los campos a valores predeterminados y limpia el estado de edición
    const resetForm = useCallback(() => {
        setName('');
        setDescription('');
        setDueDate('');
        setEditingTask(null);  // Limpia el estado de edición al resetear el formulario
    }, [setEditingTask]);

    // Efecto que reacciona al cambio de la tarea actual, estableciendo los valores del formulario o reseteándolos si es necesario
    useEffect(() => {
        if (task) {
            // Si hay una tarea, configura los valores del formulario para la edición
            setName(task.name);
            setDescription(task.description);
            setDueDate(moment(task.dueDate).format('YYYY-MM-DD')); // Formatea la fecha para el input de tipo 'date'
        } else {
            // Si no hay tarea, resetea el formulario a los valores predeterminados
            resetForm();
        }
    }, [task, resetForm]);  // Incluye resetForm y task en las dependencias para reaccionar a sus cambios

    // Maneja el envío del formulario, enviando datos al servidor para crear o actualizar una tarea
    const handleSubmit = async (e) => {
        e.preventDefault();
        const taskData = {
            name,
            description,
            dueDate: moment(dueDate).format('YYYY-MM-DDTHH:mm:ss')  // Asegura el formato adecuado para el backend
        };

        try {
            if (task && task.id) {
                // Si la tarea existe y tiene un ID, realiza una actualización
                await axios.put(`http://localhost:8000/task/${task.id}`, taskData);
            } else {
                // Si no hay tarea existente, crea una nueva
                await axios.post('http://localhost:8000/task', taskData);
            }
            refreshTasks();  // Actualiza la lista de tareas
            resetForm();  // Resetear el formulario después de la operación
        } catch (error) {
            console.error('Error saving task:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>{task ? 'Edit Task' : 'Create Task'}</h1>
            <div>
                <label>Name:</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div>
                <label>Description:</label>
                <input type="text" value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <div>
                <label>Due Date:</label>
                <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            </div>
            <button type="submit">{task ? 'Update Task' : 'Add Task'}</button>
            {task && <button type="button" onClick={resetForm}>Cancel</button>}  {/* Botón para cancelar la edición*/}
        </form>
    );
};

export default TaskForm;
