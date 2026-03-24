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
        // Detect meals that exist locally but not in the remote snapshot.
        // These are meals that were added locally but whose Firestore write
        // failed (e.g. network error) or was cancelled (e.g. app closed within
        // the 300 ms debounce window).  Blindly replacing local state with the
        // remote snapshot would permanently discard them.
        const remoteMealIds = new Set((remote.meals ?? []).map((m: { id: string }) => m.id))
        const localOnlyMeals = current.meals.filter((m) => !remoteMealIds.has(m.id))

        if (localOnlyMeals.length > 0) {
          // Merge: keep the remote state (plan, shopping, articles) but add
          // back the locally-only meals so they are not lost.  Then push the
          // merged result to Firestore so it finally gets persisted.
          const mergedMeals = [...(remote.meals ?? DEFAULT_MEALS), ...localOnlyMeals]
          syncingFromRemote = true
          useStore.setState({
            meals: mergedMeals,
            plan: remote.plan ?? {},
            shoppingList: remote.shoppingList ?? [],
            articles: remote.articles ?? [],
          })
          syncingFromRemote = false
          writeInFlight = true
          setDoc(STATE_DOC, pickSyncedState(useStore.getState()))
            .then(() => { writeInFlight = false })
            .catch((err) => {
              console.error(err)
              setTimeout(() => { writeInFlight = false }, 2000)
            })
        } else {
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
