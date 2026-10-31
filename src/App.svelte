<script>
  import { createTask, toggleDone, loadTasks, saveTasks } from './lib/tasks.js'

  const DEFAULT_LIST = 'inbox'

  let tasks = $state(loadTasks())
  let title = $state('')
  let list = $state(DEFAULT_LIST)
  let newList = $state('')

  let lists = $derived([DEFAULT_LIST, ...new Set(tasks.map((t) => t.list).filter((l) => l !== DEFAULT_LIST))])
  let open = $derived(tasks.filter((t) => t.status === 'open'))
  let done = $derived(tasks.filter((t) => t.status === 'done'))

  function persist() {
    saveTasks($state.snapshot(tasks))
  }

  function add(e) {
    e.preventDefault()
    const text = title.trim()
    if (!text) return
    const target = newList.trim() || list
    tasks.unshift(createTask(text, target))
    title = ''
    newList = ''
    list = target
    persist()
  }

  function toggle(task) {
    const i = tasks.findIndex((t) => t.id === task.id)
    tasks[i] = toggleDone($state.snapshot(tasks[i]))
    persist()
  }
</script>

<main>
  <form onsubmit={add}>
    <input bind:value={title} placeholder="やること" aria-label="やること" />
    <select bind:value={list} aria-label="入力先">
      {#each lists as l}<option value={l}>{l}</option>{/each}
    </select>
    <input bind:value={newList} placeholder="新しい入力先" aria-label="新しい入力先" />
    <button type="submit">追加</button>
  </form>

  <ul>
    {#each open as t (t.id)}
      <li>
        <button class="check" onclick={() => toggle(t)} aria-label="完了にする"></button>
        <span>{t.title}</span>
        <small>{t.list}</small>
      </li>
    {/each}
  </ul>

  {#if done.length}
    <h2>完了</h2>
    <ul>
      {#each done as t (t.id)}
        <li class="done">
          <button class="check on" onclick={() => toggle(t)} aria-label="未完了に戻す">✓</button>
          <span>{t.title}</span>
          <small>{t.list}</small>
        </li>
      {/each}
    </ul>
  {/if}
</main>

<style>
  main { max-width: 480px; margin: 0 auto; padding: 16px; font-family: system-ui, sans-serif; }
  form { display: grid; gap: 8px; margin-bottom: 16px; }
  input, select, button[type='submit'] { font: inherit; font-size: 16px; padding: 8px; min-height: 44px; box-sizing: border-box; }
  ul { list-style: none; padding: 0; margin: 0; }
  li { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #eee; }
  li span { flex: 1; min-width: 0; overflow-wrap: anywhere; }
  li small { color: #888; flex-shrink: 0; max-width: 30%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  li.done span { text-decoration: line-through; color: #999; }
  h2 { font-size: 0.9rem; color: #888; margin: 24px 0 4px; }
  .check { width: 28px; height: 28px; border-radius: 50%; border: 2px solid #999; background: none; padding: 0; cursor: pointer; position: relative; flex-shrink: 0; }
  .check::after { content: ''; position: absolute; inset: -10px; }
  .check.on { background: #4a8; border-color: #4a8; color: #fff; }
</style>
