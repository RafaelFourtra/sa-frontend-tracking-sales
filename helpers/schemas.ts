import { object, ref, string } from "yup";

export const LoginSchema = object().shape({
  email: string()
    .email("Field ini harus berupa email")
    .required("Email wajib diisi"),
  password: string().required("Password wajib diisi"),
});

export const RegisterSchema = object().shape({
  name: string().required("Name is required"),
  email: string()
    .email("This field must be an email")
    .required("Email is required"),
  password: string().required("Password is required"),
  confirmPassword: string()
    .required("Confirm password is required")
    .oneOf([ref("password")], "Passwords must match"),
});
