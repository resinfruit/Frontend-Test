'use client'
import React from 'react';
import styles from './test.module.css';
import {edgeServerAppPaths} from "next/dist/build/webpack/plugins/pages-manifest-plugin";

// Your Test Starts Here

interface TaskType {
    id: number;
    name: string;
    priority: string;
    completed: boolean;
}

export default function TaskManager(): JSX.Element {

    React.useEffect(() => { //as soon as page loads, call getTasks to load any previous from localStorage.
        getTasks();
    },[])

    //my variables
    const [tasks, setTasks] = React.useState<TaskType[]>([]);
    const [completedTasks, setCompletedTasks] = React.useState<TaskType[]>([]);

    const [newTaskName, setNewTaskName] = React.useState("");
    const [newTaskStatus, setNewTaskStatus] = React.useState(false); //set differently
    const [newTaskPriority, setNewTaskPriority] = React.useState("Medium");
    const [taskValidationError, setTaskValidationError] = React.useState("");
    const [taskFilter, setTaskFilter] = React.useState("All");

    const getTasks = () => {
        let tempTasks = localStorage.getItem("tasks"); //retrieves list from local storage

        if (tempTasks == null)
        {
            setTasks([])
        }
        else
        {
            setTasks(JSON.parse(tempTasks));
            //add filtering options here.
                //iterate through and add the ones that meet the conditions to a new list
                //then setTasks(the new list)
        }

    }
    const createTask = () => {
        if (newTaskName.length == 0) //no value entered for task name
        {
            setTaskValidationError("Please enter a value for task name.");
        }
        else
        {
            let localStorageTasks = localStorage.getItem("tasks");

            let newTaskObj = {
                id: new Date().getTime(),
                name: newTaskName,
                priority: newTaskPriority,
                completed: false
            }
            if (localStorageTasks==null) //if there are no tasks yet.
            {
                localStorage.setItem("tasks", JSON.stringify([newTaskObj]));
            }
            else
            {
                let tasks = JSON.parse(localStorageTasks);
                tasks.push(newTaskObj)
                localStorage.setItem("tasks", JSON.stringify(tasks));

                //clear error and fields
                setTaskValidationError("");
                setNewTaskName("");
                //setNewTaskPriority("Medium");

                getTasks();
            }
        }

    }
    const updateTask = (id:number) => {
        let tempTasksJson = localStorage.getItem("tasks"); //retrieves list from local storage
        if (tempTasksJson)
        {
            let tempTasks = JSON.parse(tempTasksJson);
            let taskToUpdate = tempTasks.find((task:TaskType)=>task.id == id)
            tempTasks[tempTasks.indexOf(taskToUpdate)].completed = !taskToUpdate.completed; //reverses the current completed value

            localStorage.setItem('tasks', JSON.stringify((tempTasks))); //sets localStorage.tasks = tempTasks

        }
        getTasks();

    }
    const deleteTask = (id:number) => {
        let tempTasksJson = localStorage.getItem("tasks"); //retrieves list from local storage
        if (tempTasksJson)
        {
            let tempTasks = JSON.parse(tempTasksJson);
            let taskToRemove = tempTasks.find((task:TaskType) => task.id == id)

            tempTasks.splice(tempTasks.indexOf(taskToRemove),1);
            localStorage.setItem('tasks', JSON.stringify((tempTasks))); //sets localStorage.tasks = tempTasks
        }
        getTasks();
    }



    React.useState<TaskType[]>

    return <div className={styles.container}>
        <div className={styles.addTask}>
            <div>
                <h3>New task</h3>
                <div className = {styles.newTaskEntry}>

                    <input
                        type = "text"
                        placeholder = "Enter task name..."
                        value={newTaskName}
                        onChange={(e) => {
                            setNewTaskName(e.target.value);
                        }}
                        onKeyDown={(e) => { //when enter is pressed in the field, create.
                            if (e.key == "Enter")
                                createTask();
                        }}
                    />
                    <p>Priority: </p>
                    <select
                        onChange={(e) => {
                            setNewTaskPriority(e.target.value);
                        }}
                        value={newTaskPriority}
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                    <button
                    onClick={() => {createTask()}}
                    >Add Task</button>
                    <p style={{color: 'red'}}>{taskValidationError}</p>
                </div>
            </div>
            <span>

            </span>
        </div>
        <div className={styles.taskDisplay}>
            <div className={styles.taskDisplayHeader}>
                <h3>Tasks</h3>
                <select onChange={(e) =>
            {
                setTaskFilter(e.target.value);
            }}>
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
            </select>
            </div>

            <div className={styles.tasks}>
                {
                    tasks.length>0 ? tasks.filter(item => !item.completed).map((task) => { //2 lists: active and completed tasks.
                        if (taskFilter == "All" || taskFilter == "Active")
                            return (
                                <div className ={styles.activeTask} key={task.id}>
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => {updateTask(task.id)}}
                                    ></input>
                                    <h3>{task.name}</h3>

                                    <p>{task.priority}</p>
                                    <button
                                        onClick={() => {deleteTask(task.id)}}>
                                        Delete
                                    </button>
                                </div>
                            )
                            })
                            :
                            <div className={styles.noTasks}>
                                <p>No tasks</p>
                            </div>
                }

                {
                    tasks.length>0 ? tasks.filter(item => item.completed).map((task) =>{
                        if(taskFilter == "All" || taskFilter == "Completed")
                        return(
                            <div className = {styles.completedTask} key={task.id}>
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => {updateTask(task.id)}}
                                ></input>
                                <h3>{task.name}</h3>

                                <p>{task.priority}</p>
                                <button
                                    onClick={() => {deleteTask(task.id)}}>
                                    Delete
                                </button>
                            </div>
                        )
                    }): <p></p>
                }
            </div>
        </div>


    </div>;
};