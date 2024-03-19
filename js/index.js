const BACKEND_ROOT_URL = 'http://localhost:3001'
import { Todos } from "./class/Todos.js"

const todos = new Todos(BACKEND_ROOT_URL)

const list = document.querySelector('ul')
const input = document.querySelector('input')

const renderTask = (task) => {
    console.log(task)
    const li = document.createElement('li')
    li.setAttribute('class', 'list-group-item')
    // store the id inside the li element
    li.setAttribute('data-key', task.getId().toString())
    renderSpan(li, task.getText())
    renderLink(li, task.getId())
    list.append(li)
}

// create a span element and append it to the li element
const renderSpan = (li, text) => {
    const span = li.appendChild(document.createElement('span'))
    span.innerHTML = text
}

// create a hyperlink containing the icon
const renderLink = (li, id) => {
    // anchor element (hyperlink)
    const a = li.appendChild(document.createElement('a'))
    a.innerHTML = '<i class="bi bi-trash"></i>'     // bootsrap icon
    a.setAttribute('style', 'float: right')
    // add a listener
    a.addEventListener('click', (event) => {
        // the removeTask method returns the id of the removed task
        todos.removeTask(id).then((removed_id) => {
            const li_to_remove = document.querySelector(`[data-key='${removed_id}']`)   // select the element with the data-key
            if (li_to_remove) {
                list.removeChild(li_to_remove)
            }
        }).catch((error) => {
            alert(error)
        })
    })
}

// http get
const getTasks = async () => {
    todos.getTasks().then((tasks) => {
        tasks.forEach((currentTask) => {
            renderTask(currentTask)
        })
    }).catch((error) => {
        alert(error)
    })

    /** Without the Todos class, we could send the lrequest this way
    try {
        const response = await fetch(BACKEND_ROOT_URL)
        const json = await response.json() // a json array of tasks
        
        json.forEach(task => {
            renderTask(task.description)
        });
        input.disabled = false
    } catch (error) {
        alert('Error retrieving tasks ' + error.message)
    }
    */
}

// http post 
/**
const saveTask = async (text) => {
    
    try {
        const json = JSON.stringify({description: task})    // json data to be sent to server

        const response = await fetch(BACKEND_ROOT_URL + '/new', {
            method: "post",
            headers: {
            'Content-type' : "application/json"
            },
            body: json
        })
        return response.json()
    } catch (error) {
        alert('Error saving task: ' + error.message)
    } 


}
*/

input.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault()
        const taskText = input.value.trim()
        if (taskText !== '') {
            todos.saveTask(taskText).then((task) => {
                renderTask(task)    // the task object is passed
                input.value = ''
                input.focus()
            }) 
        }
    }
})

getTasks()