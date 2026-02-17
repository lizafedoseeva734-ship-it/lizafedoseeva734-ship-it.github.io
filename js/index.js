const colors = {
    GREEN: '#C2F37D',
    BLUE: '#7DE1F3',
    RED: '#F37D7D',
    YELLOW: '#F3DB7D',
    PURPLE: '#E77DF3',
}

const MOCK_NOTES = [
    {
        id: 1,
        title: 'Работа с формами',
        content: 'К определённым полям формы можно обратиться через form.elements по значению, указанному в атрибуте name',
        color: colors.GREEN,
        isFavorite: false,
    },
]

const model = {
    notes: MOCK_NOTES,
    showOnlyFavorites: false,

    addNote(title, content, color) {
        const id = new Date().getTime();
        const isFavorite = false;
        const newNote = {
            id,
            title,
            content,
            color,
            isFavorite,
        }
        this.notes.unshift(newNote)
        this.updateNotesView()
    },

    deleteNote(id) {
        const index = this.notes.findIndex(note => note.id === +id)
        this.notes.splice(index, 1)
        this.updateNotesView()
    },

    toggleFavorite(id) {
        const note = this.notes.find(note => note.id === +id)
        note.isFavorite = !note.isFavorite
        this.updateNotesView()
    },

    updateNotesView() {
        const notesToRender = this.getFilteredNotes()
        view.renderNotes(notesToRender)
        view.renderNotesCount(this.notes)
        view.toggleFilterVisibility()
    },

    getFilteredNotes() {
        if (this.showOnlyFavorites) {
            return this.notes.filter(note => note.isFavorite === true)
        }
        return this.notes
    }
}

const view = {
    renderNotes(notes) {
        const list = document.querySelector(".notes-list")
        if (notes.length === 0) {
            list.innerHTML = '<p class="empty-message">У вас ещё нет ни одной заметки.<br>Заполните поля выше и создайте свою первую заметку!</p>'
        } else {
            const notesHTML = notes.map(note => `
                <li class="note-item" data-note-id="${note.id}">
                    <div class="note-header" style="background-color: ${note.color};">
                        <h3>${note.title}</h3>
                        <div class="note-actions">
                            <button class="favorite-btn"><img src="${note.isFavorite ? '/image/icons/heart active.svg' : '/image/icons/heart inactive.svg'}" alt=""></button>
                            <button class="delete-btn"><img src="image/icons/trash.svg" alt=""></button>
                        </div>
                    </div>
                    <p>${note.content}</p>
                </li>
            `).join('')
            list.innerHTML = notesHTML
        }
    },

    renderNotesCount(notes) {
        const quantity = document.querySelector(".quantity")
        quantity.textContent = `Всего заметок: ${notes.length}`
    },

    toggleFilterVisibility() {
        const filterBox = document.querySelector('.filter-box')
        filterBox.style.display = model.notes.length === 0 ? 'none' : 'flex'
    },

    handleFormSubmit() {
        const form = document.querySelector(".note-form")
        form.addEventListener('submit', (event) => {
            event.preventDefault()

            const title = document.querySelector('.title').value.trim()
            const description = document.querySelector('.description').value.trim()
            const colorValue = document.querySelector('input[name="color"]:checked')?.value

            if (title === '' || description === '') {
                view.showNotification('Заполните все поля!', true)
                return
            }

            if (title.length > 50) {
                view.showNotification('Максимальная длина заголовка - 50 символов', true)
                return
            }

            if (description.length > 250) {
                view.showNotification('Максимальная длина описания - 250 символов', true)
                return
            }

            const colorHex = {
                yellow: colors.YELLOW,
                red: colors.RED,
                green: colors.GREEN,
                blue: colors.BLUE,
                purple: colors.PURPLE
            }[colorValue]

            controller.addNote(title, description, colorHex)
        })
    },

    showNotification(text, isError = false) {
        const container = document.querySelector('.messages-box')
        const notification = document.createElement('div')
        notification.classList.add('notification')
        if (isError) notification.classList.add('notification-error')


        const icon = document.createElement('img')
        icon.src = isError ? '/image/icons/warning.svg' : '/image/icons/done.svg'
        icon.alt = ''
        icon.classList.add('notification-icon')


        notification.appendChild(icon)
        notification.appendChild(document.createTextNode(text))

        container.appendChild(notification)
        setTimeout(() => notification.remove(), 3000)
    },

    handleFilterChange() {
        const checkbox = document.querySelector(".filter-favorite")
        checkbox.addEventListener('change', (event) => {
            model.showOnlyFavorites = event.target.checked
            model.updateNotesView()
        })
    },

    init() {
        document.querySelector('.notes-list').addEventListener('click', (event) => {
            const button = event.target.closest('button')
            if (!button) return

            const noteItem = button.closest('.note-item')
            if (!noteItem) return

            const noteId = noteItem.dataset.noteId
            if (button.classList.contains('delete-btn')) {
                controller.deleteNote(noteId)
            }
            if (button.classList.contains('favorite-btn')) {
                controller.toggleFavorite(noteId)
            }
        })

        this.handleFormSubmit()
        this.handleFilterChange()
        this.toggleFilterVisibility()
    }
}

const controller = {
    deleteNote(id) {
        model.deleteNote(id)
        view.showNotification('Заметка удалена')
    },

    toggleFavorite(id) {
        model.toggleFavorite(id)
    },

    addNote(title, content, color) {
        model.addNote(title, content, color)
        view.showNotification('Заметка добавлена')
        document.querySelector('.title').value = ''
        document.querySelector('.description').value = ''
        document.querySelector('input[name="color"][value="yellow"]').checked = true
    }
}

function startApp() {
    model.updateNotesView()
    view.init()
}

startApp()
