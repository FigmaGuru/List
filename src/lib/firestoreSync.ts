import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from './firebase'
import { useStore } from '@/store/useStore'
import { DEFAULT_MEALS } from '@/data/meals'

const STATE_DOC = doc(db, 'shared', 'state')

// Prevents our own Firestore writes from triggering a redundant local update
let syncingFromRemote = false

function pickSyncedState(state: ReturnType<typeof useStore.getState>) {
  return {
    meals: state.meals,
    plan: state.plan,
    shoppingList: state.shoppingList,
    articles: state.articles,
  }
}

/**
 * Starts real-time Firestore sync.
 * - Waits for the first snapshot before calling `onReady`.
 * - Local changes write to Firestore; remote changes update the local store.
 * Returns an unsubscribe function.
 */
export function startFirestoreSync(onReady: () => void): () => void {
  let unsubStore: (() => void) | null = null

  const unsubFirestore = onSnapshot(STATE_DOC, (snap) => {
    if (!snap.exists()) {
      // First use: push current local state up to Firestore
      const data = pickSyncedState(useStore.getState())
      setDoc(STATE_DOC, data).catch(console.error)
    } else {
      const remote = snap.data()
      const current = pickSyncedState(useStore.getState())

      // Only update local state if the data actually changed (avoids loops)
      if (JSON.stringify(remote) !== JSON.stringify(current)) {
        syncingFromRemote = true
        useStore.setState({
          meals: remote.meals ?? DEFAULT_MEALS,
          plan: remote.plan ?? {},
          shoppingList: remote.shoppingList ?? [],
          articles: remote.articles ?? [],
        })
        syncingFromRemote = false
      }
    }

    // After the first snapshot, wire up local → Firestore writes
    if (!unsubStore) {
      unsubStore = useStore.subscribe((state) => {
        if (syncingFromRemote) return
        setDoc(STATE_DOC, pickSyncedState(state)).catch(console.error)
      })
      onReady()
    }
  })

  return () => {
    unsubStore?.()
    unsubFirestore()
  }
}
