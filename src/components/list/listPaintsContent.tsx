import { Datagrid, TextField, EditButton } from "react-admin";

export const PaintListContent = () => {
  return (
    <Datagrid rowClick="edit" bulkActionButtons={false}>
      <TextField source="color" />
      <TextField source="status" />
      <TextField source="inventory" />
      <EditButton />
    </Datagrid>
  );
};

export default PaintListContent;
