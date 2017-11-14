# Changelog

- [v0.0.48](#v0048)
- [v0.0.47](#v0047)

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
