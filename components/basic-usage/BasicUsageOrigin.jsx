import React, { useState } from "react";
import useSWR from "swr";

const fetcher = (id) =>
  fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`
  ).then((r) => r.json());

export default function Blog() {
  const [id, setId] = useState(1);
  const { data, error } = useSWR(id, fetcher);

  return (
    <div>
      <h1>My Blog</h1>
      <button onClick={() => setId(1)}>Blog 1</button>{" "}
      <button onClick={() => setId(2)}>Blog 2</button>{" "}
      <button onClick={() => setId(3)}>Blog 3</button>
      {error ? (
        <p>Failed to load</p>
      ) : data ? (
        <p>
          <strong>
            Blog {id}: {data.title}
          </strong>
          <p>{data.body}</p>
        </p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
