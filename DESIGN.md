
# reconciliation algorithm

setState triggers re-render
  might need to store DOM nodes inside component
could use virtual DOM so that old and new children (which might include components) can be compared
first iteration:
  remount the entire subtree (don't need virtual DOM to do this)

