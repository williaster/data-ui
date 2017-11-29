# Changelog

- [v0.0.49](#v0049)
- [v0.0.48](#v0048)
- [v0.0.47](#v0047)

## v0.0.49
🏆  Enhancements
- Allows additional customization Adds `tooltipProps` to the `<WithTooltip />`which will be passed to its `TooltipComponent` (and adds example in demo) [#79](https://github.com/williaster/data-ui/pull/79)
- Exposes `@vx/responsive`'s [new observer-based `<ParentSize />` HOC](https://github.com/hshoff/vx/pull/198) [#79](https://github.com/williaster/data-ui/pull/79)
- Exposes the following props on `<BoxplotSeries />` to enable more customization: `containerProps`, `boxProps`, `outlierProps`, `minProps`, `maxProps`, `medianProps` (https://github.com/hshoff/vx/pull/198) [#80](https://github.com/williaster/data-ui/pull/80)
- Adds the ability to set mouse events on the boxplot container or on its component parts (whiskers, etc) [#80](https://github.com/williaster/data-ui/pull/80)
- Consolidates some of examples for [demo][boxplot] [#80](https://github.com/williaster/data-ui/pull/80)

🐛  Bug fix
- bumps `@vx/tooltip` to 0.0.148 for [bounds bug fix](https://github.com/hshoff/vx/pull/204) [#79](https://github.com/williaster/data-ui/pull/79)

```
Changes
 - @data-ui/demo: 0.0.48 => 0.0.49 (private)
 - @data-ui/event-flow: 0.0.48 => 0.0.49
 - @data-ui/histogram: 0.0.48 => 0.0.49
 - @data-ui/network: 0.0.48 => 0.0.49
 - @data-ui/radial-chart: 0.0.48 => 0.0.49
 - @data-ui/shared: 0.0.48 => 0.0.49
 - @data-ui/sparkline: 0.0.48 => 0.0.49
 - @data-ui/xy-chart: 0.0.48 => 0.0.49
```

## v0.0.48
💔 Breaking Changes
- [xy-chart] use `seriesKey` instead of `key` in `onMouseMove` event signature (relevant to `StackedAreaSeries`, `StackedBarSeries`, and `GroupedBarSeries` only) #73 

🏆 Enhancements
- [xy-chart] add `<StackedAreaSeries />` and example #74 
- [xy-chart] add `onClick` support to all series and voronoi #74
- [xy-chart] remove previously-required `label` prop from series #74
- [shared][tooltip] don't render a tooltip if the output of renderTooltip is `falsy` #73
- [demo] add `<LinkedXYCharts />` example with custom click handling and mouse overs #74
- [demo] add `disableMouseEvents` prop to all series #74
- removes enumeration of `@data-ui` packages in `readme`s #74

🐛 Bug Fix
- fix an offset bug for `BarSeries` with band scales #74

🏠 Internal
- [shared] bump `@vx/tooltip` to `0.0.147` for [smarter tooltips](https://github.com/hshoff/vx/blob/master/CHANGELOG.md#v00147) #74

```
 - @data-ui/data-table: 0.0.25 => 0.0.48
 - @data-ui/theme: 0.0.47 => 0.0.48
 - @data-ui/demo: 0.0.47 => 0.0.48 (private)
 - @data-ui/event-flow: 0.0.47 => 0.0.48
 - @data-ui/histogram: 0.0.47 => 0.0.48
 - @data-ui/network: 0.0.47 => 0.0.48
 - @data-ui/radial-chart: 0.0.47 => 0.0.48
 - @data-ui/shared: 0.0.47 => 0.0.48
 - @data-ui/sparkline: 0.0.47 => 0.0.48
 - @data-ui/xy-chart: 0.0.47 => 0.0.48
```

## v0.0.47

🎉 Finally syncing versions across packages! Will be easier to maintain the changelog :)

📈 Enhancements
- [sparkline] add support for tooltips #72 
- [xy-chart] add support for area bands in <AreaSeries /> #71 
- [shared] add package, move <WithTooltip /> all @data-ui packages to @data-ui/shared #72 

📜 Documentation
- [sparkline] update docs for tooltips

🏋️ Internal
- [xy-chart] absolute imports for all @vx components

Changes:
``` 
 - @data-ui/theme: 0.0.9 => 0.0.47
 - @data-ui/demo: 0.0.46 => 0.0.47 (private)
 - @data-ui/event-flow: 0.0.11 => 0.0.47
 - @data-ui/histogram: 0.0.8 => 0.0.47
 - @data-ui/network: 0.0.6 => 0.0.47
 - @data-ui/radial-chart: 0.0.11 => 0.0.47
 - @data-ui/shared: 0.0.0 => 0.0.47
 - @data-ui/sparkline: 0.0.3 => 0.0.47
 - @data-ui/xy-chart: 0.0.25 => 0.0.47
 ```
