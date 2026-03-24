import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from './firebase'
import { useStore } from '@/store/useStore'
import { DEFAULT_MEALS } from '@/data/meals'

const STATE_DOC = doc(db, 'shared', 'state')

// Prevents our own Firestore writes from triggering a redundant local update
let syncingFromRemote = false
// Debounce timer — batches rapid successive state changes into one Firestore write
let writeTimer: ReturnType<typeof setTimeout> | null = null
// True while a setDoc call is in-flight. Prevents a failed write's revert snapshot
// from overwriting local state (Firestore fires the revert snapshot after rejection,
// at which point writeTimer is already null).
let writeInFlight = false

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
  let initialSyncDone = false

  // Wire up local → Firestore writes immediately so that any changes made
  // before the first snapshot arrives are tracked by writeTimer.
  // Without this, changes made before the first snapshot would not set
  // writeTimer, so the snapshot handler would overwrite them with stale
  // remote data.
  const unsubStore = useStore.subscribe(() => {
    if (syncingFromRemote) return
    // Debounce so that rapid successive updates (e.g. addMeal + addMealToDay
    // called back-to-back) are batched into a single Firestore write.
    // Without this, the first write (meals only) comes back as a snapshot and
    // overwrites local state, wiping the plan entry added by addMealToDay.
    if (writeTimer) clearTimeout(writeTimer)
    writeTimer = setTimeout(() => {
      writeTimer = null
      if (syncingFromRemote) return
      writeInFlight = true
      setDoc(STATE_DOC, pickSyncedState(useStore.getState()))
        .then(() => { writeInFlight = false })
        .catch((err) => {
          console.error(err)
          // Delay clearing the flag so the revert snapshot Firestore fires on
          // rejection is still blocked from overwriting our local state.
          setTimeout(() => { writeInFlight = false }, 2000)
        })
    }, 300)
  })

  const unsubFirestore = onSnapshot(STATE_DOC, (snap) => {
    if (!snap.exists()) {
      // First use: push current local state up to Firestore
      const data = pickSyncedState(useStore.getState())
      setDoc(STATE_DOC, data).catch(console.error)
    } else {
      const remote = snap.data()
      const current = pickSyncedState(useStore.getState())

      // Only update local state if the data actually changed (avoids loops).
      // Skip if there's a pending local write — applying stale remote data would
      // overwrite changes the user just made before they're flushed to Firestore.
      if (JSON.stringify(remote) !== JSON.stringify(current) && !writeTimer && !writeInFlight) {
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

    if (!initialSyncDone) {
      initialSyncDone = true
      onReady()
    }
  })

  return () => {
    if (writeTimer) clearTimeout(writeTimer)
    writeInFlight = false
    unsubStore()
    unsubFirestore()
  }
}
