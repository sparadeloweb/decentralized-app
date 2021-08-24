App = {
    web3Provider: '',
    
    contracts: {},

    init: async () => {
        console.log('Cargado');
        await App.loadEthereum();
        await App.loadAccount();
        await App.loadContracts();
        await App.render();
        await App.renderTask();
    },

    loadEthereum: async () => {
        if (window.ethereum) {
            console.log('Ethereum está cargado');
            App.web3Provider = window.ethereum;
        } else {
            console.log('Ethereum no está cargado');
        }
    },

    loadAccount: async () => {
        const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
        App.account = accounts[0]; // Traigo la primer cuenta :)
    },

    loadContracts: async () => {
        const res = await fetch('TaskContract.json'); // Llamo el contrato convertido a JSON
        const tasksContractJSON = await res.json(); // Convierto el JSON invocado de build/contracts a un valor legible
        App.contracts.tasksContract = TruffleContract(tasksContractJSON); // Lo paso por la lectora de Truffle
        App.contracts.tasksContract.setProvider(App.web3Provider); // Le paso un provider, obligatorio
        App.tasksContract = await App.contracts.tasksContract.deployed();
    },

    render: async () => {
        document.querySelector('#wallet').innerText = App.account;
    },

    renderTask: async () => {
        const counter = await App.tasksContract.taskCounter();
        const counterNumber = counter.toNumber();
        let html = '';

        for(let i = 0; i <= counterNumber; i++) {
            const task = await App.tasksContract.tasks(i);
            const taskId = task[0];
            const taskTitle = task[1];
            const taskDescription = task[2];
            const taskDone = task[3];
            const taskDate = task[4];

            let taskElement = `
                <div class="card bg-success my-3 p-3">
                    <div class="card-header d-flex justify-content-between">
                        <div>
                            <i class="fa fa-paperclip" aria-hidden="true"></i> ${taskTitle}
                        </div>
                        <div class="form-check form-switch">
                            <input class="form-check-input" data-id="${taskId}" type="checkbox" ${taskDone && "checked"} onchange="App.toggleDone(this)">
                        </div>
                    </div>
                    <div class="card-body">
                       <i class="fa fa-arrow-right" aria-hidden="true"></i> ${taskDescription}
                       <p class="my-2"><i class="fa fa-calendar" aria-hidden="true"></i> La tarea fue creada el: ${new Date(taskDate * 1000).toLocaleString()}</p>
                    </div>
                </div>
            `;
            html += taskElement; 
        }
        document.querySelector('#taskList').innerHTML = html;
    },

    createTask: async (title, description) => {
        const result = await App.tasksContract.createTask(title, description, {from: App.account}); // Cambio un valor
        console.log(result);
    },

    toggleDone: async (element) => {
        const id = element.dataset.id;
        await App.tasksContract.toggleDone(id, {from: App.account});
        window.location.reload();
    },
}