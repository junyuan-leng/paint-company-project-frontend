import { useEffect, useState } from "react";
import { DragDropContext, OnDragEndResponder } from "@hello-pangea/dnd";
import { Box } from "@mui/material";
import { isEqual } from "lodash";
import { useDataProvider, useListContext } from "react-admin";
import { useMutation } from "react-query";
import { MyDataProvider } from "../../dataProvider";
import { BoardColumn } from "./boardColumn";
import { getPaintsByStatus, updateLocalPaintsStatus } from "./utils";
import { listOfStatus } from "..";
import type { PaintsByStatus, Paint, Status } from "..";

export const KanbanBoardContent = () => {
  const { refetch, data: paints, isLoading } = useListContext<Paint>();

  const dataProvider = useDataProvider<MyDataProvider>();

  const [paintsByStatus, setPaintsByStatus] = useState<PaintsByStatus>(
    getPaintsByStatus([])
  );

  const mutation = useMutation<
    void,
    Error,
    {
      source: Parameters<MyDataProvider["updatePaintStatus"]>[0];
      destination: Parameters<MyDataProvider["updatePaintStatus"]>[1];
    }
  >(
    ({ source, destination }) =>
      dataProvider.updatePaintStatus(source, destination),
    { onSettled: () => refetch() }
  );

  useEffect(() => {
    if (paints) {
      const newPostsByStatus = getPaintsByStatus(paints);
      if (!isEqual(newPostsByStatus, paintsByStatus)) {
        setPaintsByStatus(newPostsByStatus);
      }
    }
  }, [paints]);

  const onDragEnd: OnDragEndResponder = (result) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceStatus = source.droppableId as Paint["status"];
    const destinationStatus = destination.droppableId as Paint["status"];
    const sourcePaint = paintsByStatus[sourceStatus][source.index]!;
    const destinationPaint = paintsByStatus[destinationStatus][
      destination.index
    ] ?? {
      status: destinationStatus,
      index: undefined, // undefined if dropped after the last item
    };

    // compute local state change synchronously
    setPaintsByStatus(
      updateLocalPaintsStatus(
        sourcePaint,
        { status: sourceStatus, index: source.index },
        { status: destinationStatus, index: destination?.index },
        paintsByStatus
      )
    );

    // Trigger API call 
    mutation.mutateAsync({
      source: sourcePaint,
      destination: destinationPaint,
    });
  };

  return isLoading ? null : (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box display="flex">
        {listOfStatus.map((status) => (
          <BoardColumn
            paints={paintsByStatus[status as Status]}
            key={status}
            status={status}
          />
        ))}
      </Box>
    </DragDropContext>
  );
};
