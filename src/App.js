import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

// Componente principal App que maneja el estado y la lógica de la aplicación
function App() {
    // Estado para almacenar la lista de tareas
    const [tasks, setTasks] = useState([]);
    // Estado para gestionar la tarea que está siendo editada
    const [editingTask, setEditingTask] = useState(null);

    // useEffect se ejecuta después del primer renderizado y cada vez que cambian sus dependencias
    useEffect(() => {
        fetchTasks();  // Llama a fetchTasks para cargar las tareas desde el servidor
    }, []);  // Lista de dependencias vacía, por lo que solo se ejecuta después del primer renderizado

    // Función asíncrona para cargar tareas desde el backend
    const fetchTasks = async () => {
        try {
            // Realiza una petición GET al servidor para obtener las tareas
            const response = await axios.get('http://localhost:8000/tasks');
            // Establece el estado de tasks con los datos obtenidos, asegurando que siempre es un array
            setTasks(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            // Captura y registra errores si la petición falla
            console.error('Error fetching tasks:', error);
        }
    };

    // Función para manejar la selección de una tarea para editarla
    const handleEditTask = (task) => {
        setEditingTask(task);  // Establece la tarea seleccionada en el estado editingTask
    };

    // Renderiza el componente App con los formularios y la lista de tareas
    return (
        <div>
            {/* TaskForm maneja la creación y actualización de tareas. Recibe la tarea a editar, la función para refrescar la lista y la función para resetear la edición. */}
            <TaskForm task={editingTask} refreshTasks={fetchTasks} setEditingTask={setEditingTask} />
            {/* TaskList muestra las tareas y permite seleccionar una para editar o eliminar. */}
            <TaskList tasks={tasks} onEdit={handleEditTask} refreshTasks={fetchTasks} />
        </div>
    );
}

export default App;
