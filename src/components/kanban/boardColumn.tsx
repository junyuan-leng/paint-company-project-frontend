import { Droppable } from "@hello-pangea/dnd";
import { Box, Typography } from "@mui/material";

import { PaintCard } from "./paintCard";
import { StatusNames } from "..";
import type { Paint, Status } from "..";

export const BoardColumn = ({
  paints,
  status,
}: {
  paints: Paint[];
  status: string;
}) => (
  <Box
    sx={{
      flex: 1,
      paddingTop: "8px",
      paddingBottom: "16px",
      bgcolor: "#eaeaee",
      "&:first-child": {
        paddingLeft: "5px",
        borderTopLeftRadius: 5,
      },
      "&:last-child": {
        paddingRight: "5px",
        borderTopRightRadius: 5,
      },
    }}
  >
    <Typography align="center" variant="subtitle1">
      {StatusNames[status as Status]}
    </Typography>
    <Droppable droppableId={status}>
      {(droppableProvided, snapshot) => (
        <Box
          ref={droppableProvided.innerRef}
          {...droppableProvided.droppableProps}
          className={snapshot.isDraggingOver ? " isDraggingOver" : ""}
          sx={{
            display: "flex",
            flexDirection: "column",
            borderRadius: 5,
            padding: "5px",
            "&.isDraggingOver": {
              bgcolor: "#dadadf",
            },
          }}
        >
          {paints.map((paint, index) => (
            <PaintCard key={paint.id} paint={paint} index={index} />
          ))}
          {droppableProvided.placeholder}
        </Box>
      )}
    </Droppable>
  </Box>
);
