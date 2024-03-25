import { useGetIdentity, List } from "react-admin";
import { Typography } from "@mui/material";
import { KanbanBoardContent } from "./kanban";
import { PaintListContent } from "./list";

export * from "./list";
export * from "./kanban";

export enum Status {
  Available = "available",
  RunningLow = "running_low",
  OutOfStock = "out_of_stock",
}
export interface Paint {
  id: string;
  color: string;
  status: Status;
  inventory: number;
  index?: number;
}

export type PaintsByStatus = Record<Status, Paint[]>;

export const StatusNames: Record<Status, string> = {
  available: "Available",
  running_low: "Running Low",
  out_of_stock: "Out of Stock",
};

export const listOfStatus: string[] = [
  Status.Available,
  Status.RunningLow,
  Status.OutOfStock,
];

export const PaintDashboard = () => {
  const { data: identity, isLoading } = useGetIdentity();

  const canViewKanban = identity?.is_head_office_staff;
  const canViewList = identity?.can_view_paint_list;
  return canViewKanban ? (
    <List
      perPage={10}
      sort={{ field: "index", order: "ASC" }}
      pagination={false}
      component="div"
    >
      <KanbanBoardContent />
    </List>
  ) : canViewList ? (
    <List>
      <PaintListContent />
    </List>
  ) : (
    <Typography mt={3} align="center">
      Please contact Admin for access to view the paint dashboard
    </Typography>
  );
};
