import { List, SearchInput } from "react-admin";

import { KanbanBoardContent } from "./kanbanBoardContent";

export const KanbanBoard = () => {
  return (
    <List
      perPage={100}
      sort={{ field: "index", order: "ASC" }}
      pagination={false}
      component="div"
    >
      <KanbanBoardContent />
    </List>
  );
};
