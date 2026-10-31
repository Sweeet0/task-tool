const KEY = 'task-tool.tasks'

export function createTask(title, list = 'inbox', now = new Date()) {
  const iso = now.toISOString()
  return {
    id: crypto.randomUUID(),
    title,
    status: 'open',
    list,
    createdAt: iso,
    doneAt: null,
    nextAction: '',
    updatedAt: iso,
    note: '',
  }
}

export function toggleDone(task, now = new Date()) {
  const iso = now.toISOString()
  const done = task.status === 'open'
  return {
    ...task,
    status: done ? 'done' : 'open',
    doneAt: done ? iso : null,
    updatedAt: iso,
  }
}

export function loadTasks(storage = localStorage) {
  try {
    const parsed = JSON.parse(storage.getItem(KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveTasks(tasks, storage = localStorage) {
  storage.setItem(KEY, JSON.stringify(tasks))
}
