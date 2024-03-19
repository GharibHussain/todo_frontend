
import { Task } from "./Task.js"


class Todos {
    #tasks = []
    #backend_url

    constructor(backend_url) {
        this.#backend_url = backend_url
    }


    getTasks = async () => {
        return new Promise(async (resolve, reject) => {
            // http get
            fetch(this.#backend_url).then((response) => response.json())
            .then((json) => {
                this.#readJson(json)
                resolve(this.#tasks)    // return the #tasks
            }, (error) => {
                reject(error)   // return the error
            })
        })
    }

    // add the retieved tasks to the #tasks array
    #readJson(tasksAsJson) {
        tasksAsJson.forEach(element => {
            const task = new Task(element.id, element.description)
            this.#tasks.push(task)
        });
    }

    #addToArray(id, text) {
        const task = new Task(id, text)
        this.#tasks.push(task)
        return task
    }

    saveTask = async (text) => {
        return new Promise((resolve, reject) => {
            const json = JSON.stringify({description: text})
            
            // http post
            fetch(this.#backend_url + '/new', {
                method: "post",
                headers: {
                'Content-type' : "application/json"
                },
                body: json
            })
            .then((response) => response.json())
            .then((json) => {
                resolve(this.#addToArray(json.id, text))
            }, (error) => {
                reject(error)
            })
        }
        )
    }

    #removeFromArray(id) {
        const arrayWithoutRemoved = this.#tasks.filter((task) => task.getId() !== id)
        this.#tasks = arrayWithoutRemoved
    }

    // send a DELETE request to server
    removeTask = (id) => {
        return new Promise(async (resolve, reject) => {
            fetch(this.#backend_url + '/delete/' + id, {
                method: 'delete'
            })
            .then((response) => response.json())
            .then((json) => {
                this.#removeFromArray(id)
                resolve(json.id)    // if successful, return json.id
            }, (error) => {
                reject(error)       // if failed, return error
            })
        })
    }
}

export { Todos }