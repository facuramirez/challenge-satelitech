import { useState, useEffect } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
import axios from "axios";

export const TripModal = ({ isOpen, onClose, onSave, trip }) => {
  const [formData, setFormData] = useState({
    driver: "",
    fuel: "",
    status: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (trip) {
      setFormData({
        ...trip,
        date: new Date(trip.date).toISOString().split("T")[0],
      });
    }
  }, [trip]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (trip) {
        await axios.put(`http://localhost:3000/api/trips/${trip.id}`, formData);
      } else {
        await axios.post("http://localhost:3000/api/trips", formData);
      }
      onSave();
    } catch (error) {
      console.error("Error al guardar el viaje:", error);
    }
  };

  return (
    <Dialog open={isOpen} handler={onClose} size="md">
      <form onSubmit={handleSubmit}>
        <DialogHeader>{trip ? "Editar Viaje" : "Nuevo Viaje"}</DialogHeader>
        <DialogBody divider className="grid gap-4">
          <Input
            label="Conductor"
            name="driver"
            value={formData.driver}
            onChange={handleChange}
            required
          />
          <Select
            label="Combustible"
            name="fuel"
            value={formData.fuel}
            onChange={(value) =>
              handleChange({ target: { name: "fuel", value } })
            }
            required
          >
            <Option value="gasolina">Gasolina</Option>
            <Option value="diesel">Diesel</Option>
            <Option value="gnc">GNC</Option>
          </Select>
          <Select
            label="Estado"
            name="status"
            value={formData.status}
            onChange={(value) =>
              handleChange({ target: { name: "status", value } })
            }
            required
          >
            <Option value="pendiente">Pendiente</Option>
            <Option value="en_curso">En Curso</Option>
            <Option value="completado">Completado</Option>
            <Option value="cancelado">Cancelado</Option>
          </Select>
          <Input
            type="date"
            label="Fecha"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button variant="outlined" color="red" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="gradient" color="blue">
            Guardar
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};
