import {
  Edit,
  SimpleForm,
  TextInput,
  SaveButton,
  NumberInput,
  Toolbar,
  required,
  minValue,
  SelectInput,
  useDataProvider,
  useEditController,
  useNotify,
  useRedirect,
  useGetIdentity,
} from "react-admin";
import { upperFirst } from "lodash";
import { useMutation } from "react-query";
import { MyDataProvider } from "../../dataProvider";

export const FormActions = () => {
  return (
    <Toolbar>
      <SaveButton />
    </Toolbar>
  );
};

export const PaintEdit = () => {
  const dataProvider = useDataProvider();
  const { record } = useEditController();
  const notify = useNotify();
  const redirect = useRedirect();
  const { data: identity } = useGetIdentity();

  const canEditInventory = identity?.can_edit_paint_inventory;
  const canEditStatus = identity?.can_edit_paint_status;

  const inventoryMutation = useMutation<
    void,
    Error,
    {
      source: Parameters<MyDataProvider["updatePaintInventory"]>[0];
      destination: Parameters<MyDataProvider["updatePaintInventory"]>[1];
    }
  >(
    ({ source, destination }) =>
      dataProvider.updatePaintInventory(source, destination),
    {
      onSuccess: () => {
        redirect("list");
        notify("Paint inventory updated");
      },
      onError: (error) => {
        notify(`Paint Inventory update failed due to ${error}`);
      },
    }
  );
  const statusMutation = useMutation<
    void,
    Error,
    {
      source: Parameters<MyDataProvider["updatePaintStatus"]>[0];
      destination: Parameters<MyDataProvider["updatePaintStatus"]>[1];
    }
  >(
    ({ source, destination }) =>
      dataProvider.updatePaintStatus(source, destination),
    {
      onSuccess: () => {
        redirect("list");
        notify("Paint status updated");
      },
      onError: (error) => {
        notify(`Paint Status update failed due to ${error}`);
      },
    }
  );

  const handleSubmit = (data: { [key: string]: any }) => {
    if (canEditInventory) {
      // Update the inventory
      inventoryMutation.mutateAsync({
        source: record,
        destination: {
          id: record.id,
          inventory: Number(data.inventory),
        },
      });
    }

    if (canEditStatus) {
      statusMutation.mutateAsync({
        source: record,
        destination: {
          id: record.id,
          status: data.status,
        },
      });
    }
  };

  return (
    <Edit
      title={`Edit ${
        record?.color ? upperFirst(record.color) : ""
      } Paint Inventory`}
    >
      <SimpleForm onSubmit={handleSubmit} toolbar={<FormActions />}>
        <TextInput disabled label="Id" source="id" />
        <TextInput disabled label="Color" source="color" />
        <SelectInput
         disabled={!canEditStatus}
          source="status"
          choices={[
            { id: "available", name: "Available" },
            { id: "running_low", name: "Running Low" },
            { id: "out_of_stock", name: "Out of Stock" },
          ]}
        />
        <NumberInput
          disabled={!canEditInventory}
          source="inventory"
          validate={[required(), minValue(0)]}
          step={1}
        />
      </SimpleForm>
    </Edit>
  );
};
