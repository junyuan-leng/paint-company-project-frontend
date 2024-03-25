import { Draggable } from "@hello-pangea/dnd";
import { Box, Card, CardActions, CardContent, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { upperFirst } from "lodash";

import { EditButton } from "react-admin";
import { StatusNames } from "..";
import type { Paint } from "..";

const primary: { [key: string]: string } = {
  black: "#212121",
  white: "#fafafa",
  grey: "#757575",
  blue: "#1565c0",
  purple: "#512da8",
};

export const PaintCard = ({
  paint,
  index,
}: {
  paint: Paint;
  index: number;
}) => {
  return (
    <Draggable draggableId={paint.id} index={index}>
      {(provided, snapshot) => (
        <Box
          ref={provided.innerRef}
          sx={{ marginBottom: 1 }}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card
            style={{
              opacity: snapshot.isDragging ? 0.7 : 1,
              transform: snapshot.isDragging ? "rotate(-3deg)" : "",
            }}
            elevation={snapshot.isDragging ? 2 : 1}
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {`Color: ${upperFirst(paint.color)}`}
                </Typography>
                <Typography variant="body1">{`Inventory: ${paint.inventory}`}</Typography>
                <Typography variant="body1">{`Status: ${
                  StatusNames[paint.status]
                }`}</Typography>
              </CardContent>
              <CardActions>
                <EditButton resource="paints" record={paint} />
              </CardActions>
            </Box>
            <Box
              sx={{
                width: "20%",
                borderRadius: 1,
                bgcolor: `${primary[paint.color]}`,
              }}
            />
          </Card>
        </Box>
      )}
    </Draggable>
  );
};
