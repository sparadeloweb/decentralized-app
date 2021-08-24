// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract TaskContract {

    uint public taskCounter = 0;

    constructor () {
        createTask("Mi primer tarea", "Tengo que hacer algo");
    }

    struct Task {
        uint256 id;
        string title;
        string description;
        bool done;
        uint256 createdAt;
    }

    mapping(uint256 => Task) public tasks;


    // Función para crear tareas
    function createTask (string memory _title, string memory _description) public{
        taskCounter++;
        tasks[taskCounter] = Task(taskCounter, _title, _description, false, block.timestamp);
        // Igualo tasks ( que es el mapping, en su respectiva llave (id) ) al tipo de dato que recibe como parámetro los elementos asignados en el struct, en su respectivo orden.
        // Utilizo block.timestamp para obtener el tiempo en que se guarda la tarea.
    }

    // Función para modificar tarea a completada
    function toggleDone (uint _id) public {
        Task memory _task = tasks[_id];
        _task.done = !_task.done;
        tasks[_id] = _task;
    }

}