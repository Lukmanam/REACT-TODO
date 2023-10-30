import React, { useRef, useState, useEffect } from "react";
import "./Todo.css";
import { IoMdDoneAll } from "react-icons/io";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import localforage from "localforage"; // Import localforage

// Configure localforage
localforage.config({
  name: "todoApp", // Name of your app (you can change this)
  storeName: "todos", // Name of the store (you can change this)
});

function Todo() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(0);

  useEffect(() => {
    // Load data from localforage when the component mounts
    localforage.getItem("todos").then((storedTodos) => {
      if (storedTodos) {
        setTodos(storedTodos);
      }
    });
  }, []);

  useEffect(() => {
    // Save data to localforage whenever todos state changes
    localforage.setItem("todos", todos);
  }, [todos]);

  const addTodo = () => {
    if (todo !== "") {
      setTodos([...todos, { list: todo, id: Date.now(), status: false }]);
      setTodo("");
    }
   
    if (editId) {
      const editTodo = todos.find((todo) => todo.id === editId);
      const updateTodo = todos.map((to) =>
        to.id === editTodo.id
          ? (to = { id: to.id, list: todo })
          : (to = { id: to.id, list: to.list })
      );
      setTodos(updateTodo);
      setEditId(0);
      setTodo("");
    }
  };

  const handlerefresh = (e) => {
    e.preventDefault();
  };

  const inputRef = useRef(null); // Fix the useRef initialization

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const onDelete = (id) => {
    setTodos(todos.filter((to) => to.id !== id));
  };

  const onComplete = (id) => {
    let complete = todos.map((list) => {
      if (list.id === id) {
        return { ...list, status: !list.status };
      }
      return list;
    });
    setTodos(complete);
  };

  const onEdit = (id) => {
    const editTodo = todos.find((to) => to.id === id);
    setTodo(editTodo.list);
    setEditId(editTodo.id);
  };

  return (
    <div className="container">
      <h2>TO DO APP</h2>
      <form className="form-control" onSubmit={handlerefresh}>
        <input
          type="text"
          className="form-control input"
          value={todo}
          ref={inputRef}
          placeholder="Enter your task"
          onChange={(event) => setTodo(event.target.value)}
        />

        <button onClick={addTodo}>{editId ? "EDIT" : "ADD"}</button>
      </form>
      <div>
        <ul>
          {todos.map((to) => (
            <li className="list-items" key={to.id}>
              <div className="list-item-list" id={to.status ? "list-item" : ""}>
                {to.list}
              </div>
              <span>
                <IoMdDoneAll
                  className="list-item-icons"
                  id="complete"
                  title="Complete"
                  onClick={() => onComplete(to.id)}
                />
                <FiEdit
                  className="list-item-icons"
                  id="edit"
                  title="Edit"
                  onClick={() => onEdit(to.id)}
                />
                <MdDelete
                  className="list-item-icons"
                  id="delete"
                  title="Delete"
                  onClick={() => onDelete(to.id)}
                />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Todo;
