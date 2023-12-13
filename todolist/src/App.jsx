import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  const toggleTodo = (id) => {
    setTodos((prevTodos) => {
      return prevTodos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, completed: !todo.completed };
        }
        return todo;
      });
    });
  };
  const handleAddTodo = () => {
    if (newTodo.trim() !== "") {
      const newTodoObj = {
        title: newTodo,
        completed: false,
      };
      setNewTodo("");
      fetch("https://6531befe4d4c2e3f333d41d1.mockapi.io/todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodoObj),
      }).then((res) => {
        res.json().then((data) => {
          setTodos([...todos, data]);
        });
      });
    }
  };
  const handleRemoveTodo = (index) => {
    fetch(
      "https://6531befe4d4c2e3f333d41d1.mockapi.io/todo/" + todos[index].id,
      {
        method: "DELETE",
      }
    ).then((res) => {
      if (res.ok) {
        const updatedTodos = [...todos];
        updatedTodos.splice(index, 1);
        setTodos(updatedTodos);
      }
    });
  };

  const todoList = todos.map((todo, index) => (
    <div key={todo.id} className={`todo `}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleTodo(todo.id)}
      />
      <span className={`${todo.completed ? "completed" : ""}`}>
        {todo.title}
      </span>
      <button onClick={() => handleRemoveTodo(index)}>Remove</button>
    </div>
  ));

  useEffect(() => {
    fetchAllTodos().then((data) => {
      setTodos(data);
    });
  }, []);

  return (
    <div className="app">
      <h1>My To-Do List</h1>
      <div className="todo-input">
        <input
          type="text"
          placeholder="Add a new todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button onClick={handleAddTodo}>Add</button>
      </div>
      <div className="todo-list">{todoList}</div>
      <ul>
        {/*todos.map((todo, index) => (
          <li key={index}>
            {todo}
            <button onClick={() => handleRemoveTodo(index)}>Remove</button>
          </li>
        ))*/}
      </ul>
    </div>
  );
}

export default App;

async function fetchAllTodos() {
  const res = await fetch("https://6531befe4d4c2e3f333d41d1.mockapi.io/todo");
  const data = await res.json();
  return data;
}
