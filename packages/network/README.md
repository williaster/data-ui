# @data-ui/network

demo at <a href="https://williaster.github.io/data-ui" target="_blank">williaster.github.io/data-ui</a>

## Overview
This package exports declarative react `<Network />` implemented with <a href="vx-demo.now.sh" target="_blank">@vx</a> which can be used to render network.

### Usage
See the demo at <a href="https://williaster.github.io/data-ui" target="_blank">williaster.github.io/data-ui</a> for more example outputs.

<img width="500" alt="Network Visualization" src="https://user-images.githubusercontent.com/2024960/30942113-d1baa152-a39d-11e7-940f-f7780bf15fb9.gif">


### Tooltips
The _easiest_ way to use tooltips out of the box is by passing a `renderTooltip` function to `<Network />`. This function takes an object with the shape `{ event, index, id, data }` as input and should return the inner contents of the tooltip (not the tooltip container!) as shown above. Under the covers this will wrap the `<RadialChart />` component in the exported `<WithTooltip />` HOC, which wraps the `svg` in a `<div />` and handles the positioning and rendering of an HTML-based tooltip with the contents returned by `renderTooltip()`. This tooltip is aware of the bounds of its container and should position itself "smartly".

If you'd like more customizability over tooltip rendering you can do either of the following:

1) Roll your own tooltip positioning logic and pass `onMouseMove` and `onMouseLeave` functions to `Network`. These functions are passed to the `<Node />` children and are called with the signature `onMouseMove({ datum, event })` and `onMouseLeave()` upon appropriate trigger.

2) Wrap `<Network />` in `<WithTooltip />` yourself, which accepts props for additional customization:


Name | Type | Default | Description
------------ | ------------- | ------- | ----
children | PropTypes.func or PropTypes.object | - | Child function (to call) or element (to clone) with onMouseMove, onMouseLeave, and tooltipData props/keys
className | PropTypes.string | - | Class name to add to the `<div>` container wrapper
renderTooltip | PropTypes.func.isRequired | - | Renders the _contents_ of the tooltip, signature of `({ event, data, datum, fraction }) => node`
styles | PropTypes.object | {} | Styles to add to the `<div>` container wrapper
TooltipComponent | PropTypes.func or PropTypes.object | `@vx`'s `TooltipWithBounds` | Component (not instance) to use as the tooltip container component. It is passed `top` and `left` numbers for positioning
tooltipTimeout | PropTypes.number | 200 | Timeout in ms for the tooltip to hide upon calling `onMouseLeave`

Note that currently this is implemented with `@vx/tooltips`'s `withTooltip` HOC, which adds an _additional_ div wrapper.

### Roadmap
- more layout algorithms
- dragging interaction enabled


## @data-ui packages
- <a href="https://github.com/williaster/data-ui/tree/master/packages/xy-chart" target="_blank">@data-ui/xy-chart</a>[![Version](https://img.shields.io/npm/v/@data-ui/xy-chart.svg?style=flat)](https://img.shields.io/npm/v/@data-ui/xy-chart.svg?style=flat)
- @data-ui/radial-chart [![Version](https://img.shields.io/npm/v/@data-ui/radial-chart.svg?style=flat)](https://img.shields.io/npm/v/@data-ui/radial-chart.svg?style=flat)
- <a href="https://github.com/williaster/data-ui/tree/master/packages/data-table" target="_blank">@data-ui/data-table</a> [![Version](https://img.shields.io/npm/v/@data-ui/data-table.svg?style=flat)](https://img.shields.io/npm/v/@data-ui/data-table.svg?style=flat)
- <a href="https://github.com/williaster/data-ui/tree/master/packages/data-ui-theme" target="_blank">@data-ui/theme</a> [![Version](https://img.shields.io/npm/v/@data-ui/theme.svg?style=flat)](https://img.shields.io/npm/v/@data-ui/theme.svg?style=flat)
- <a href="https://github.com/williaster/data-ui/tree/master/packages/demo" target="_blank">@data-ui/demo</a>
