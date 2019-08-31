
# reconciliation algorithm

x first iteration:
  remount the entire subtree (don't need virtual DOM to do this)
x setState triggers re-render
  might need to store DOM nodes inside component
second iteration:
  need to prevent remounting of descendant components that were in the previous render

could use virtual DOM so that old and new children (which might include components) can be compared

