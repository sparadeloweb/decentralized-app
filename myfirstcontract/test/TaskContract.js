const TaskContract = artifacts.require("TaskContract");

contract("TaskContract", () => {
    before(async () => {
       this.tasksContract = await TaskContract.deployed(); // Lo guardo en una varialbe para poder utilizarlo en otro lado
    }); // Ejecuta este código antes de cualquier testeo

    it('migrate deployed successfully', async () => {
        const address = this.tasksContract.address; // Llamo a un valor
        // Para probar un valor no es igual a assert.
        assert.notEqual(address, null); // Variable, valor que no quiero
        assert.notEqual(address, undefined);
        assert.notEqual(address, 0x0);
        assert.notEqual(address, "");
    });

    it('get Tasks List', async () => { // Si la lista de tareas está lista
        const tasksCounter = await this.tasksContract.taskCounter();
        const task = await this.tasksContract.tasks(tasksCounter) // Traigo la última tarea
        assert.equal(task.id.toNumber(), tasksCounter); // Compruebo que el ID de la tarea sea un numero menor al contador de ayuda.
    });
 }); // Defino el testeo