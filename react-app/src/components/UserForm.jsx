import React, { useState, useEffect } from "react";
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";

const UserForm = ({ touched, errors, status }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        status && setUsers(users => [...users, status]);
    }, [status]);

    return (
        <div className="form-wrapper">
            <Form>
                <label htmlFor="name">
                    Name:
                    <Field id="name" name="name" type="text" placeholder="Name" />
                    {touched.name && errors.name && (
                        <p className="errors">{errors.name}</p>)}
                </label>
                <label htmlFor="email">
                    Email:
                    <Field id="email" name="email" type="email" placeholder="Email" />
                    {touched.email && errors.email && (
                        <p className="errors">{errors.email}</p>)}
                </label>
                <label htmlFor="password">
                    Password:
                    <Field id="password" name="password" type="password" placeholder="Password" />
                    {touched.password && errors.password && (
                        <p className="errors">{errors.password}</p>)}
                </label>
                <Field name="role" as="select">
                    <option disabled value="default">Select Role</option>
                    <option value="CEO">CEO</option>
                    <option value="CFO">CFO</option>
                    <option value="CTO">CTO</option>
                    <option value="Intern">Intern</option>
                </Field>
                {touched.role && errors.role && (
                    <p className="errors">{errors.role}</p>)}
                <label htmlFor="checkbox">
                    <Field id="checkbox" name="checkbox" type="checkbox" />
                    I have read and agree to the Terms of Service
                    {touched.checkbox && errors.checkbox && (
                        <p className="errors">{errors.checkbox}</p>)}
                </label>
                <button type="submit">Submit</button>
            </Form>
            {users.map(user => (
                <div key={user.id} className="user-card">
                    <h2>{user.name}</h2>
                    <p>Email: {user.email}</p>
                    <p>Password: {user.password}</p>
                    <p>Role: {user.role}</p>
                    <p>Agreed to terms: {`${user.checkbox}`}</p>
                </div>
            ))}
        </div>
    )
}

const FormikUserForm = withFormik({
    mapPropsToValues({ name, email, password, role, checkbox }) {
        return {
            name: name || "",
            email: email || "",
            password: password || "",
            role: role || "default",
            checkbox: checkbox || false
        };
    },
    validationSchema: Yup.object().shape({
        name: Yup.string().required(),
        email: Yup.string().email().required(),
        password: Yup.string().required(),
        role: Yup.string().oneOf(['CFO', 'CTO', 'CEO', 'Intern']),
        checkbox: Yup.boolean().oneOf([true], "Must accept terms and conditions.")
    }),
    handleSubmit(values, { setStatus, resetForm }) {
        console.log(values);
        axios.post("https://reqres.in/api/users", values)
            .then(res => {
                console.log(res);
                setStatus(res.data);
                resetForm();
            })
            .catch(err => console.log(err));
    }
})(UserForm);

export default FormikUserForm;