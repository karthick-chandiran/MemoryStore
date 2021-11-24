const _STOREAGEKEY = '__REMINDERS__'
    let _formState = {}
const onInputChange = (e) => {
    const {
        name,
        value
    } = e.target;
    _formState = {
        ..._formState,
        [name]: value
    }
}
const resetInputValue = () => {
    _formState = {}
}
function storeReminders(reminderObj) {
    let newReminders = getAllReminders() || [];
    newReminders.push(reminderObj)
    localStorage.setItem(_STOREAGEKEY, JSON.stringify(newReminders))
}
const getAllReminders = () => {
    return JSON.parse(localStorage.getItem(_STOREAGEKEY))
}

const formSubmit = (e) => {
    e.preventDefault()
    storeReminders(_formState)
    appendReminder(_formState)
}

const loadReminders = () => {
    let fragment = document.createDocumentFragment()
        const display = document.getElementById('reminder-display')
        const template = document.getElementById('reminder-template')
        const reminders = getAllReminders()
        if (reminders) {
            reminders.forEach((reminder) => {
                const content = template.content.cloneNode(true)
                    addContentInTemplate(content, reminder)
                    fragment.appendChild(content)
            })
            display.appendChild(fragment)
        }

}
const appendReminder = (reminder) => {
    let fragment = document.createDocumentFragment()
        const display = document.getElementById('reminder-display')
        const template = document.getElementById('reminder-template')
        const content = template.content.cloneNode(true)
        addContentInTemplate(content, reminder)
        fragment.appendChild(content)
        display.prepend(fragment)
}

const addContentInTemplate = (content, reminderObj) => {
    content.querySelector('.name').textContent = reminderObj.reminderName
        content.querySelector('.date').textContent = reminderObj.reminderDate
        const totalDays = calcTotalDays(reminderObj.reminderDate)
        content.querySelector('.noofdays').textContent = Math.abs(totalDays) + ' Days'
        if (totalDays < 0) {
            content.querySelector('.noofdays').setAttribute('title', `Memorable day in ${totalDays} Days`)
            content.querySelector('.anniversary').classList.add('hidden')
        } else {

            content.querySelector('.noofdays').setAttribute('title', `Memorable day occured ${totalDays} Days Before`)
            content.querySelector('.anniversary-days').textContent = `${calcRemainingDays(reminderObj.reminderDate)} Days`
        }
}
const calcTotalDays = (calcDate) => {
    return Math.round((new Date() - new Date(calcDate)) / (60 * 60 * 24 * 1000))
}
const calcRemainingDays = (calcDate) => {
    const formatCalcDate = new Date(calcDate)
        const currentYear = new Date().getFullYear()
        const nextCalcDate = `${currentYear + 1}-${formatCalcDate.getMonth()}-${formatCalcDate.getDate()}`
        return Math.round((new Date(nextCalcDate) - new Date()) / (60 * 60 * 24 * 1000))

}
document.addEventListener('DOMContentLoaded', function () {
    loadReminders()
})
