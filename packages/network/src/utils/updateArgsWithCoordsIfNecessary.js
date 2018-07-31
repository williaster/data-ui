export default function updateArgsWithCoordsIfNecessary(args, props) {
  return {
    ...args,
    coords: {
      ...(props.snapTooltipToDataX && { x: args.data.x }),
      ...(props.snapTooltipToDataY && { y: args.data.y }),
      ...args.coords,
    },
  };
}
