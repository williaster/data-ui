# Event-flow

demo at [williaster.github.io/data-ui](https://williaster.github.io/data-ui)

<img 
  width="700"
  src="https://user-images.githubusercontent.com/4496521/28103495-d58b2c34-668a-11e7-86c3-3b33d853153a.gif" 
/>

### A detailed description of features + usage + interpretation coming soon :v:

### Overview
The event flow visualization is meant to facilitate finding aggregate patterns in event sequences. It takes multiple user (or generically entity) event sequences as input and aggregates similar sequences together. The visualization has a variety of features to facilitate exploratory analysis:

- Allows alignment of event sequences by an arbitrary event index and event type (e.g., the 2nd click event)
- Allows selection of arbitrary subtrees of the aggregated graph; this filters to the selected subtree in the aggregate panel and shows the corresponding/selected raw event sequences in a bottom panel
- Allows filtering to / filtering out specific types of events by clicking on the legend in the right panel.
- Gives a breakdown of event type counts in the right pane including filtered + hidden depending on vis state.
- X-axis: by default aggregate nodes are positioned according to the mean elapsed time from the previous node, for closely-spaced events you can also position by sequence number (1st, 2nd, 3rd, etc)
- Node sorting: by default nodes are ordered top -> bottom based on high -> low event count meaning most common nodes appear at the top; you can also order by short -> long elapsed time to the next event.
- Trimming: For performance and noise, nodes which represent less than a minimum number of events can be hidden.
- Zooming: x- and y-axis zoom + pan is supported
