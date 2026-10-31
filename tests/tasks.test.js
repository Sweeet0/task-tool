import { describe, it, expect } from 'vitest'
import { createTask, toggleDone, loadTasks, saveTasks } from '../src/lib/tasks.js'

function fakeStorage() {
  const m = new Map()
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, v) }
}

describe('tasks', () => {
  it('9項目を持つタスクを作る', () => {
    const t = createTask('牛乳を買う')
    expect(Object.keys(t).sort()).toEqual(
      ['createdAt', 'doneAt', 'id', 'list', 'nextAction', 'note', 'status', 'title', 'updatedAt'],
    )
    expect(t.list).toBe('inbox')
    expect(t.status).toBe('open')
    expect(t.doneAt).toBeNull()
  })

  it('完了と未完了を切り替える', () => {
    const t = createTask('a')
    const d = toggleDone(t)
    expect(d.status).toBe('done')
    expect(d.doneAt).not.toBeNull()
    const o = toggleDone(d)
    expect(o.status).toBe('open')
    expect(o.doneAt).toBeNull()
  })

  it('保存して読み出せる／壊れていたら空', () => {
    const s = fakeStorage()
    const t = createTask('a')
    saveTasks([t], s)
    expect(loadTasks(s)).toEqual([t])
    s.setItem('task-tool.tasks', '{broken')
    expect(loadTasks(s)).toEqual([])
  })
})
