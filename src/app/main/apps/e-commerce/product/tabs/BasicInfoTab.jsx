import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Controller, useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import { getCategories } from "@mock-api/api/api/auth.product";

/**
 * The basic info tab.
 */
function BasicInfoTab() {
  const methods = useFormContext();
  const { control, formState } = methods;
  const { errors } = formState;
  const [categories, setCategories] = useState([]);

  // Simulación de carga de categorías (puedes cargarlas desde una API)
  useEffect(() => {
    async function getCategory() {
      try {
        const res = await getCategories();
        console.log(res);
        let data = [];
        res.data.forEach(element => {
          data.push(element.nameCategory)
        });
        setCategories(data)
      } catch (error) {
        console.log(error);
      }
    }
    // Aquí deberías obtener las categorías de tu fuente de datos
    getCategory()
  }, []);
  return (
    <div>
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            required
            label="Nombre"
            autoFocus
            id="name"
            variant="outlined"
            fullWidth
            error={!!errors.name}
            helperText={errors?.name?.message}
          />
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            id="description"
            label="Descripción"
            type="text"
            multiline
            rows={5}
            variant="outlined"
            fullWidth
          />
        )}
      />

      <Controller
        name="categories"
        control={control}
        defaultValue={null} // Cambia el defaultValue a null en lugar de un array vacío
        render={({ field: { onChange, value } }) => (
          <Autocomplete
            className="mt-8 mb-16"
            // Elimina la propiedad 'multiple' para permitir solo una selección
            options={categories}
            value={value}
            onChange={(event, newValue) => {
              onChange(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select a category"
                label="Categoría"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        )}
      />


      <Controller
        name="tags"
        control={control}
        defaultValue={[]}
        render={({ field: { onChange, value } }) => (
          <Autocomplete
            className="mt-8 mb-16"
            multiple
            freeSolo
            options={[]}
            value={value}
            onChange={(event, newValue) => {
              onChange(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select multiple tags"
                label="Etiquetas"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        )}
      />
    </div>
  );
}

export default BasicInfoTab;
