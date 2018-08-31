# Changelog
- [v0.0.66](#v0066)
- [v0.0.65](#v0065)
- [v0.0.64](#v0064)
- [v0.0.63](#v0063)
- [v0.0.62](#v0062)
- [v0.0.61](#v0061)
- [v0.0.60](#v0060)
- [v0.0.59](#v0059)
- [v0.0.58](#v0058)
- [v0.0.57](#v0057)
- [v0.0.56](#v0056)
- [v0.0.55](#v0055)
- [v0.0.54](#v0054)
- [v0.0.53](#v0053)
- [v0.0.52](#v0052)
- [v0.0.51](#v0051)
- [v0.0.50](#v0050)
- [v0.0.49](#v0049)
- [v0.0.48](#v0048)
- [v0.0.47](#v0047)

## v0.0.66

🏆 Enhancements

[xy-chart]
- @conglei Add `horizontal` prop to `<BarSeries />` to support horizontal Bar charts [#127](https://github.com/williaster/data-ui/pull/127)
- @williaster [Demo] add linked brushable chart demo [#126](https://github.com/williaster/data-ui/pull/126)

[network]
- @conglei Expose interaction handlers on links [#128](https://github.com/williaster/data-ui/pull/128)

🐛Bug Fix 

[xy-chart]

- @williaster Allow string type `tickValues` in `*Axis` components [#126](https://github.com/williaster/data-ui/pull/126)


```
Changes:
 - @data-ui/demo: 0.0.65 => 0.0.66 (private)
 - @data-ui/network 0.0.63 => 0.0.66
 - @data-ui/xy-chart: 0.0.65 => 0.0.66
```

## v0.0.65

[xy-chart]
🏆 Enhancements
- Improves y-axis label wrapping logic to use full chart height, not inner height [#125](https://github.com/williaster/data-ui/pull/125)
- Enable setting `labelOffset` on `XAxis` and `YAxis` labels instead of setting a constant `0.7 * margin.left/right` and `0` for `YAxis` and `XAxis` respectively [#125](https://github.com/williaster/data-ui/pull/125)

```
Changes:
 - @data-ui/demo: 0.0.64 => 0.0.65 (private)
 - @data-ui/xy-chart: 0.0.64 => 0.0.65
 ```
## v0.0.64

🐛Bug Fix 

[xy-chart]
- the withTheme HOC would override the passed theme with the empty default theme from XYChart. To support overrides, combine the two objects. [#123](https://github.com/williaster/data-ui/pull/123)

[histogram]
- in the case that there's one un-binned numeric value, enforce a bin length of 1 [#123](https://github.com/williaster/data-ui/pull/123)

```
Changes:
 - @data-ui/demo: 0.0.63 => 0.0.64 (private)
 - @data-ui/histogram: 0.0.63 => 0.0.64
 - @data-ui/xy-chart: 0.0.63 => 0.0.64
 ```

## v0.0.63

[xy-chart]

🏆 Enhancements
- [@conglei] Adds support for Brushing 🎉 [#117](https://github.com/williaster/data-ui/pull/117), closes [#106](https://github.com/williaster/data-ui/issues/106)
- [@williaster] Adds <VerticalReferenceLine />, uses @vx/text for <*ReferenceLine /> labels [#120](https://github.com/williaster/data-ui/pull/120)


🏠 Internal
- [@williaster] re-exports vx deep imports to support deep importing all components from xy-chart [#122](https://github.com/williaster/data-ui/pull/122)

[histogram]
🐛Bug Fix 
- [@williaster] Fixes binning issue for numeric un-binned data [#119](https://github.com/williaster/data-ui/pull/119) and [#121](https://github.com/williaster/data-ui/pull/121), fixes [#100](https://github.com/williaster/data-ui/issues/100) and [#118](https://github.com/williaster/data-ui/issues/118)

```
Changes:
 - @data-ui/demo: 0.0.62 => 0.0.63 (private)
 - @data-ui/event-flow: 0.0.62 => 0.0.63
 - @data-ui/histogram: 0.0.62 => 0.0.63
 - @data-ui/network: 0.0.62 => 0.0.63
 - @data-ui/radial-chart: 0.0.62 => 0.0.63
 - @data-ui/shared: 0.0.62 => 0.0.63
 - @data-ui/sparkline: 0.0.62 => 0.0.63
 - @data-ui/xy-chart: 0.0.62 => 0.0.63
```

## v0.0.62

Makes the following changes to `@data-ui/xy-chart` [#113](https://github.com/williaster/data-ui/pull/113)

🏆 Enhancements
- Adds a new `<AreaDifferenceSeries />` to shade the area between two different `<AreaSeries />` based on which one has the larger value. This uses [`@vx`'s "Threshold" visualization](https://vx-demo.now.sh/threshold)

- Adds an example to the Storybook

📜 Documentation
- Updates documentation to include `<AreaDifferenceSeries />`

🏠 Internal
- uses `@data-ui/build-config` for linting + prettier in the `demo` package

```
Changes:
 - @data-ui/theme: 0.0.61 => 0.0.62
 - @data-ui/demo: 0.0.61 => 0.0.62 (private)
 - @data-ui/event-flow: 0.0.61 => 0.0.62
 - @data-ui/histogram: 0.0.61 => 0.0.62
 - @data-ui/network: 0.0.61 => 0.0.62
 - @data-ui/radial-chart: 0.0.61 => 0.0.62
 - @data-ui/shared: 0.0.61 => 0.0.62
 - @data-ui/sparkline: 0.0.61 => 0.0.62
 - @data-ui/xy-chart: 0.0.61 => 0.0.62
```

## v0.0.61

🏠 Internal
Remove node engine requirement from packages, and specify in root `package.json` only (for dev) [#112](https://github.com/williaster/data-ui/pull/112)

## v0.0.60

🏠 Internal
- Use `@data-ui/build-config` across all packages for linting, prettier, jest, and babel (`forms` + `event-flow` require webpack and still have jest deps) [#111](https://github.com/williaster/data-ui/pull/111). This 
  - fixes an issue where `node_modules` were included in builds, this improves bundle size.
  - adds `esm` builds in addition to `commonjs`
  - adds `sideEffects: false` to `package.json`'s for tree-shaking support 
  - introduces more aggressive linting + prettier ✨

## v0.0.59
[xy-chart]
🏆 Enhancements
- expose `tickComponent` prop in `XAxis` and `YAxis` components for fully-custom tick rendering [#110](https://github.com/williaster/data-ui/pull/110)
- bump all `vx` packages, which adds much better default support for tick labels (Fixes #109) [#110](https://github.com/williaster/data-ui/pull/110)

[demo]
- added tick label props playground example to demo new functionality [#110](https://github.com/williaster/data-ui/pull/110)

🏠 Internal
[shared]
-  bump all `vx` packages

```
Changes:
 - @data-ui/theme: 0.0.48 => 0.0.59
 - @data-ui/demo: 0.0.58 => 0.0.59 (private)
 - @data-ui/event-flow: 0.0.54 => 0.0.59
 - @data-ui/histogram: 0.0.58 => 0.0.59
 - @data-ui/network: 0.0.56 => 0.0.59
 - @data-ui/radial-chart: 0.0.54 => 0.0.59
 - @data-ui/shared: 0.0.54 => 0.0.59
 - @data-ui/sparkline: 0.0.54 => 0.0.59
 - @data-ui/xy-chart: 0.0.54 => 0.0.59
```

## v0.0.58
[histogram]
- 🐛Bug Fix 
- Fixes #104 error seen on DensitySeries in production [#105](https://github.com/williaster/data-ui/pull/105)

```
Changes:
 - @data-ui/demo: 0.0.57 => 0.0.58 (private)
 - @data-ui/histogram: 0.0.57 => 0.0.58
 ```

## v0.0.57
[histogram]

🏆 Enhancements [#103](https://github.com/williaster/data-ui/pull/103)

- Adds `onClick` support to `BarSeries` and `AnimatedBarSeries`
- `onClick` and `onMouseMove` functions are passed `index` in addition to `data`, `datum`, `event`, and `color`

## v0.0.56
[network] 

🐛 Bug Fix
- Trigger layout algorithm when the width, height, or margin changes [#100](https://github.com/williaster/data-ui/pull/100)

## v0.0.55
[network] 

🏆 Enhancements

- enable layout algorithms to handle scale to fit functionality [#99](https://github.com/williaster/data-ui/pull/99)

## v0.0.54
[shared] 

🐛 Bug Fix
- prefer `role="presentation"` instead of `role="button"` on `<FocusBlurHandler />` for a11y axe violation [#97](https://github.com/williaster/data-ui/pull/97)

## v0.0.53
[xy-chart]

🏆 Enhancements
- exposed circle packing `layout` as a prop so users can pass their own layout algorithm into circle packing charts. A force-driected layout (swarm plot) example is provided in demo [#96](https://github.com/williaster/data-ui/pull/96)

## v0.0.52
[network]

🏆 Enhancements

- Add `preserveAspectRatio` prop to control responsive scaling [#93](https://github.com/williaster/data-ui/pull/93)

🐛 Bug Fix

- init layout after mount to avoid pre-mount layout finish race condition [#93](https://github.com/williaster/data-ui/pull/93)

📜 Documentation

- add more complete readme, including new prop.

## v0.0.51

💔 Breaking Changes

[network]

Mouse events renamed [#89](https://github.com/williaster/data-ui/pull/89) 
- `onNodeClick` => `onClick`
- `onNodeMouseEnter` => `onMouseEnter`
- `onNodeMouseLeave` => `onMouseLeave`

🏆 Enhancements

[shared]
- adds the `@data-ui/shared` `<FocusBlurHandler />` handler that wraps mouse target nodes in an `<a />` element, which [seems to be the most reliable way to support focusing in svg 1.1/1.2](https://allyjs.io/tutorials/focusing-in-svg.html) [#88](https://github.com/williaster/data-ui/pull/88)

[xy-chart]
- adds `onFocus` and `onBlur` support to the following `<*Series />` components (the remainder depend on `@vx` exposing hooks to series dom nodes (to wrap in `<a />`s)[#88](https://github.com/williaster/data-ui/pull/88)

  | Series  | `onFocus` + `onBlur` support added |
  | ------------- | ------------- |
  | AreaSeries  | x |
  | BarSeries  | x |
  | BoxPlotSeries  | x |
  | CirclePackSeries  | x |
  | IntervalSeries | x |
  | LineSeries  | x |
  | PointSeries  | x |
  | ViolinPlotSeries  | x |
  | GroupedBarSeries  |  |
  | StackedAreaSeries |  |
  | StackedBarSeries |  |

[network]
- allow user to wrap `<Network />` in WithTooltip to support programmatic triggering and custom tooltip logic [89](https://github.com/williaster/data-ui/pull/89) 
- add `eventTriggerRefs` callback to support programmatic tooltip triggering [#89](https://github.com/williaster/data-ui/pull/89) 
- add `snapToTooltipX` and `snapToTooltipY` support [#89](https://github.com/williaster/data-ui/pull/89) 

🐛 Bug Fix

[histogram]
- Fix bug with `innerHeight` referencing [85](https://github.com/williaster/data-ui/pull/85) [#87](https://github.com/williaster/data-ui/pull/88)

[xy-chart]
- add circle packing x-bounds constraint [#91](https://github.com/williaster/data-ui/pull/91)
 
 
📜 Documentation
- update readmes with enhancements and breaking changes

🏡Internal

[network]
- fix broken network example [#89](https://github.com/williaster/data-ui/pull/89) 
- remove unused/add new `Network.propTypes` [#89](https://github.com/williaster/data-ui/pull/89) 

## v0.0.50
🏆 Enhancements

[xy-chart]
- Ability to "snap" the tooltip to the `x` or `y` value of a datum, by setting `snapTooltipToDataX` and/or `snapTooltipToDataY`. fixes #77 [#81](https://github.com/williaster/data-ui/pull/81)
- Support for using the chart _container_ for mouse events, instead of series or a voronoi. this is now set with the `eventTrigger` prop as `'series'` [default], `'voronoi'`, or `'container'`. [#81](https://github.com/williaster/data-ui/pull/81)
- The addition of container events necessitates shared tooltips, i.e., tooltips that contain data for for all series for the hovered x value. fixes #78 [#81](https://github.com/williaster/data-ui/pull/81)
- Ability to programmatically trigger events using the `eventTriggerRefs` callback (see updated `<LineSeriesExample />` for an example) [#81](https://github.com/williaster/data-ui/pull/81)
- adds `innerRef` prop which is set on the inner `svg` [#81](https://github.com/williaster/data-ui/pull/81)

[shared]
- the signature of `onMouseMove` in `<WithTooltip />` now accepts an optional `coords` object of the shape `{ x: Number, y: Number }`. If either or both of `x` or `y` is specified they will be used to set the the tooltips `left` and `top` instead of the `event`'s coordinates. [#81](https://github.com/williaster/data-ui/pull/81)

[forms] 
- adds `active` prop to `<Button />` [#81](https://github.com/williaster/data-ui/pull/81)

💔 Breaking Changes
- [xy-chart] the `<XYChart />` `useVoronoi` prop is removed. instead use `eventTrigger='voronoi` [#81](https://github.com/williaster/data-ui/pull/81)

📜 Documentation
- [xy-chart] documents the above enhancements [#81](https://github.com/williaster/data-ui/pull/81)

🏠 Internal
[xy-chart] 
- moves `<XYChart />` static method to their own utils files [#81](https://github.com/williaster/data-ui/pull/81)
- breaks out several functions in `chartUtils` into their own files [#81](https://github.com/williaster/data-ui/pull/81)
- adds and uses `sharedSeriesProps` [#81](https://github.com/williaster/data-ui/pull/81)

🐛 Bug Fix
- Fixes a bug where `tickLabelProps` is not used when passed in either `<XAxis />` or `<YAxis />`. This prop enables per-tick styles so is importanté! [#82](https://github.com/williaster/data-ui/pull/82)

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
