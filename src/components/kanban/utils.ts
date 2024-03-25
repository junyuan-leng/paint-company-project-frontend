import { StatusNames, listOfStatus } from "..";
import type { Paint, PaintsByStatus, Status } from "..";

export const getPaintsByStatus = (paints: Paint[]) => {
  const statuses = Object.keys(StatusNames);
  const initialPaintsByStatus = statuses.reduce((acc, cur) => {
    return { ...acc, [cur]: [] };
  }, {} as PaintsByStatus);

  const paintsByStatus: PaintsByStatus = paints.reduce((acc, paint, currentIndex) => {
    acc[paint.status].push({...paint, index: currentIndex});
    return acc;
  }, initialPaintsByStatus);

  return paintsByStatus;
};

export const updateLocalPaintsStatus = (
  sourcePaint: Paint,
  source: { status: Paint["status"]; index: number },
  destination: {
    status: Paint["status"];
    index?: number; // undefined if dropped after the end of the column
  },
  paintsByStatus: PaintsByStatus
) => {
  if (source.status === destination.status) {
    // moving within the column
    const column = paintsByStatus[source.status];
    column.splice(source.index, 1);
    column.splice(destination.index ?? column.length + 1, 0, sourcePaint);
    return {
      ...paintsByStatus,
      [destination.status]: column,
    };
  } else {
    // moving across columns
    const sourceColumn = paintsByStatus[source.status];
    const destinationColumn = paintsByStatus[destination.status];
    sourceColumn.splice(source.index, 1);
    destinationColumn.splice(
      destination.index ?? destinationColumn.length + 1,
      0,
      sourcePaint
    );
    return {
      ...paintsByStatus,
      [source.status]: sourceColumn,
      [destination.status]: destinationColumn,
    };
  }
};
