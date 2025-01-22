import { Field, Formik, Form, ErrorMessage } from "formik";
import { useState, useEffect } from "react";
import { object, string, number } from "yup";

const defaultValues = {
  name: "",
  phone: "",
};

const PhoneForm = () => {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const savedContacts = localStorage.getItem("contacts");
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    }
  }, []);

  const saveToLocalStorage = (contacts) => {
    localStorage.setItem("contacts", JSON.stringify(contacts));
  };

  const userSchema = object({
    name: string("Lütfen isim giriniz")
      .required("Zorunlu alan")
      .min(3, "3 karakterden az isim girmeyiniz")
      .max(50, "Maksimum 50 karakter giriniz")
      .test(
        "unique-name",
        "Bu isim zaten mevcut!",
        (value) => !contacts.some((contact) => contact.name === value)
      ),
    phone: number("Lütfen bir telefon numarası giriniz").required(
      "Zorunlu alan"
    ),
  });

  const addContact = (newContact) => {
    const updatedContacts = [...contacts, newContact];
    setContacts(updatedContacts);
    saveToLocalStorage(updatedContacts);
  };

  const deleteContact = (name) => {
    const updatedContacts = contacts.filter((contact) => contact.name !== name);
    setContacts(updatedContacts);
    saveToLocalStorage(updatedContacts);
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
      }}
    >
      <Formik
        initialValues={defaultValues}
        validationSchema={userSchema}
        onSubmit={(values, actions) => {
          addContact(values);
          actions.resetForm();
        }}
      >
        <Form
          style={{
            display: "flex",
            width: "300px",
            height: "400px",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "10px",
            border: "1px solid white",
            borderRadius: "20px",
            padding: "10px",
          }}
        >
          <h2 style={{}}>Phone List</h2>
          <label>Name</label>
          <Field type="text" name="name" />
          <ErrorMessage name="name" component="div" style={{ color: "red" }} />
          <label>Phone Number</label>
          <Field type="" name="phone" />
          <ErrorMessage name="phone" component="div" style={{ color: "red" }} />
          <button type="submit">Add</button>
        </Form>
      </Formik>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            margin: "20px 0",
            padding: "10px",
            fontSize: "16px",
            width: "80%",
          }}
        />

        <ul
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {filteredContacts.map((contact, index) => (
            <li
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              {contact.name} - {contact.phone}
              <button onClick={() => deleteContact(contact.name)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PhoneForm;
